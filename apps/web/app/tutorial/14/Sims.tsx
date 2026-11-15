"use client";

/** Gün 14: tek büyük tablo (anomali), ilişki türleri, ERD (PK/FK), gerçek FK lab'ı, Prisma şema ↔ SQL. */
import { useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";
const cell = "border border-zinc-300 px-2 py-1 dark:border-zinc-700";

/* ───────────── 1. Tek büyük Excel: güncelleme anomalisi ───────────── */

const PEOPLE = [
  { name: "Leyla", restaurant: "Dolma Evi", role: "Sahip" },
  { name: "Rauf", restaurant: "Dolma Evi", role: "Garson" },
  { name: "Nigar", restaurant: "Dolma Evi", role: "Müdür" },
  { name: "Leyla", restaurant: "Çay Bağı", role: "Müdür" },
  { name: "Kamran", restaurant: "Çay Bağı", role: "Garson" },
];
const OLD_PHONE: Record<string, string> = { "Dolma Evi": "012 555 10 10", "Çay Bağı": "012 555 20 20" };
const NEW_PHONE = "012 555 99 99";

export function OneBigSheet() {
  const [split, setSplit] = useState(false);
  const [phones, setPhones] = useState<string[]>(PEOPLE.map((p) => OLD_PHONE[p.restaurant]));
  const [restPhone, setRestPhone] = useState<Record<string, string>>(OLD_PHONE);

  const dolmaPhones = new Set(PEOPLE.map((p, i) => (p.restaurant === "Dolma Evi" ? phones[i] : null)).filter(Boolean));
  const conflict = dolmaPhones.size > 1;

  function reset() {
    setPhones(PEOPLE.map((p) => OLD_PHONE[p.restaurant]));
    setRestPhone(OLD_PHONE);
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap gap-2">
        <button className={split ? btn : btnMain} onClick={() => setSplit(false)}>
          📄 Tek büyük tablo
        </button>
        <button className={split ? btnMain : btn} onClick={() => setSplit(true)}>
          🗂️ Tablolara bölünmüş
        </button>
        <button className={btn} onClick={reset}>
          ↺ Sıfırla
        </button>
      </div>

      {!split ? (
        <>
          <p>
            Dolma Evi’nin telefonu değişti. Yeni numara <b>{NEW_PHONE}</b>. Sadece <b>Leyla’nın satırını</b> güncelle (acelesi olan bir çalışan gibi):
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-500/10">
                  <th className={cell}>Kişi</th>
                  <th className={cell}>Restoran</th>
                  <th className={cell}>Restoran telefonu</th>
                  <th className={cell}>Rol</th>
                  <th className={cell}></th>
                </tr>
              </thead>
              <tbody>
                {PEOPLE.map((p, i) => {
                  const bad = conflict && p.restaurant === "Dolma Evi";
                  return (
                    <tr key={i} className={bad ? "bg-red-500/15" : ""}>
                      <td className={cell}>{p.name}</td>
                      <td className={cell}>{p.restaurant}</td>
                      <td className={cell + " font-mono"}>{phones[i]}</td>
                      <td className={cell}>{p.role}</td>
                      <td className={cell}>
                        {p.restaurant === "Dolma Evi" && phones[i] !== NEW_PHONE && (
                          <button className="underline" onClick={() => setPhones((s) => s.map((v, j) => (j === i ? NEW_PHONE : v)))}>
                            güncelle
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {conflict ? (
            <p className="rounded bg-red-500/10 p-2">
              ❌ Dolma Evi’nin şimdi <b>{dolmaPhones.size} farklı telefonu</b> var. Hangisi doğru? Kimse bilemez. Aynı bilgi 3 yerde yazılıydı, biri
              güncellendi, ikisi unutuldu. Buna <b>güncelleme anomalisi</b> denir.
            </p>
          ) : (
            <p className="text-zinc-500">“Dolma Evi” ve telefonu aynı tabloda 3 kez tekrar ediyor. Bir satırda “güncelle”ye bas.</p>
          )}
        </>
      ) : (
        <>
          <p>Aynı bilgi, ama her şey <b>tek bir yerde</b>. Restoranın telefonunu restoranlar tablosunda bir kez değiştir:</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="overflow-x-auto">
              <p className="mb-1 font-semibold">restaurants</p>
              <table className="w-full border-collapse text-xs">
                <tbody>
                  {Object.keys(OLD_PHONE).map((r) => (
                    <tr key={r}>
                      <td className={cell}>{r}</td>
                      <td className={cell + " font-mono"}>{restPhone[r]}</td>
                      <td className={cell}>
                        {r === "Dolma Evi" && restPhone[r] !== NEW_PHONE && (
                          <button className="underline" onClick={() => setRestPhone((s) => ({ ...s, [r]: NEW_PHONE }))}>
                            güncelle
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto">
              <p className="mb-1 font-semibold">çalışanlar (restoranı adıyla değil, yerinden gösterir)</p>
              <table className="w-full border-collapse text-xs">
                <tbody>
                  {PEOPLE.map((p, i) => (
                    <tr key={i}>
                      <td className={cell}>{p.name}</td>
                      <td className={cell}>{p.role}</td>
                      <td className={cell + " font-mono"}>→ {p.restaurant}</td>
                      <td className={cell + " font-mono text-zinc-500"}>{restPhone[p.restaurant]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className={restPhone["Dolma Evi"] === NEW_PHONE ? "rounded bg-emerald-500/10 p-2" : "text-zinc-500"}>
            {restPhone["Dolma Evi"] === NEW_PHONE
              ? "✅ Tek bir değişiklik, üç çalışan satırı da yeni numarayı gösteriyor: çünkü telefonu kendileri tutmuyorlar, restorana bakıyorlar."
              : "Gri telefonlar çalışan tablosunda YAZILI değil: restorana bakılarak gösteriliyor."}
          </p>
        </>
      )}
    </div>
  );
}

/* ───────────── 2. İlişki türleri: 1–1, 1–N, N–N ───────────── */

type Kind = "1-1" | "1-N" | "N-N";
const PAIRS: { a: string; b: string; kind: Kind; why: string }[] = [
  { a: "Restoran", b: "Masa", kind: "1-N", why: "Bir restoranın çok masası var; bir masa tek bir restorana ait. Masa satırı ‘restaurant_id’ taşır." },
  { a: "Kişi", b: "Restoran", kind: "N-N", why: "Leyla iki restoranda çalışıyor, bir restoranda çok kişi var. İki yönde de ‘çok’ → arada sözleşme tablosu (memberships) şart." },
  { a: "Restoran", b: "Vergi numarası (VÖEN)", kind: "1-1", why: "Her restoranın tek VÖEN’i, her VÖEN tek bir işletmenin. Çoğu zaman aynı tabloda bir sütun olur." },
  { a: "Sipariş", b: "Menü kalemi", kind: "N-N", why: "Bir siparişte çok yemek, bir yemek çok siparişte. Arada ‘order_items’ (adet + o anki fiyat) durur: Gün 10’daki fiş satırı." },
  { a: "Masa", b: "Sipariş", kind: "1-N", why: "Bir masada gün boyu çok sipariş açılır; her sipariş tek masaya aittir." },
];

export function RelationPicker() {
  const [picked, setPicked] = useState<Record<number, Kind>>({});
  const score = PAIRS.filter((p, i) => picked[i] === p.kind).length;
  return (
    <div className="space-y-3 text-sm">
      {PAIRS.map((p, i) => (
        <div key={i} className="space-y-1 rounded-lg border border-zinc-300 p-2 dark:border-zinc-700">
          <p>
            <b>{p.a}</b> ↔ <b>{p.b}</b>
          </p>
          <div className="flex flex-wrap gap-2">
            {(["1-1", "1-N", "N-N"] as Kind[]).map((k) => (
              <button
                key={k}
                className={picked[i] === k ? (k === p.kind ? btnMain : "rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white") : btn}
                onClick={() => setPicked((s) => ({ ...s, [i]: k }))}
              >
                {k === "1-1" ? "bir – bir" : k === "1-N" ? "bir – çok" : "çok – çok"}
              </button>
            ))}
          </div>
          {picked[i] && <p className={picked[i] === p.kind ? "text-emerald-700 dark:text-emerald-400" : "text-red-600"}>{picked[i] === p.kind ? "✅ " : "❌ Tekrar düşün: "}{picked[i] === p.kind ? p.why : "her iki yönden sor: bir A’nın kaç B’si olabilir? Bir B’nin kaç A’sı?"}</p>}
        </div>
      ))}
      <p className="text-zinc-500">
        Doğru: {score}/{PAIRS.length}. Sihirli soru iki yönlü: “Bir restoranın kaç masası olur?” ve “Bir masanın kaç restoranı olur?”
      </p>
    </div>
  );
}

/* ───────────── 3. ERD: kutular, PK ve FK ───────────── */

type Field = { name: string; type: string; key?: "PK" | "FK" | "UQ"; note: string };
const TABLES: { name: string; title: string; fields: Field[] }[] = [
  {
    name: "users",
    title: "👤 users (kişiler)",
    fields: [
      { name: "id", type: "int", key: "PK", note: "Primary key: kişinin değişmeyen sıra numarası. Başka tablolar kişiyi bu numarayla anar." },
      { name: "email", type: "text", key: "UQ", note: "Unique: aynı e-posta iki kez olamaz (Gün 16’da kayıt formunda kıracağız)." },
      { name: "name", type: "text", note: "Sadece burada yazılı. Leyla’nın adı değişirse tek bir satır güncellenir." },
    ],
  },
  {
    name: "memberships",
    title: "📝 memberships (iş sözleşmeleri)",
    fields: [
      { name: "id", type: "int", key: "PK", note: "Sözleşmenin kendi numarası." },
      { name: "user_id", type: "int", key: "FK", note: "Foreign key → users.id. ‘Bu numarada bir kişi GERÇEKTEN var olmalı.’ Yoksa veritabanı reddeder." },
      { name: "restaurant_id", type: "int", key: "FK", note: "Foreign key → restaurants.id. Var olmayan restorana (999) sözleşme yazılamaz: bugünkü kırma deneyi." },
      { name: "role", type: "OWNER|MANAGER|WAITER", note: "Rol kişide değil sözleşmede: Leyla bir yerde sahip, diğerinde müdür." },
    ],
  },
  {
    name: "restaurants",
    title: "🏠 restaurants (restoranlar)",
    fields: [
      { name: "id", type: "int", key: "PK", note: "Restoranın değişmeyen numarası." },
      { name: "slug", type: "text", key: "UQ", note: "URL’de görünen kısa ad (dolma-evi). Unique." },
      { name: "name", type: "text", note: "Sadece burada yazılı." },
      { name: "timezone", type: "text", note: "Varsayılan Asia/Baku: Gün 10’daki ‘gösterimde restoranın saati’ buradan okunacak." },
    ],
  },
];

const keyColor: Record<string, string> = {
  PK: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
  FK: "bg-sky-500/20 text-sky-800 dark:text-sky-300",
  UQ: "bg-violet-500/20 text-violet-800 dark:text-violet-300",
};

export function ErdDiagram() {
  const [sel, setSel] = useState<{ t: string; f: Field } | null>(null);
  const linked = (t: string, f: Field) =>
    sel?.f.key === "FK" &&
    ((sel.f.name === "user_id" && t === "users" && f.name === "id") || (sel.f.name === "restaurant_id" && t === "restaurants" && f.name === "id"));
  return (
    <div className="space-y-3 text-sm">
      <div className="grid gap-2 sm:grid-cols-3 sm:items-start">
        {TABLES.map((t) => (
          <div key={t.name} className="rounded-lg border-2 border-zinc-400 dark:border-zinc-600">
            <p className="border-b border-zinc-400 bg-zinc-500/10 px-2 py-1 font-semibold dark:border-zinc-600">{t.title}</p>
            {t.fields.map((f) => {
              const active = sel?.t === t.name && sel.f.name === f.name;
              return (
                <button
                  key={f.name}
                  onClick={() => setSel({ t: t.name, f })}
                  className={`flex w-full items-center justify-between gap-2 px-2 py-1 text-left font-mono text-xs hover:bg-zinc-500/10 ${active ? "ring-2 ring-emerald-500" : ""} ${linked(t.name, f) ? "bg-sky-500/20" : ""}`}
                >
                  <span>
                    {f.key && <span className={`mr-1 rounded px-1 ${keyColor[f.key]}`}>{f.key}</span>}
                    {f.name}
                  </span>
                  <span className="text-zinc-500">{f.type}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-xs text-zinc-500">users 1 ──&lt; memberships &gt;── 1 restaurants &nbsp;(“─&lt;” = çok tarafı)</p>
      <p className="min-h-12 rounded bg-zinc-500/10 p-2">
        {sel ? (
          <>
            <b className="font-mono">
              {sel.t}.{sel.f.name}
            </b>
            : {sel.f.note}
          </>
        ) : (
          "Bir alana tıkla. İpucu: memberships’teki mavi FK’lara tıkla, hangi kutuya ‘baktıklarını’ gör."
        )}
      </p>
    </div>
  );
}

/* ───────────── 4. Gerçek veritabanında kır (Prisma + Neon) ───────────── */

type Member = { role: string; user: { id: number; name: string; email: string } };
type Restaurant = { id: number; slug: string; name: string; memberships: Member[] };

const TRIES = [
  { id: "valid", label: "✅ Rauf’u Çay Bağı’na garson yap (geçerli)", expect: "Kabul edilmeli" },
  { id: "fk-restaurant", label: "💥 Leyla’yı 999 numaralı restorana ekle", expect: "Böyle bir restoran yok" },
  { id: "fk-user", label: "💥 999 numaralı kişiyi Dolma Evi’ne ekle", expect: "Böyle bir kişi yok" },
  { id: "duplicate", label: "💥 Leyla’yı Dolma Evi’ne ikinci kez ekle", expect: "Zaten sözleşmesi var" },
  { id: "delete-restaurant", label: "💥 Dolma Evi’ni sil (içinde çalışan var)", expect: "Restrict" },
] as const;

type TryResult = { status: number; body: Record<string, unknown> };

function verdict(r: TryResult): string {
  const b = r.body;
  if (b.ok === true) {
    const saved = b.wouldHaveSaved as { id?: number } | undefined;
    return `✅ Veritabanı kabul etti (HTTP ${r.status}). Yeni satırın numarası ${saved?.id ?? "?"} olacaktı, ama lab verisi bozulmasın diye geri alındı (ROLLBACK).`;
  }
  const pg = String(b.postgresCode ?? "");
  if (pg === "23503") return `❌ Reddedildi (HTTP ${r.status}): foreign key. Sözleşme var olmayan bir şeyi gösteriyor. Prisma: ${b.prismaCode} · Postgres: 23503`;
  if (pg === "23505") return `❌ Reddedildi (HTTP ${r.status}): unique. Bu kişi bu restoranda zaten var. Prisma: ${b.prismaCode} · Postgres: 23505`;
  if (pg === "23001") return `❌ Reddedildi (HTTP ${r.status}): RESTRICT. İçinde çalışan varken restoran silinemez. Prisma: ${b.prismaCode} · Postgres: 23001`;
  return `⚠️ HTTP ${r.status}: ${String(b.error ?? b.message ?? "beklenmeyen cevap")}`;
}

export function ErdLab() {
  const [rows, setRows] = useState<Restaurant[] | null>(null);
  const [listMsg, setListMsg] = useState<string>("");
  const [busy, setBusy] = useState<string | null>(null);
  const [res, setRes] = useState<Record<string, TryResult>>({});

  async function load() {
    setBusy("load");
    try {
      const r = await fetch("/api/tutorial/erd", { cache: "no-store" });
      const b = await r.json();
      if (r.ok) {
        setRows(b.restaurants);
        setListMsg(`HTTP ${r.status} · sorgu ${b.queryMs} ms`);
      } else setListMsg(`HTTP ${r.status} · ${b.error ?? ""} ${b.hint ?? ""}`);
    } catch {
      setListMsg("İstek başarısız");
    } finally {
      setBusy(null);
    }
  }

  async function attempt(id: string) {
    setBusy(id);
    try {
      const r = await fetch("/api/tutorial/erd", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: id }) });
      const body = (await r.json()) as Record<string, unknown>;
      setRes((s) => ({ ...s, [id]: { status: r.status, body } }));
    } catch {
      setRes((s) => ({ ...s, [id]: { status: 0, body: { error: "İstek başarısız" } } }));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2">
        <button className={btnMain} disabled={busy !== null} onClick={load}>
          {busy === "load" ? "⏳ …" : "📖 Restoranları ve çalışanlarını getir"}
        </button>
        {listMsg && <p className="text-xs text-zinc-500">{listMsg}</p>}
        {rows && (
          <div className="grid gap-2 sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.id} className="rounded-lg border border-zinc-300 p-2 dark:border-zinc-700">
                <p className="font-semibold">
                  🏠 {r.name} <span className="font-mono text-xs text-zinc-500">id {r.id}</span>
                </p>
                <ul className="mt-1 space-y-0.5">
                  {r.memberships.map((m) => (
                    <li key={m.user.id} className={m.user.name.startsWith("Leyla") ? "rounded bg-amber-500/15 px-1" : "px-1"}>
                      👤 {m.user.name} · <span className="font-mono text-xs">{m.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {rows && <p className="text-xs text-zinc-500">Sarı satırlar: Leyla iki kutuda da var, ama users tablosunda tek bir satır. Bu çoka-çok ilişki.</p>}
      </div>

      <div className="space-y-2">
        {TRIES.map((t) => (
          <div key={t.id} className="space-y-1">
            <button className={btn} disabled={busy !== null} onClick={() => attempt(t.id)}>
              {busy === t.id ? "⏳ …" : t.label}
            </button>
            {res[t.id] && (
              <div className="space-y-1">
                <p className={res[t.id].body.ok ? "rounded bg-emerald-500/10 p-2" : "rounded bg-red-500/10 p-2"}>{verdict(res[t.id])}</p>
                <details>
                  <summary className="cursor-pointer text-xs text-zinc-500">Ham cevabı göster (developer’ın göreceği)</summary>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-zinc-950 p-2 text-xs text-emerald-300">
                    {`HTTP ${res[t.id].status}\n${JSON.stringify(res[t.id].body, null, 2)}`}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        Hepsi zararsız: her deneme bir transaction içinde, sonunda bilerek geri alınıyor. Tekrar tekrar basabilirsin, veri değişmez.
      </p>
    </div>
  );
}

/* ───────────── 5. Prisma: bir kez tarif et, iki şey üret ───────────── */

const VIEWS = {
  schema: {
    label: "📐 schema.prisma (biz yazdık)",
    code: `model Membership {
  id           Int  @id @default(autoincrement())
  userId       Int  @map("user_id")
  restaurantId Int  @map("restaurant_id")
  role         Role

  user       User       @relation(fields: [userId], references: [id])
  restaurant Restaurant @relation(fields: [restaurantId], references: [id])

  @@unique([userId, restaurantId])
  @@map("memberships")
}`,
  },
  sql: {
    label: "🗄️ migration.sql (Prisma üretti)",
    code: `CREATE TABLE "memberships" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "restaurant_id" INTEGER NOT NULL,
  "role" "role" NOT NULL,
  CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "memberships_user_id_restaurant_id_key"
  ON "memberships"("user_id", "restaurant_id");
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id");`,
  },
  code: {
    label: "🧩 TypeScript (Prisma üretti)",
    code: `// lib/prisma.ts'ten gelen client ile:
const rest = await prisma.restaurant.findMany({
  include: { memberships: { include: { user: true } } },
});
rest[0].memberships[0].user.name   // ✅ editör otomatik tamamlar
rest[0].memberships[0].user.phone  // ❌ kırmızı çizgi: böyle bir alan yok`,
  },
} as const;

export function SchemaToBoth() {
  const [v, setV] = useState<keyof typeof VIEWS>("schema");
  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map((k) => (
          <button key={k} className={v === k ? btnMain : btn} onClick={() => setV(k)}>
            {VIEWS[k].label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-emerald-300">{VIEWS[v].code}</pre>
    </div>
  );
}
