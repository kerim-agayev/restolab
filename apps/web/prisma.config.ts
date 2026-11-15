/**
 * Prisma 7 ayar dosyası (Prisma CLI okur: generate, migrate, studio, db execute).
 * - Prisma 7 .env dosyasını KENDİSİ okumaz. Next.js .env.local kullandığı için onu Node'un yerleşik okuyucusuyla yüklüyoruz.
 *   Vercel'de bu dosya yoktur (değişkenler zaten ortamdadır) → hata yutulur.
 * - CLI'ın şema değiştiren komutları (migrate) DİREKT adrese gider (UNPOOLED): santral (PgBouncer) bu işler için uygun değil. Gün 15.
 * - Uygulamanın kendisi ise lib/prisma.ts'te POOLED adresi (DATABASE_URL) kullanır.
 */
import { defineConfig } from "prisma/config";

try {
  process.loadEnvFile(".env.local");
} catch {
  // dosya yok (CI / Vercel) → ortam değişkenleri zaten tanımlı
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL_UNPOOLED },
});
