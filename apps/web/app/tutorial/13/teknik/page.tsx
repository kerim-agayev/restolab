import type { Metadata } from "next";
import Link from "next/link";
import { TaskList, type Task } from "@/components/tutorial/TaskList";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 13 (Teknik) — Neon, SQL Editor, Vercel env | RestoLab" };

const neon: Task[] = [
  {
    title: "Veritabanlarını gör",
    cmd: "console.neon.tech → restolab projesi → sol menü Branches → production → Databases sekmesi",
    expect: "control_db · neondb (Neon’un varsayılanı)",
    why: "control_db’yi Claude SQL ile oluşturdu (CREATE DATABASE control_db). Clopos’un her restoran için yaptığı şeyin ilk küçük örneği.",
  },
  {
    title: "SQL Editor’de ilk sorgu",
    cmd: "Sol menü SQL Editor → üstten database: control_db seç → yaz:\nselect version(), current_database(), now();",
    expect: "PostgreSQL 18.x … · control_db · 2026-… (+00 ile biten saat)",
    why: "Run’a bas. Sonuç tablosu MSSQL Management Studio’daki gibi.",
  },
  {
    title: "Veritabanının saati UTC (Gün 10)",
    cmd: "select current_setting('TimeZone'), now(), now() at time zone 'Asia/Baku';",
    expect: "GMT · UTC saat · 4 saat ileri Bakı saati",
    why: "Veritabanı UTC tutar, gösterimde çevrilir. Gün 10’daki kuralın veritabanındaki hâli.",
  },
  {
    title: "Lehçe farkını kendin dene",
    cmd: "select 'Masa ' || 5 as label, coalesce(null, '-') as note, now()::date as bugun;\n-- şimdi MSSQL hâlini dene ve hatayı oku:\nselect top 1 1;",
    expect: "Masa 5 · - · tarih  ·  ikinci sorgu: syntax error at or near \"1\"",
    why: "TOP Postgres’te yok. Hata mesajı tam olarak nerede takıldığını söylüyor.",
  },
  {
    title: "Açık bağlantıları (hatları) gör",
    cmd: "select datname, usename, application_name, state from pg_stat_activity where datname = 'control_db';",
    expect: "Senin SQL Editor bağlantın (+ lab’ı yeni çalıştırdıysan uygulamanınki)",
    why: "Bölüm 4’teki ‘hat’lar gerçekte burada görünür. ‘too many connections’ olunca DBA ilk buraya bakar.",
  },
];

const vercel: Task[] = [
  {
    title: "DATABASE_URL’i Vercel’e ekle",
    cmd: "vercel.com → restolab → Settings → Environment Variables → Add New\nKey: DATABASE_URL\nValue: apps/web/.env.local’deki DATABASE_URL satırının = işaretinden sonrası\nEnvironments: Production ✔ Preview ✔ (Development boş)\nSensitive: AÇIK → Save",
    expect: "Listede DATABASE_URL · Production, Preview · değer gizli (Sensitive)",
    why: "Sensitive açıkken değer bir daha panelde bile gösterilmez: sadece uygulama okuyabilir. Gün 1’deki RELEASE_CHANNEL’dan farkı bu: o bir ayardı, bu bir sır.",
  },
  {
    title: "DATABASE_URL_UNPOOLED’i ekle",
    cmd: "Aynı adımlar · Key: DATABASE_URL_UNPOOLED · Value: .env.local’deki ikinci satır",
    expect: "Listede iki değişken",
    why: "Lab’daki “santralli vs direkt” karşılaştırması ve Gün 15’teki migration’lar için.",
  },
  {
    title: "Redeploy (değişken eklemek tek başına yetmez)",
    cmd: "Deployments → bu PR’ın preview satırı → ⋯ → Redeploy",
    expect: "Yeni build READY olunca /tutorial/13 → “Bağlan ve sor” → HTTP 200 · database: control_db",
    why: "Değişkenler deployment başladığında okunur (Gün 1 dersi). Eklemeden önceki deployment onları hiç görmedi.",
  },
];

const breakTasks: Task[] = [
  {
    title: "Değişken yokken ne olur?",
    cmd: "(Vercel’e eklemeden önce) preview’da /tutorial/13 → “Bağlan ve sor”",
    expect: "HTTP 500 · {\"error\":\"DATABASE_URL tanımlı değil\",\"hint\":…}",
    why: "En sık görülen ‘local’de çalışıyor, sunucuda çalışmıyor’ sebebi. Logda msg: tutorial.db, error: DATABASE_URL missing.",
  },
  {
    title: "Üç hatayı Vercel loglarında bul",
    cmd: "Lab’da üç 💥 butonuna bas → Vercel → Logs → arama: tutorial.db",
    expect: "28P01 password authentication failed · 3D000 database \"olmayan_db\" does not exist · ENOTFOUND ep-olmayan-host.invalid",
    why: "Loglarda şifre hiç geçmiyor: kod adresi yazdırmadan önce şifreyi atıyor. Log’a secret yazmamak da bir güvenlik kuralı.",
  },
  {
    title: "Gerçek vaka (15 Kasım): kod ABD’de, veritabanı Frankfurt’ta",
    cmd: "DevTools → Network → /api/tutorial/db isteği → Response Headers → x-vercel-id\nÖnce: fra1:iad1::iad1   (kapı Frankfurt, kod Washington)\nDüzeltme: apps/web/vercel.json → { \"regions\": [\"fra1\"] }\nSonra: fra1:iad1::fra1  (kod Frankfurt’ta, Neon’un yanında)",
    expect: "Sorgu: ~92 ms → ~2 ms (≈45 kat) · Bağlantı kurma: ~565 ms → ~22–47 ms (≈15 kat)",
    why: "Her sorgu Atlantik’i gidip geliyordu. Bir sayfa 20 sorgu yapsa 2 saniye kayıp. Kural: kodu verinin yanında çalıştır (data locality). Vercel’in ücretsiz planı varsayılan olarak ABD’yi (iad1) seçer; tek bir bölge seçebilirsin. Ayarı panel yerine vercel.json ile yaptık ki PR’da görünsün ve önce preview’da test edilsin.",
  },
];

export default function Day13Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/13" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 13 · Teknik</p>
        <h1 className="text-3xl font-bold">Neon konsolu, SQL Editor ve Vercel’e secret eklemek</h1>
      </header>
      <Section n={1} title="Neon konsolu ve SQL Editor">
        <TaskList items={neon} />
      </Section>
      <Section n={2} title="Vercel’e bağlantı adresini ekle (preview’ın çalışması için şart)">
        <TaskList items={vercel} />
      </Section>
      <Section n={3} title="Kır ve oku">
        <TaskList items={breakTasks} />
      </Section>
      <Section n={4} title="Dosya haritası">
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-emerald-300">{`.env.example                 ← ŞABLON (git’te): sadece isimler ve sahte değerler
apps/web/.env.local          ← GERÇEK değerler (git görmez, sadece senin bilgisayarında)
Vercel → Environment Variables ← GERÇEK değerler (sunucu için, Sensitive)
apps/web/lib/db.ts           ← pg Pool (pooled DATABASE_URL), şifresiz adres gösterimi
apps/web/app/api/tutorial/db ← lab endpoint’i (SELECT + bilerek hatalar)`}</pre>
        <Note icon="🤖">
          <p>
            <i>“Connection string’i env’e koydum.”</i> → .env.local + Vercel paneli. <i>“Pooled URL kullan.”</i> → <code>-pooler</code>’lı adres
            (santral). <i>“Direct URL migration için.”</i> → Gün 15. <i>“Neon compute uyuyordu.”</i> → cold start. <i>“sslmode=verify-full”</i> → TLS
            sertifikası tam kontrol (Gün 6).
          </p>
        </Note>
        <Note icon="🏢">
          <p>
            <b>Clopos köprüsü:</b> şirket reposunda <code>DATABASE_URL</code>, <code>MONGODB_URI</code>, <code>.env.example</code> ara: hangi servis hangi
            veritabanına bağlanıyor? Soru: “Restoran → veritabanı eşlemesi (control plane) nerede tutuluyor?”
          </p>
        </Note>
      </Section>
    </main>
  );
}
