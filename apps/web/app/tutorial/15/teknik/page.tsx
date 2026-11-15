import type { Metadata } from "next";
import Link from "next/link";
import { TaskList, type Task } from "@/components/tutorial/TaskList";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 15 (Teknik) — Prisma Migrate, Neon branch, drift | RestoLab" };

const files: Task[] = [
  {
    title: "İki projeyi yan yana oku",
    cmd: "VS Code → apps/web/prisma/migrations/\n  20261115100250_init_users_restaurants/migration.sql\n  20261115115828_add_restaurant_phone/migration.sql",
    expect: "İkincisi tek satır:\n-- AlterTable\nALTER TABLE \"restaurants\" ADD COLUMN     \"phone\" TEXT;",
    why: "NOT NULL yok → boş bırakılabilir → güvenli. Bu dosya Claude’un `prisma migrate dev --create-only` komutuyla üretildi: dosyayı yazar ama UYGULAMAZ. Böylece SQL önce PR’da okunur.",
  },
  {
    title: "Şemadaki karşılığını bul",
    cmd: "apps/web/prisma/schema.prisma → model Restaurant",
    expect: "phone       String?",
    why: "Sondaki ? = boş bırakılabilir (nullable). ? olmasaydı migration’da NOT NULL olurdu ve dolu tabloda 23502 ile reddedilirdi (lab’daki vat_no denemesi).",
  },
  {
    title: "migration_lock.toml ne işe yarıyor?",
    cmd: "apps/web/prisma/migrations/migration_lock.toml",
    expect: "provider = \"postgresql\"",
    why: "Bu klasördeki projeler Postgres lehçesinde yazıldı. Biri yanlışlıkla başka bir veritabanına (ör. MySQL) uygulamaya kalkarsa Prisma durdurur.",
  },
];

const terminal: Task[] = [
  {
    title: "Defter ile klasörü karşılaştır (sadece okur)",
    cmd: "pnpm --filter web exec prisma migrate status",
    expect: "2 migrations found in prisma/migrations\nFollowing migration have not yet been applied:\n20261115115828_add_restaurant_phone",
    why: "prisma.config.ts’deki DİREKT (unpooled) adrese bağlanır. ‘have not yet been applied’ = pending.",
  },
  {
    title: "Veritabanı ile şema arasındaki farkı göster (sadece okur)",
    cmd: "pnpm --filter web exec prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma",
    expect: "[*] Changed the `restaurants` table\n  [+] Added column `phone`",
    why: "‘Veritabanını şemaya getirmek için ne lazım?’ Sonuna --script eklersen aynı farkı SQL olarak verir. Drift dedektörü olarak da kullanılır.",
  },
  {
    title: "Uygula (control_db’yi DEĞİŞTİRİR)",
    cmd: "pnpm --filter web exec prisma migrate deploy",
    expect: "Applying migration `20261115115828_add_restaurant_phone`\nAll migrations have been successfully applied.",
    why: "Sadece bekleyenleri sırayla uygular, yeni dosya üretmez, hiçbir şeyi sıfırlamaz. Gerçek ortamların (production, CI) komutu budur.",
  },
  {
    title: "Tekrar kontrol et",
    cmd: "pnpm --filter web exec prisma migrate status\npnpm --filter web exec prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma",
    expect: "Database schema is up to date!\nNo difference detected.",
    why: "Defter, klasör ve şema üçü de aynı.",
  },
  {
    title: "Defteri SQL ile oku",
    cmd: "Neon → SQL Editor → control_db:\nselect migration_name, finished_at, applied_steps_count, left(checksum, 12) as checksum\nfrom _prisma_migrations order by started_at;",
    expect: "20261115100250_init_users_restaurants · … · 1\n20261115115828_add_restaurant_phone · (bugün) · 1",
    why: "checksum = dosyanın parmak izi (Gün 16’da hash’i göreceğiz). Uygulanmış bir migration dosyasını sonradan değiştirirsen parmak izi tutmaz ve Prisma uyarır: uygulanmış proje değiştirilmez, yenisi yazılır.",
  },
];

const neon: Task[] = [
  {
    title: "Kopya aç (Neon branch)",
    cmd: "console.neon.tech → restolab → sol menü Branches → Create branch (New branch)\nName: day-15-deneme · Parent: production · veri: şu anki hâl (Head / current)\n→ Create",
    expect: "Branches listesinde: production + day-15-deneme. Saniyeler içinde hazır.",
    why: "Bütün veritabanını kopyalamaz: değişene kadar production’la aynı sayfaları paylaşır (copy-on-write). Ücretsiz planda 10 branch hakkın var.",
  },
  {
    title: "SQL Editor’ü kopyaya bağla",
    cmd: "Sol menü SQL Editor → üstteki branch seçicisi: day-15-deneme · database: control_db\nselect count(*) from memberships;",
    expect: "5",
    why: "Aynı veri. ÖNCE branch seçicisinin day-15-deneme gösterdiğinden emin ol.",
  },
  {
    title: "💥 Kopyayı kır",
    cmd: "(branch seçici: day-15-deneme)\ndrop table memberships;\nselect count(*) from memberships;",
    expect: "ERROR: relation \"memberships\" does not exist",
    why: "Kopyada tablo gitti.",
  },
  {
    title: "Gerçeğe bak",
    cmd: "Branch seçicisini production’a çevir → select count(*) from memberships;",
    expect: "5",
    why: "Production’a dokunulmadı. Tehlikeli tadilat önce böyle bir kopyada denenir.",
  },
  {
    title: "Kopyayı sil",
    cmd: "Branches → day-15-deneme → ⋯ (veya Delete) → onayla",
    expect: "Listede sadece production",
    why: "Branch’ler ücretsiz ama sınırlı (10). Deneme bitince sil. Gün 71’de her PR için otomatik açılıp kapanacak.",
  },
];

const breakTasks: Task[] = [
  {
    title: "Drift’i lab’da gör",
    cmd: "/tutorial/15 → Bölüm 3 → “😈 Plansız sütun ekle (wifi_password)” → Ham cevabı göster",
    expect: "\"extraInDb\": [\"restaurants.wifi_password\"], \"rolledBack\": true",
    why: "Endpoint DDL’i transaction içinde yapıp information_schema’dan sütunları okuyor, sonra geri alıyor. Postgres’te DDL de geri alınabilir (MSSQL’de de çoğu öyle; MySQL’de değil).",
  },
  {
    title: "Kod veritabanından öndeyken (deploy’dan önce yap)",
    cmd: "/tutorial/14 → Bölüm 4 → “💥 Dolma Evi’ni sil” → Ham cevabı göster",
    expect: "\"prismaCode\": \"P2022\", \"message\": \"The column `restaurants.phone` does not exist in the current database.\"",
    why: "Bu preview’daki kod phone’u biliyor (silinen satırı geri döndürürken bütün sütunları istiyor), veritabanında yok. Deploy’dan sonra aynı buton yine 23001 verir.",
  },
  {
    title: "Vercel loglarında bul",
    cmd: "Vercel → restolab → Logs → arama: tutorial.migrations",
    expect: "{\"level\":\"warn\",\"msg\":\"tutorial.migrations\",\"action\":\"rename\",\"prismaCode\":\"P2022\",\"postgresCode\":\"42703\"}",
    why: "Her deneme JSON log yazar; requestId ile UI’daki cevabı eşleştir.",
  },
];

export default function Day15Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/15" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 15 · Teknik</p>
        <h1 className="text-3xl font-bold">Prisma Migrate, Neon branch ve drift</h1>
      </header>

      <Section n={1} title="Migration dosyalarını oku">
        <TaskList items={files} />
      </Section>

      <Section n={2} title="Terminal: durum → fark → uygula → kontrol">
        <TaskList items={terminal} />
      </Section>

      <Section n={3} title="Neon branch: kopya bina (tamamen güvenli)">
        <TaskList items={neon} />
      </Section>

      <Section n={4} title="Kır ve oku">
        <TaskList items={breakTasks} />
      </Section>

      <Section n={5} title="Komut haritası (cheat sheet)">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-400">
                <th className="p-2">Komut</th>
                <th className="p-2">Ne yapar</th>
                <th className="p-2">Nerede</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["prisma migrate dev --name x", "Şemadan yeni migration üret + uygula (drift varsa reset teklif eder!)", "Sadece kendi bilgisayarın / kendi branch’in"],
                ["prisma migrate dev --create-only", "Dosyayı üret, uygulama (önce okumak için)", "Geliştirici"],
                ["prisma migrate deploy", "Bekleyenleri sırayla uygula; asla reset atmaz", "Production, CI, preview"],
                ["prisma migrate status", "Defter ↔ klasör karşılaştırması", "Her yer (sadece okur)"],
                ["prisma migrate diff …", "İki kaynak arasındaki fark (DB, şema, klasör)", "Drift kontrolü (sadece okur)"],
                ["prisma migrate reset", "Veritabanını SİL, bütün projeleri baştan uygula", "Sadece local. Production’da ASLA"],
                ["prisma db push", "Şemayı defter tutmadan bas", "Sadece hızlı deneme"],
              ].map(([c, d, w]) => (
                <tr key={c} className="border-b border-zinc-300 dark:border-zinc-700">
                  <td className="p-2 font-mono text-xs">{c}</td>
                  <td className="p-2">{d}</td>
                  <td className="p-2">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500">
          Hata kodları: 42703 (sütun yok, Prisma P2022) · 23502 (NOT NULL ihlali) · 55P03 (kilit alınamadı, lock_timeout). Gün 14’teki 23503 / 23505 / 23001 ile aynı aile.
        </p>
      </Section>

      <Section n={6} title="Dosya haritası">
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-emerald-300">{`apps/web/prisma/schema.prisma          ← tarif (Restaurant.phone eklendi)
apps/web/prisma/migrations/            ← numaralı projeler (git'te, PR'da incelenir)
  20261115100250_init_users_restaurants/migration.sql
  20261115115828_add_restaurant_phone/migration.sql
  migration_lock.toml
control_db → _prisma_migrations        ← veritabanının defteri
apps/web/app/api/tutorial/migrations/  ← lab: defter ↔ klasör, şema ↔ sütunlar, DDL denemeleri (ROLLBACK)
apps/web/next.config.ts                ← outputFileTracingIncludes: lab canlıda migrations klasörünü okuyabilsin`}</pre>
        <Note icon="🏢">
          <p>
            <b>Clopos köprüsü:</b> database-per-tenant’ta aynı migration <b>yüzlerce veritabanına</b> uygulanır. Sor: “Migration’lar her restoran veritabanına nasıl
            gidiyor? Önce alpha restoranlara mı? Bir restoranda yarıda kalırsa ne oluyor?” Repoda <code>migrations/</code>, <code>migrate deploy</code>,{" "}
            <code>knex migrate</code>, <code>typeorm migration:run</code> ara.
          </p>
        </Note>
        <Note icon="📖">
          <p>
            Okumak istersen: <b>DDIA Bölüm 4</b> (encoding and evolution: eski ve yeni kodun aynı anda çalışması, backward/forward compatibility).
          </p>
        </Note>
      </Section>
    </main>
  );
}
