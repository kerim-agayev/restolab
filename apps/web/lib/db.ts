/**
 * Gün 13: control_db'ye bağlantı havuzu (pool).
 * - DATABASE_URL = Neon'un "pooled" adresi (araya PgBouncer santrali girer) → serverless fonksiyonlar için doğru olan.
 * - Havuz globalThis'te saklanır: aynı sunucu örneği her istekte yeni havuz açmasın (dev'de hot reload da dahil).
 * Gün 14'te bunun üstüne Prisma gelecek; altında yine bu tür bir sürücü (driver) çalışır.
 */
import { Pool } from "pg";

const g = globalThis as unknown as { __restolabPool?: Pool };

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL tanımlı değil");
  g.__restolabPool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000 });
  return g.__restolabPool;
}

/** Bağlantı adresini şifresiz, sadece "nereye" bilgisiyle gösterir (loglarda/ekranda güvenli). */
export function describeUrl(url: string | undefined): { host: string; database: string; pooled: boolean } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return { host: u.hostname, database: u.pathname.slice(1), pooled: u.hostname.includes("-pooler") };
  } catch {
    return null;
  }
}
