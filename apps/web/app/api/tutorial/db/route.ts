/**
 * Gün 13 lab endpoint'i: Neon'daki control_db'ye gerçekten bağlan ve sor.
 *   GET /api/tutorial/db                 → pooled havuzdan: version, current_database, now, TimeZone + süre
 *   GET /api/tutorial/db?compare=1       → pooled vs direct (unpooled) bağlantı kurma süresi
 *   GET /api/tutorial/db?break=password  → bilerek yanlış şifre        → Postgres hata kodu 28P01
 *   GET /api/tutorial/db?break=database  → bilerek olmayan veritabanı  → 3D000
 *   GET /api/tutorial/db?break=host      → bilerek çözülemeyen host    → ENOTFOUND (Gün 6: DNS!)
 * Zararsız: sadece okur (SELECT). Cevapta ve logda şifre ASLA yer almaz.
 */
import { Client } from "pg";
import { describeUrl, getPool, hasDatabaseUrl } from "@/lib/db";

type PgError = Error & { code?: string };

function mutate(url: string, kind: string): string {
  const u = new URL(url);
  if (kind === "password") u.password = "yanlis_sifre";
  if (kind === "database") u.pathname = "/olmayan_db";
  if (kind === "host") u.hostname = "ep-olmayan-host.invalid";
  return u.toString();
}

async function timedConnect(connectionString: string) {
  const c = new Client({ connectionString, connectionTimeoutMillis: 8000 });
  const t0 = performance.now();
  try {
    await c.connect();
    const connectMs = Math.round(performance.now() - t0);
    const t1 = performance.now();
    await c.query("select 1");
    return { ok: true as const, connectMs, queryMs: Math.round(performance.now() - t1) };
  } catch (e) {
    const err = e as PgError;
    return { ok: false as const, ms: Math.round(performance.now() - t0), code: err.code ?? "UNKNOWN", message: err.message };
  } finally {
    await c.end().catch(() => {});
  }
}

export async function GET(request: Request): Promise<Response> {
  const requestId = crypto.randomUUID();
  const started = performance.now();
  const url = new URL(request.url);
  const headers = { "x-request-id": requestId, "cache-control": "no-store" };
  const log = (level: "info" | "warn" | "error", extra: Record<string, unknown>) =>
    console[level === "info" ? "log" : level](JSON.stringify({ level, msg: "tutorial.db", requestId, ...extra }));

  if (!hasDatabaseUrl()) {
    log("error", { status: 500, error: "DATABASE_URL missing" });
    return Response.json(
      {
        requestId,
        error: "DATABASE_URL tanımlı değil",
        hint: "Local: apps/web/.env.local. Vercel: Settings → Environment Variables → DATABASE_URL ekle → Redeploy (Gün 1’deki RELEASE_CHANNEL gibi).",
      },
      { status: 500, headers },
    );
  }
  const pooledUrl = process.env.DATABASE_URL as string;

  const breakKind = url.searchParams.get("break");
  if (breakKind && ["password", "database", "host"].includes(breakKind)) {
    const r = await timedConnect(mutate(pooledUrl, breakKind));
    log("warn", { status: 502, break: breakKind, result: r });
    return Response.json({ requestId, break: breakKind, target: describeUrl(mutate(pooledUrl, breakKind)), result: r }, { status: 502, headers });
  }

  if (url.searchParams.get("compare") === "1") {
    const directUrl = process.env.DATABASE_URL_UNPOOLED;
    const pooled = await timedConnect(pooledUrl);
    const direct = directUrl ? await timedConnect(directUrl) : { ok: false as const, ms: 0, code: "NO_ENV", message: "DATABASE_URL_UNPOOLED tanımlı değil" };
    log("info", { status: 200, compare: { pooled, direct } });
    return Response.json(
      { requestId, pooled: { target: describeUrl(pooledUrl), ...pooled }, direct: { target: describeUrl(directUrl), ...direct } },
      { headers },
    );
  }

  try {
    const t0 = performance.now();
    const r = await getPool().query<{ version: string; db: string; usr: string; now: Date; tz: string; baku: string }>(
      "select version() as version, current_database() as db, current_user as usr, now() as now, current_setting('TimeZone') as tz, to_char(now() at time zone 'Asia/Baku', 'YYYY-MM-DD HH24:MI:SS') as baku",
    );
    const queryMs = Math.round(performance.now() - t0);
    const row = r.rows[0];
    const body = {
      requestId,
      target: describeUrl(pooledUrl),
      postgres: row.version.split(" on ")[0],
      database: row.db,
      user: row.usr,
      dbNowUtc: row.now.toISOString(),
      dbTimeZone: row.tz,
      bakuTime: row.baku,
      queryMs,
      totalMs: Math.round(performance.now() - started),
    };
    log("info", { status: 200, queryMs, database: row.db });
    return Response.json(body, { headers });
  } catch (e) {
    const err = e as PgError;
    log("error", { status: 500, code: err.code, message: err.message });
    return Response.json({ requestId, error: "Veritabanı sorgusu başarısız", code: err.code ?? "UNKNOWN", message: err.message }, { status: 500, headers });
  }
}
