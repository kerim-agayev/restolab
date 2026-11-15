/**
 * Gün 14: Prisma Client. Gün 13'teki ham `pg` sürücüsü hâlâ altta çalışıyor (driver adapter = "Prisma, pg'yi kullan").
 * Fark: SQL'i elle yazmak yerine `prisma.restaurant.findMany(...)` yazarsın; tipler şemadan otomatik gelir.
 * Pooled adres (DATABASE_URL) kullanılır; client globalThis'te tek tutulur (Gün 13'teki pool ile aynı sebep).
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const g = globalThis as unknown as { __restolabPrisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL tanımlı değil");
  g.__restolabPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000 }),
  });
  return g.__restolabPrisma;
}
