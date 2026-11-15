/**
 * Gün 15 lab endpoint'i: tadilat defteri (migrations) ve plansız değişiklik (drift).
 *   GET  /api/tutorial/migrations                  → repodaki migration'lar vs veritabanındaki defter (_prisma_migrations)
 *                                                   + şemanın beklediği sütunlar vs veritabanındaki gerçek sütunlar
 *   POST /api/tutorial/migrations {"action": "..."} → bir tadilatı DENE, sonucu göster, HER ZAMAN geri al (ROLLBACK)
 *        safe     → boş bırakılabilir sütun ekle, eski kod çalışmaya devam ediyor mu?   → evet (güvenli değişiklik)
 *        drift    → planda olmayan sütunu elle ekle (wifi_password)                       → drift tespit edilir
 *        rename   → name sütununun adını değiştir, eski kod sorgu atsın                    → P2022: sütun yok
 *        not-null → dolu tabloya zorunlu (NOT NULL) sütun ekle                             → 23502: eski satırlar boş kalır
 * Zararsız: Postgres'te tablo değişiklikleri (DDL) de transaction içinde geri alınabilir. Kilit en fazla 2 sn beklenir.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

const ACTIONS = ["safe", "drift", "rename", "not-null"] as const;
type Action = (typeof ACTIONS)[number];

/** schema.prisma'nın beklediği veritabanı sütunları. Şemaya alan eklenip burası güncellenmezse TypeScript hata verir. */
function cols<E extends Record<string, string>>(map: Record<keyof E, string>): string[] {
  return Object.values(map).sort();
}
const EXPECTED: Record<string, string[]> = {
  users: cols<typeof Prisma.UserScalarFieldEnum>({ id: "id", email: "email", name: "name", createdAt: "created_at" }),
  restaurants: cols<typeof Prisma.RestaurantScalarFieldEnum>({
    id: "id",
    slug: "slug",
    name: "name",
    timezone: "timezone",
    phone: "phone",
    createdAt: "created_at",
  }),
  memberships: cols<typeof Prisma.MembershipScalarFieldEnum>({
    id: "id",
    userId: "user_id",
    restaurantId: "restaurant_id",
    role: "role",
    createdAt: "created_at",
  }),
};

type Db = Prisma.TransactionClient | ReturnType<typeof getPrisma>;

async function actualColumns(db: Db): Promise<Record<string, string[]>> {
  const rows = await db.$queryRaw<{ table_name: string; column_name: string }[]>`
    select table_name, column_name from information_schema.columns
    where table_schema = 'public' and table_name in ('users', 'restaurants', 'memberships')
    order by table_name, column_name`;
  const out: Record<string, string[]> = {};
  for (const r of rows) (out[r.table_name] ??= []).push(r.column_name);
  return out;
}

/** Şema (kod) ile veritabanı arasındaki fark. */
function compare(actual: Record<string, string[]>) {
  const missingInDb: string[] = [];
  const extraInDb: string[] = [];
  for (const [t, exp] of Object.entries(EXPECTED)) {
    const act = actual[t] ?? [];
    for (const c of exp) if (!act.includes(c)) missingInDb.push(`${t}.${c}`);
    for (const c of act) if (!exp.includes(c)) extraInDb.push(`${t}.${c}`);
  }
  return { missingInDb, extraInDb };
}

async function repoMigrations(): Promise<string[] | null> {
  try {
    const dir = path.join(process.cwd(), "prisma", "migrations");
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return null;
  }
}

const headers = (requestId: string) => ({ "x-request-id": requestId, "cache-control": "no-store" });
function log(level: "info" | "warn" | "error", requestId: string, extra: Record<string, unknown>) {
  console[level === "info" ? "log" : level](JSON.stringify({ level, msg: "tutorial.migrations", requestId, ...extra }));
}
function missingEnv(requestId: string) {
  log("error", requestId, { status: 500, error: "DATABASE_URL missing" });
  return Response.json({ requestId, error: "DATABASE_URL tanımlı değil" }, { status: 500, headers: headers(requestId) });
}

export async function GET(): Promise<Response> {
  const requestId = crypto.randomUUID();
  if (!process.env.DATABASE_URL) return missingEnv(requestId);
  try {
    const prisma = getPrisma();
    const ledger = await prisma.$queryRaw<
      { migration_name: string; finished_at: Date | null; rolled_back_at: Date | null; applied_steps_count: number; checksum: string }[]
    >`select migration_name, finished_at, rolled_back_at, applied_steps_count, checksum from _prisma_migrations order by started_at`;
    const repo = await repoMigrations();
    const applied = ledger.filter((m) => m.finished_at && !m.rolled_back_at).map((m) => m.migration_name);
    const pending = repo ? repo.filter((m) => !applied.includes(m)) : null;
    const diff = compare(await actualColumns(prisma));
    const body = {
      requestId,
      repo,
      ledger: ledger.map((m) => ({
        name: m.migration_name,
        finishedAt: m.finished_at,
        rolledBack: Boolean(m.rolled_back_at),
        checksum: m.checksum.slice(0, 12) + "…",
      })),
      pending,
      ...diff,
      verdict:
        diff.extraInDb.length > 0
          ? "drift"
          : pending && pending.length > 0
            ? "pending"
            : diff.missingInDb.length > 0
              ? "missing"
              : "in-sync",
    };
    log("info", requestId, { status: 200, verdict: body.verdict, pending, extraInDb: diff.extraInDb });
    return Response.json(body, { headers: headers(requestId) });
  } catch (e) {
    const err = e as Error & { code?: string };
    log("error", requestId, { status: 500, code: err.code, message: err.message });
    return Response.json({ requestId, error: "Sorgu başarısız", code: err.code, message: err.message }, { status: 500, headers: headers(requestId) });
  }
}

class Rollback extends Error {
  constructor(public result: Record<string, unknown>) {
    super("rollback");
  }
}

const DDL: Record<Action, string> = {
  safe: `alter table restaurants add column kampaniya text`,
  drift: `alter table restaurants add column wifi_password text`,
  rename: `alter table restaurants rename column name to title`,
  "not-null": `alter table restaurants add column vat_no text not null`,
};

export async function POST(request: Request): Promise<Response> {
  const requestId = crypto.randomUUID();
  if (!process.env.DATABASE_URL) return missingEnv(requestId);
  const body = (await request.json().catch(() => null)) as { action?: string } | null;
  const action = body?.action as Action | undefined;
  if (!action || !ACTIONS.includes(action)) {
    return Response.json({ requestId, error: "Bilinmeyen action", allowed: ACTIONS }, { status: 400, headers: headers(requestId) });
  }

  const t0 = performance.now();
  try {
    await getPrisma().$transaction(async (tx) => {
      // Kilit beklemesi ve sorgu süresi sınırlı: lab canlı tabloyu uzun süre kilitleyemez.
      await tx.$executeRawUnsafe(`set local lock_timeout = '2s'`);
      await tx.$executeRawUnsafe(`set local statement_timeout = '5s'`);
      await tx.$executeRawUnsafe(DDL[action]);
      // Tadilattan sonra "eski kod" (Gün 14'teki sorgu) hâlâ çalışıyor mu?
      const oldCode = await tx.restaurant.findMany({ select: { id: true, name: true }, orderBy: { id: "asc" } });
      const diff = compare(await actualColumns(tx));
      throw new Rollback({ sql: DDL[action], oldCodeStillWorks: true, oldCodeRows: oldCode.length, ...diff });
    });
    throw new Error("unreachable");
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    if (e instanceof Rollback) {
      log("info", requestId, { status: 200, action, outcome: "ok-rolled-back", extraInDb: e.result.extraInDb, ms });
      return Response.json({ requestId, action, ok: true, rolledBack: true, ...e.result, ms }, { headers: headers(requestId) });
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const meta = e.meta as { driverAdapterError?: { cause?: { originalCode?: string; originalMessage?: string } } } | undefined;
      const out = {
        requestId,
        action,
        ok: false,
        rolledBack: true,
        sql: DDL[action],
        prismaCode: e.code,
        postgresCode: meta?.driverAdapterError?.cause?.originalCode,
        message: meta?.driverAdapterError?.cause?.originalMessage ?? e.message.trim().split("\n").at(-1),
        ms,
      };
      log("warn", requestId, { status: 422, action, prismaCode: e.code, postgresCode: out.postgresCode });
      return Response.json(out, { status: 422, headers: headers(requestId) });
    }
    const err = e as Error & { code?: string };
    log("error", requestId, { status: 500, action, code: err.code, message: err.message });
    return Response.json({ requestId, action, ok: false, rolledBack: true, sql: DDL[action], error: err.message, code: err.code, ms }, { status: 500, headers: headers(requestId) });
  }
}
