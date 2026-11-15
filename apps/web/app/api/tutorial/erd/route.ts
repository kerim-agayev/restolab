/**
 * Gün 14 lab endpoint'i: Prisma ile control_db'deki users / restaurants / memberships.
 *   GET  /api/tutorial/erd                          → restoranlar + çalışanları (JOIN'i Prisma yazar)
 *   POST /api/tutorial/erd {"action": "..."}        → bir yazma DENE, sonucu göster, HER ZAMAN geri al (ROLLBACK)
 *        valid             → geçerli üyelik (Rauf → Çay Bağı)                → başarılı ama geri alınır
 *        fk-restaurant     → var olmayan restorana (id 999) üye ekle          → FK ihlali (Prisma P2003 / Postgres 23503)
 *        fk-user           → var olmayan kişiyi (id 999) üye yap              → FK ihlali
 *        duplicate         → Leyla'yı Dolma Evi'ne ikinci kez ekle            → unique ihlali (P2002 / 23505)
 *        delete-restaurant → çalışanı olan restoranı sil                      → Restrict: sildirmez
 * Zararsız: her yazma bir transaction içinde ve sonunda bilerek geri alınır → veri hiç değişmez.
 */
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

const ACTIONS = ["valid", "fk-restaurant", "fk-user", "duplicate", "delete-restaurant"] as const;
type Action = (typeof ACTIONS)[number];

class Rollback extends Error {
  constructor(public result: unknown) {
    super("rollback");
  }
}

function headers(requestId: string) {
  return { "x-request-id": requestId, "cache-control": "no-store" };
}

function log(level: "info" | "warn" | "error", requestId: string, extra: Record<string, unknown>) {
  console[level === "info" ? "log" : level](JSON.stringify({ level, msg: "tutorial.erd", requestId, ...extra }));
}

function missingEnv(requestId: string) {
  log("error", requestId, { status: 500, error: "DATABASE_URL missing" });
  return Response.json(
    { requestId, error: "DATABASE_URL tanımlı değil", hint: "Gün 13: apps/web/.env.local ve Vercel → Environment Variables." },
    { status: 500, headers: headers(requestId) },
  );
}

/** Postgres'in kendi hata kodunu (SQLSTATE) Prisma hatasının içinden çıkar. */
function pgCode(e: Prisma.PrismaClientKnownRequestError): string | undefined {
  const meta = e.meta as { driverAdapterError?: { cause?: { originalCode?: string } } } | undefined;
  return meta?.driverAdapterError?.cause?.originalCode;
}

export async function GET(): Promise<Response> {
  const requestId = crypto.randomUUID();
  if (!process.env.DATABASE_URL) return missingEnv(requestId);
  try {
    const t0 = performance.now();
    const restaurants = await getPrisma().restaurant.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        memberships: { orderBy: { id: "asc" }, select: { role: true, user: { select: { id: true, name: true, email: true } } } },
      },
    });
    const queryMs = Math.round(performance.now() - t0);
    log("info", requestId, { status: 200, queryMs, restaurants: restaurants.length });
    return Response.json({ requestId, queryMs, restaurants }, { headers: headers(requestId) });
  } catch (e) {
    const err = e as Error & { code?: string };
    log("error", requestId, { status: 500, code: err.code, message: err.message });
    return Response.json({ requestId, error: "Sorgu başarısız", code: err.code, message: err.message }, { status: 500, headers: headers(requestId) });
  }
}

export async function POST(request: Request): Promise<Response> {
  const requestId = crypto.randomUUID();
  if (!process.env.DATABASE_URL) return missingEnv(requestId);

  const body = (await request.json().catch(() => null)) as { action?: string } | null;
  const action = body?.action as Action | undefined;
  if (!action || !ACTIONS.includes(action)) {
    return Response.json({ requestId, error: "Bilinmeyen action", allowed: ACTIONS }, { status: 400, headers: headers(requestId) });
  }

  const prisma = getPrisma();
  const t0 = performance.now();
  try {
    await prisma.$transaction(async (tx) => {
      const leyla = await tx.user.findUniqueOrThrow({ where: { email: "leyla@restolab.test" } });
      const rauf = await tx.user.findUniqueOrThrow({ where: { email: "rauf@restolab.test" } });
      const dolma = await tx.restaurant.findUniqueOrThrow({ where: { slug: "dolma-evi" } });
      const cay = await tx.restaurant.findUniqueOrThrow({ where: { slug: "cay-bagi" } });

      let result: unknown;
      if (action === "valid") result = await tx.membership.create({ data: { userId: rauf.id, restaurantId: cay.id, role: "WAITER" } });
      if (action === "fk-restaurant") result = await tx.membership.create({ data: { userId: leyla.id, restaurantId: 999, role: "WAITER" } });
      if (action === "fk-user") result = await tx.membership.create({ data: { userId: 999, restaurantId: dolma.id, role: "WAITER" } });
      if (action === "duplicate") result = await tx.membership.create({ data: { userId: leyla.id, restaurantId: dolma.id, role: "WAITER" } });
      if (action === "delete-restaurant") result = await tx.restaurant.delete({ where: { id: dolma.id } });

      // Buraya geldiysek yazma BAŞARILI oldu. Ama lab verisi bozulmasın diye bilerek geri alıyoruz.
      throw new Rollback(result);
    });
    throw new Error("unreachable");
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    if (e instanceof Rollback) {
      log("info", requestId, { status: 200, action, outcome: "ok-rolled-back", ms });
      return Response.json(
        { requestId, action, ok: true, rolledBack: true, wouldHaveSaved: e.result, ms },
        { headers: headers(requestId) },
      );
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const status = e.code === "P2002" ? 409 : 422;
      const out = { requestId, action, ok: false, prismaCode: e.code, postgresCode: pgCode(e), message: e.message.trim().split("\n").at(-1), meta: e.meta, ms };
      log("warn", requestId, { status, action, prismaCode: e.code, postgresCode: out.postgresCode });
      return Response.json(out, { status, headers: headers(requestId) });
    }
    const err = e as Error & { code?: string };
    log("error", requestId, { status: 500, action, code: err.code, message: err.message });
    return Response.json({ requestId, action, ok: false, error: err.message, code: err.code }, { status: 500, headers: headers(requestId) });
  }
}
