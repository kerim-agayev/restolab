import type { Metadata } from "next";
import Link from "next/link";
import { TaskList, type Task } from "@/components/tutorial/TaskList";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 14 (Teknik) — Prisma şeması, SQL Editor, hata kodları | RestoLab" };

const prisma: Task[] = [
  {
    title: "Şemayı oku (ERD’nin yazılı hâli)",
    cmd: "VS Code → apps/web/prisma/schema.prisma",
    expect: "3 model (User, Restaurant, Membership) + 1 enum (Role). Her satırın üstünde Türkçe açıklama.",
    why: "@relation = FK, @@unique = unique constraint, @@map(\"users\") = veritabanındaki tablo adı. Kodda User, veritabanında users.",
  },
  {
    title: "Şema geçerli mi?",
    cmd: "pnpm --filter web db:validate",
    expect: "The schema at prisma\\schema.prisma is valid 🚀",
    why: "Yazım hatası varsa satır numarasıyla söyler. Bir alanın adını bilerek boz (ör. restaurantId → restaurantI), tekrar çalıştır, hatayı oku, geri al.",
  },
  {
    title: "Client’ı üret",
    cmd: "pnpm --filter web exec prisma generate",
    expect: "✔ Generated Prisma Client (7.10.1) to .\\generated\\prisma",
    why: "TypeScript tipleri şemadan üretilir. generated/ klasörü git’e girmez: Vercel build’de (package.json → build) ve pnpm install’da (postinstall) yeniden üretilir.",
  },
  {
    title: "Tabloları gözle gör: Prisma Studio",
    cmd: "pnpm --filter web db:studio",
    expect: "Prisma Studio is running at: http://localhost:<numara> → linke tıkla → users / restaurants / memberships",
    why: "Excel gibi bir arayüz. Prisma 7’de port her seferinde değişir, terminalde yazanı aç. Burada veriyi DEĞİŞTİRME, sadece bak. Kapatmak: terminalde Ctrl+C.",
  },
  {
    title: "Tabloları oluşturan SQL’i oku",
    cmd: "apps/web/prisma/migrations/2026…_init_users_restaurants/migration.sql",
    expect: "CREATE TYPE \"role\" … CREATE TABLE \"users\" … ALTER TABLE \"memberships\" ADD CONSTRAINT … FOREIGN KEY",
    why: "Prisma şemadan üretti, Claude çalıştırdı (prisma migrate dev). MSSQL’deki CREATE TABLE ile karşılaştır. Bu dosyanın nasıl yönetildiği yarının (Gün 15) konusu.",
  },
];

const sql: Task[] = [
  {
    title: "Üç tabloyu tek tek gör",
    cmd: "Neon → SQL Editor → database: control_db\nselect * from users;\nselect * from restaurants;\nselect * from memberships;",
    expect: "4 kişi · 2 restoran · 5 üyelik (memberships’te isim yok, sadece numaralar)",
    why: "memberships satırlarında ‘Leyla’ yazmıyor, user_id = 1 yazıyor. Normalization’ın gözle görülen hâli.",
  },
  {
    title: "JOIN’i SEN yaz (MSSQL’deki gibi)",
    cmd: "İpucu: memberships m → users u (u.id = m.user_id) → restaurants r (r.id = m.restaurant_id)\nKolonlar: r.name, u.name, m.role · order by r.name",
    expect: "Dolma Evi · Leyla Məmmədova · OWNER\nDolma Evi · Nigar Həsənova · MANAGER\nDolma Evi · Rauf Əliyev · WAITER\nÇay Bağı · Leyla Məmmədova · MANAGER\nÇay Bağı · Kamran Quliyev · WAITER",
    why: "Önce kendin yaz. Takılırsan: select r.name as restoran, u.name as kisi, m.role from memberships m join users u on u.id = m.user_id join restaurants r on r.id = m.restaurant_id order by r.name, m.role;",
  },
  {
    title: "Veritabanındaki FK kurallarını listele",
    cmd: "select conname, conrelid::regclass as tablo, confrelid::regclass as hedef, pg_get_constraintdef(oid) as tanim\nfrom pg_constraint where contype = 'f';",
    expect: "memberships_restaurant_id_fkey · memberships → restaurants · … ON DELETE RESTRICT\nmemberships_user_id_fkey · memberships → users · … ON DELETE CASCADE",
    why: "Kural kodda değil, veritabanının içinde yazılı. Prisma şemasındaki onDelete buraya böyle yansıdı.",
  },
];

const breakTasks: Task[] = [
  {
    title: "FK’yı SQL ile kır (güvenli: başarısız olur)",
    cmd: "insert into memberships (user_id, restaurant_id, role) values (1, 999, 'WAITER');",
    expect: "ERROR: insert or update on table \"memberships\" violates foreign key constraint \"memberships_restaurant_id_fkey\" (SQLSTATE 23503)",
    why: "Lab’daki 💥 butonun yaptığının çıplak hâli. Prisma bunu P2003’e çeviriyor.",
  },
  {
    title: "Enum’da olmayan rol",
    cmd: "insert into memberships (user_id, restaurant_id, role) values (1, 1, 'CHEF');",
    expect: "ERROR: invalid input value for enum role: \"CHEF\" (SQLSTATE 22P02)",
    why: "Role enum’u sadece OWNER / MANAGER / WAITER kabul eder. Gün 9’daki zod kuralının veritabanındaki karşılığı.",
  },
  {
    title: "Zorunlu alanı boş bırak",
    cmd: "insert into memberships (user_id, restaurant_id) values (1, 2);",
    expect: "ERROR: null value in column \"role\" of relation \"memberships\" violates not-null constraint (SQLSTATE 23502)",
    why: "Şemada role yanında ? yok → zorunlu → NOT NULL.",
  },
  {
    title: "Silmeyi dene, ama transaction içinde",
    cmd: "begin;\ndelete from restaurants where slug = 'dolma-evi';\nrollback;",
    expect: "ERROR: update or delete on table \"restaurants\" violates RESTRICT setting of foreign key constraint … (SQLSTATE 23001)",
    why: "begin … rollback = ‘dene ama kaydetme’. Silme denemelerini HER ZAMAN böyle yap. Lab endpoint’i de tam olarak bunu yapıyor.",
  },
  {
    title: "Aynı denemeyi DevTools Console’dan yap",
    cmd: "Preview’da /tutorial/14 → F12 → Console:\nawait (await fetch('/api/tutorial/erd', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'fk-user' }) })).json()",
    expect: "{ ok: false, prismaCode: 'P2003', postgresCode: '23503', message: 'Foreign key constraint violated on the constraint: `memberships_user_id_fkey`' … }",
    why: "Gün 4’teki Console fetch’i. Sonra Network sekmesinde aynı isteği bul: Payload’da action, Response’ta hata, status 422.",
  },
  {
    title: "Vercel loglarında bul",
    cmd: "Vercel → restolab → Logs → arama: tutorial.erd",
    expect: "{\"level\":\"warn\",\"msg\":\"tutorial.erd\",\"action\":\"fk-user\",\"prismaCode\":\"P2003\",\"postgresCode\":\"23503\"}",
    why: "requestId ile UI’daki ham cevapla eşleştir (Gün 3 alışkanlığı).",
  },
];

export default function Day14Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/14" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 14 · Teknik</p>
        <h1 className="text-3xl font-bold">Prisma şeması, SQL Editor ve constraint hataları</h1>
      </header>

      <Section n={1} title="Prisma dosyaları ve komutlar">
        <TaskList items={prisma} />
      </Section>

      <Section n={2} title="Neon SQL Editor: tabloları ve kuralları gör">
        <TaskList items={sql} />
      </Section>

      <Section n={3} title="Kır ve oku">
        <TaskList items={breakTasks} />
      </Section>

      <Section n={4} title="Hata kodu tablosu (cheat sheet)">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-400">
                <th className="p-2">Ne oldu?</th>
                <th className="p-2">Postgres (SQLSTATE)</th>
                <th className="p-2">Prisma</th>
                <th className="p-2">API’de genelde</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                <td className="p-2">Olmayan satırı gösterdin (FK)</td>
                <td className="p-2 font-mono">23503</td>
                <td className="p-2 font-mono">P2003</td>
                <td className="p-2">422 / 400</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                <td className="p-2">Bu zaten var (unique)</td>
                <td className="p-2 font-mono">23505</td>
                <td className="p-2 font-mono">P2002</td>
                <td className="p-2">409 (Gün 9)</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                <td className="p-2">Bağlı satır varken silme (RESTRICT)</td>
                <td className="p-2 font-mono">23001</td>
                <td className="p-2 font-mono">P2003</td>
                <td className="p-2">409 / 422</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                <td className="p-2">Zorunlu alan boş (NOT NULL)</td>
                <td className="p-2 font-mono">23502</td>
                <td className="p-2 font-mono">P2011</td>
                <td className="p-2">400 / 422</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                <td className="p-2">Aranan kayıt yok (findUniqueOrThrow, update)</td>
                <td className="p-2">—</td>
                <td className="p-2 font-mono">P2025</td>
                <td className="p-2">404</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500">23xxx ailesi = “integrity constraint violation”: verinin kurallarına uyulmadı. Bağlantı hataları (28P01, 3D000) Gün 13’teydi.</p>
      </Section>

      <Section n={5} title="MSSQL ↔ Postgres ↔ Prisma sözlüğü">
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-emerald-300">{`MSSQL                         Postgres                 Prisma şeması
INT IDENTITY(1,1) PRIMARY KEY SERIAL PRIMARY KEY       Int @id @default(autoincrement())
NVARCHAR(200)                 TEXT                     String
DATETIME2 DEFAULT GETDATE()   TIMESTAMP(3) DEFAULT now DateTime @default(now())
UNIQUE (Email)                UNIQUE INDEX             @unique
FOREIGN KEY … REFERENCES      FOREIGN KEY … REFERENCES @relation(fields: […], references: […])
CHECK (Role IN (…))           CREATE TYPE … AS ENUM    enum Role { … }
[dbo].[Users]                 users  (tırnaksız)       model User { … @@map("users") }`}</pre>
      </Section>

      <Section n={6} title="Dosya haritası">
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-emerald-300">{`apps/web/prisma/schema.prisma      ← TEK tarif: tablolar, ilişkiler, kurallar
apps/web/prisma.config.ts          ← Prisma CLI ayarı: şema yeri, migrations klasörü, DİREKT (unpooled) adres
apps/web/prisma/migrations/…       ← şemadan üretilen SQL (Gün 15)
apps/web/prisma/seed.sql           ← sahte veriler (tekrar çalıştırılabilir: on conflict do nothing)
apps/web/generated/prisma/         ← üretilen client (git’e girmez)
apps/web/lib/prisma.ts             ← PrismaClient + pg adapter (POOLED adres)
apps/web/app/api/tutorial/erd/     ← lab endpoint’i (her yazma ROLLBACK ile geri alınır)`}</pre>
        <Note icon="🤖">
          <p>
            <i>“prisma.config.ts’e datasource url ekledim”</i> → Prisma 7’de bağlantı adresi şemadan çıktı, bu dosyaya taşındı. <i>“Driver adapter
            kullanıyoruz”</i> → Prisma, sorguyu Gün 13’teki <code>pg</code> sürücüsüyle gönderiyor. <i>“Client generate edilmemiş”</i> →{" "}
            <code>Cannot find module &apos;@/generated/prisma/client&apos;</code> hatası: <code>prisma generate</code> çalıştır.
          </p>
        </Note>
        <Note icon="🏢">
          <p>
            <b>Clopos köprüsü:</b> şirket reposunda <code>schema.prisma</code>, <code>*.entity.ts</code> (TypeORM), <code>*.schema.ts</code> (Mongoose) veya{" "}
            <code>migrations/</code> ara. Soru: “Restoran ve çalışan ilişkisi nerede tanımlı? Rol kullanıcıda mı, üyelikte mi?”
          </p>
        </Note>
        <Note icon="📖">
          <p>
            Okumak istersen: <b>DDIA Bölüm 2</b> (ilişkisel model vs doküman model, çoka-çok ilişkiler). Menünün neden MongoDB’de olacağını (Modül 3) bu
            bölüm açıklıyor.
          </p>
        </Note>
      </Section>
    </main>
  );
}
