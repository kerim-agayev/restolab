"use client";

/** Gün 13: MSSQL→Postgres lehçe oyunu, bağlantı adresi anatomisi, gerçek DB lab'ı, bağlantı santrali (pool), control plane. */
import { useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";

/* ───────────── 1. Aynı dil, farklı lehçe: MSSQL → PostgreSQL ───────────── */

const PAIRS = [
  { mssql: "SELECT TOP 10 * FROM Orders", pg: "SELECT * FROM orders LIMIT 10", note: "İlk N satır: TOP yerine sonda LIMIT." },
  { mssql: "SELECT GETDATE()", pg: "SELECT now()", note: "Şu an: GETDATE() → now(). (Postgres’te timestamptz saat dilimini bilir, Gün 10.)" },
  { mssql: "SELECT ISNULL(Note, '-') FROM Orders", pg: "SELECT COALESCE(note, '-') FROM orders", note: "COALESCE ikisinde de var; Postgres’te ISNULL yok." },
  { mssql: "SELECT 'Masa ' + CAST(TableNo AS NVARCHAR)", pg: "SELECT 'Masa ' || table_no", note: "Metin birleştirme: + yerine ||." },
  { mssql: "Id INT IDENTITY(1,1) PRIMARY KEY", pg: "id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY", note: "Otomatik artan kimlik. (Eski Postgres kodunda SERIAL görürsün.)" },
  { mssql: "Name NVARCHAR(100), Price DECIMAL(12,2), CreatedAt DATETIME2", pg: "name TEXT, price NUMERIC(12,2), created_at TIMESTAMPTZ", note: "Postgres’te metin zaten Unicode; NVARCHAR yok. Para NUMERIC (Gün 10). Zaman TIMESTAMPTZ." },
  { mssql: "SELECT *, ROW_NUMBER() OVER (PARTITION BY WaiterId ORDER BY Total DESC) FROM Orders", pg: "SELECT *, row_number() OVER (PARTITION BY waiter_id ORDER BY total DESC) FROM orders", note: "Window function’lar NEREDEYSE AYNI. Bildiğin şey burada aynen işe yarıyor (Gün 20)." },
];

export function DialectGame() {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <div className="space-y-2">
      {PAIRS.map((p, i) => (
        <div key={p.mssql} className="space-y-1 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-700">
          <p className="text-xs text-zinc-500">MSSQL (bildiğin)</p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-zinc-500/10 p-1.5 text-xs">{p.mssql}</pre>
          {open[i] ? (
            <>
              <p className="text-xs text-zinc-500">PostgreSQL</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-emerald-500/10 p-1.5 text-xs">{p.pg}</pre>
              <p className="text-xs">{p.note}</p>
            </>
          ) : (
            <button className={btn} onClick={() => setOpen((s) => ({ ...s, [i]: true }))}>
              Önce Postgres hâlini kafanda tahmin et, sonra göster
            </button>
          )}
        </div>
      ))}
      <p className="text-xs text-zinc-500">
        Adlandırma notu: Postgres’te gelenek <code>snake_case</code> (<code>table_no</code>). Büyük harfli isimler tırnak ister (<code>&quot;TableNo&quot;</code>), bu yüzden kimse kullanmaz.
      </p>
    </div>
  );
}

/* ───────────── 2. Bağlantı adresinin anatomisi ───────────── */

const PARTS = [
  { text: "postgresql://", label: "Protokol", say: "Hangi dilde konuşacağız: Postgres protokolü. (https:// gibi, Gün 3.)" },
  { text: "neondb_owner", label: "Kullanıcı", say: "Kim olarak giriyorsun. Veritabanında da roller ve yetkiler var (Gün 18’in DB versiyonu)." },
  { text: ":********", label: "Şifre", say: "GİZLİ. Bu yüzden bütün adres bir secret’tır: .env.local’de ve Vercel panelinde durur, asla git’e girmez." },
  { text: "@ep-orange-queen-…-pooler.c-7.eu-central-1.aws.neon.tech", label: "Host", say: "Sunucunun adı. DNS ile IP’ye çevrilir (Gün 6). ‘-pooler’ = araya santral (PgBouncer) giriyor. eu-central-1 = Frankfurt." },
  { text: ":5432", label: "Port", say: "Postgres’in ofis numarası (Gün 5). Yazılmazsa varsayılan 5432." },
  { text: "/control_db", label: "Veritabanı", say: "Sunucudaki hangi defter. Bir sunucuda birden çok veritabanı olabilir: control_db, neondb… (database-per-tenant’ın temeli)." },
  { text: "?sslmode=verify-full", label: "Güvenlik", say: "Bağlantı TLS ile şifreli ve sertifika tam kontrol ediliyor (Gün 6: isim, tarih, noter imzası)." },
];

export function ConnectionAnatomy() {
  const [sel, setSel] = useState(0);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap rounded-lg bg-zinc-950 p-2 font-mono text-xs">
        {PARTS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setSel(i)}
            className={`rounded px-0.5 ${sel === i ? "bg-emerald-600 text-white" : "text-emerald-300 hover:bg-zinc-800"}`}
          >
            {p.text}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-zinc-500/10 p-3 text-sm">
        <p className="font-semibold">{PARTS[sel].label}</p>
        <p>{PARTS[sel].say}</p>
      </div>
      <p className="text-xs text-zinc-500">Parçalara tıkla. Port bu adreste yazılı değil; burada açıklamak için ekledik.</p>
    </div>
  );
}

/* ───────────── 3. Gerçek DB lab'ı ───────────── */

const ACTIONS = [
  { id: "ask", label: "🗄️ Bağlan ve sor", q: "" },
  { id: "compare", label: "⚖️ Santralli vs direkt bağlantı", q: "?compare=1" },
  { id: "password", label: "💥 Yanlış şifre", q: "?break=password" },
  { id: "database", label: "💥 Olmayan veritabanı", q: "?break=database" },
  { id: "host", label: "💥 Olmayan host", q: "?break=host" },
] as const;

export function DbLab() {
  const [out, setOut] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  async function run(a: (typeof ACTIONS)[number]) {
    setBusy(a.id);
    try {
      const r = await fetch(`/api/tutorial/db${a.q}`, { cache: "no-store" });
      const text = await r.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* düz metin */
      }
      setOut((s) => ({ ...s, [a.id]: `HTTP ${r.status}\n${pretty}` }));
    } catch {
      setOut((s) => ({ ...s, [a.id]: "İstek başarısız" }));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-2">
      {ACTIONS.map((a) => (
        <div key={a.id} className="space-y-1">
          <button className={a.id === "ask" ? btnMain : btn} disabled={busy !== null} onClick={() => run(a)}>
            {busy === a.id ? "⏳ …" : a.label}
          </button>
          {out[a.id] && <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-zinc-950 p-2 text-xs text-emerald-300">{out[a.id]}</pre>}
        </div>
      ))}
      <p className="text-xs text-zinc-500">
        İlk “Bağlan ve sor” yavaş olabilir (1–2 sn): Neon boştayken veritabanını uyutur, ilk istek uyandırır (cold start). İkinci deneme hızlıdır.
      </p>
    </div>
  );
}

/* ───────────── 4. Santral: bağlantı havuzu (pool) ───────────── */

const DB_LIMIT = 20;

export function PoolSim() {
  const [requests, setRequests] = useState(10);
  const [pooler, setPooler] = useState(false);
  const served = pooler ? requests : Math.min(requests, DB_LIMIT);
  const rejected = pooler ? 0 : Math.max(0, requests - DB_LIMIT);
  const dbConnections = pooler ? Math.min(requests, 5) : Math.min(requests, DB_LIMIT);
  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm">
        <span>
          Aynı anda gelen istek (her biri ayrı bir serverless fonksiyon): <b>{requests}</b>
        </span>
        <input type="range" min={1} max={80} value={requests} onChange={(e) => setRequests(Number(e.target.value))} className="w-full" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={pooler} onChange={(e) => setPooler(e.target.checked)} /> Araya santral (pooler / PgBouncer) koy
      </label>
      <div className="grid gap-2 text-sm sm:grid-cols-3">
        <p className="rounded-lg bg-zinc-500/10 p-2">
          🗄️ Veritabanındaki açık hat: <b>{dbConnections}</b> / {DB_LIMIT} (sınır)
        </p>
        <p className="rounded-lg bg-emerald-500/10 p-2">
          ✅ Cevaplanan istek: <b>{served}</b>
        </p>
        <p className={`rounded-lg p-2 ${rejected ? "bg-rose-500/15" : "bg-zinc-500/10"}`}>
          ❌ Reddedilen: <b>{rejected}</b> {rejected ? "(too many connections)" : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-0.5" aria-hidden>
        {Array.from({ length: requests }, (_, i) => (
          <span key={i} className={`h-3 w-3 rounded-sm ${!pooler && i >= DB_LIMIT ? "bg-rose-500" : "bg-emerald-500"}`} />
        ))}
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        {pooler
          ? "Santral birkaç hattı paylaştırıyor: istekler sırayla aynı hatları kullanıyor. Veritabanı rahat."
          : "Her fonksiyon kendi hattını açıyor. Sınır aşılınca veritabanı yeni hat kabul etmiyor. Kampanya akşamı tam bu olur."}{" "}
        (Sayılar örnek; Neon’un gerçek sınırı plana göre değişir.)
      </p>
    </div>
  );
}

/* ───────────── 5. Control plane: holdingin merkez sicili ───────────── */

const TENANTS = [
  { name: "Dolma House (Bakı)", slug: "dolma-house", db: "tenant_dolma_house", channel: "prod" },
  { name: "Plov Center (Gəncə)", slug: "plov-center", db: "tenant_plov_center", channel: "beta" },
  { name: "Çay Evi (Sumqayıt)", slug: "cay-evi", db: "tenant_cay_evi", channel: "alpha" },
];

export function ControlPlane() {
  const [sel, setSel] = useState<number | null>(null);
  const t = sel === null ? null : TENANTS[sel];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {TENANTS.map((x, i) => (
          <button key={x.slug} className={sel === i ? btnMain : btn} onClick={() => setSel(i)}>
            🍽️ {x.name}
          </button>
        ))}
      </div>
      {t && (
        <ol className="space-y-1 text-sm">
          <li className="rounded-lg border border-zinc-300 p-2 dark:border-zinc-700">1️⃣ İstek geldi: “{t.slug} restoranının siparişleri”</li>
          <li className="rounded-lg border border-emerald-500 bg-emerald-500/10 p-2">
            2️⃣ <b>control_db</b> (merkez sicil) soruluyor: “{t.slug} hangi defterde, hangi kanalda?” → <code>{t.db}</code>, kanal <b>{t.channel}</b>
          </li>
          <li className="rounded-lg border border-zinc-300 p-2 dark:border-zinc-700">
            3️⃣ Asıl veri <code>{t.db}</code> veritabanından okunuyor. Diğer restoranların verisi başka defterlerde: karışma riski yok.
          </li>
        </ol>
      )}
      <p className="text-xs text-zinc-500">
        Bugün sadece <code>control_db</code> var. Restoran defterlerini (database-per-tenant) Gün 31’de, release kanallarını Gün 73’te kuracağız.
      </p>
    </div>
  );
}
