"use client";

/** Gün 15: tadilat defteri (migration sırası + defter), güvenli/tehlikeli değişiklik, yayın sırası, gerçek migration lab'ı, Neon branch. */
import { useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";
const box = "rounded-lg border border-zinc-300 p-2 dark:border-zinc-700";

/* ───────────── 1. Tadilat defteri: numaralı projeler, sıra, defter, plansız usta ───────────── */

const PROJECTS = [
  { id: "001", title: "Temel + 3 oda (users, restaurants, memberships)", room: "3 oda" },
  { id: "002", title: "Mutfağa kapı aç (restaurants.phone)", room: "mutfak kapısı" },
  { id: "003", title: "Teras ekle (yeni tablo)", room: "teras" },
];

export function LedgerSim() {
  const [applied, setApplied] = useState<string[]>(["001"]);
  const [manual, setManual] = useState(false);
  const [msg, setMsg] = useState("");

  function apply(id: string) {
    const idx = PROJECTS.findIndex((p) => p.id === id);
    const before = PROJECTS.slice(0, idx).map((p) => p.id);
    const missing = before.filter((b) => !applied.includes(b));
    if (missing.length) {
      setMsg(`❌ ${id} uygulanamaz: önce ${missing.join(", ")} uygulanmalı. Projeler numara sırasıyla gider (003, 002’nin kapısından geçen bir terasa bağlı olabilir).`);
      return;
    }
    setApplied((a) => [...a, id]);
    setMsg(`✅ ${id} uygulandı ve deftere yazıldı.`);
  }

  function reset() {
    setApplied(["001"]);
    setManual(false);
    setMsg("");
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className={box}>
          <p className="mb-1 font-semibold">📁 Proje klasörü (git’te: prisma/migrations)</p>
          <ul className="space-y-1">
            {PROJECTS.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2">
                <span>
                  <b className="font-mono">{p.id}</b> {p.title}
                </span>
                {applied.includes(p.id) ? (
                  <span className="text-xs text-emerald-600">uygulandı</span>
                ) : (
                  <button className={btn} onClick={() => apply(p.id)}>
                    uygula
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className={box}>
          <p className="mb-1 font-semibold">📒 Binanın giriş defteri (veritabanında: _prisma_migrations)</p>
          <ul className="space-y-0.5 font-mono text-xs">
            {applied.map((id) => (
              <li key={id}>✅ {id} uygulandı</li>
            ))}
            {manual && <li className="text-red-600">— (defterde yok) usta duvara pencere açtı</li>}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">
            Bina: {PROJECTS.filter((p) => applied.includes(p.id)).map((p) => p.room).join(" + ")}
            {manual ? " + plansız pencere" : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-40" disabled={manual} onClick={() => setManual(true)}>
          😈 Usta projesiz pencere açsın
        </button>
        <button className={btn} onClick={reset}>
          ↺ Sıfırla
        </button>
      </div>
      {msg && <p className="rounded bg-zinc-500/10 p-2">{msg}</p>}
      {manual && (
        <p className="rounded bg-red-500/10 p-2">
          ⚠️ Çizimler (proje klasörü) ile bina artık birbirini tutmuyor. Yeni bir mimar çizimlere bakıp binayı yeniden kursa pencere olmayacak. Kimse bu
          pencerenin neden açıldığını bilmiyor. Buna <b>drift</b> (sapma) denir.
        </p>
      )}
    </div>
  );
}

/* ───────────── 2. Güvenli mi, tehlikeli mi? ───────────── */

const CHANGES = [
  { what: "Yeni, boş bırakılabilir sütun ekle (phone)", safe: true, why: "Eski satırlar boş kalır, eski kod bu sütunu hiç bilmez ve çalışmaya devam eder. Bugünkü gerçek migration bu." },
  { what: "Dolu tabloya zorunlu (NOT NULL) sütun ekle, varsayılan değer yok", safe: false, why: "Mevcut restoranların bu sütunu boş kalır, kural ‘boş olamaz’ der → Postgres reddeder (23502). Önce boş bırakılabilir ekle, doldur, sonra zorunlu yap." },
  { what: "Sütunun adını değiştir (name → title)", safe: false, why: "Çalışan kod hâlâ ‘name’ diye soruyor → anında hata (42703). Doğrusu: yeni sütunu ekle, iki yere birden yaz, kodu taşı, en son eskiyi sil (expand → contract)." },
  { what: "Sütunu sil (drop column)", safe: false, why: "Veri geri gelmez ve eski kod o sütunu soruyorsa çöker. Önce kod sütunu kullanmayı bırakır, sonra silinir." },
  { what: "Yeni tablo ekle", safe: true, why: "Kimse henüz o tabloyu kullanmıyor; eski kod etkilenmez." },
];

export function SafeOrDangerous() {
  const [ans, setAns] = useState<Record<number, boolean>>({});
  const score = CHANGES.filter((c, i) => ans[i] === c.safe).length;
  return (
    <div className="space-y-2 text-sm">
      {CHANGES.map((c, i) => (
        <div key={i} className={box + " space-y-1"}>
          <p>{c.what}</p>
          <div className="flex gap-2">
            <button className={ans[i] === true ? (c.safe ? btnMain : "rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white") : btn} onClick={() => setAns((s) => ({ ...s, [i]: true }))}>
              🟢 güvenli
            </button>
            <button className={ans[i] === false ? (!c.safe ? btnMain : "rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white") : btn} onClick={() => setAns((s) => ({ ...s, [i]: false }))}>
              🔴 tehlikeli
            </button>
          </div>
          {ans[i] !== undefined && <p className={ans[i] === c.safe ? "text-emerald-700 dark:text-emerald-400" : "text-red-600"}>{ans[i] === c.safe ? "✅ " : "❌ "}{c.why}</p>}
        </div>
      ))}
      <p className="text-zinc-500">
        Doğru: {score}/{CHANGES.length}. Sihirli soru: “Bu değişiklik yapıldığı anda, <b>hâlâ çalışan eski kod</b> bozulur mu?”
      </p>
    </div>
  );
}

/* ───────────── 3. Yayın sırası: önce kod mu, önce veritabanı mı? ───────────── */

const STEPS = ["Başlangıç", "1. adım", "2. adım"];

export function DeployOrder() {
  const [order, setOrder] = useState<"code-first" | "db-first">("code-first");
  const [step, setStep] = useState(0);
  const codeNew = order === "code-first" ? step >= 1 : step >= 2;
  const dbNew = order === "code-first" ? step >= 2 : step >= 1;
  const broken = codeNew && !dbNew;
  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap gap-2">
        <button className={order === "code-first" ? btnMain : btn} onClick={() => (setOrder("code-first"), setStep(0))}>
          Önce kod, sonra veritabanı
        </button>
        <button className={order === "db-first" ? btnMain : btn} onClick={() => (setOrder("db-first"), setStep(0))}>
          Önce veritabanı, sonra kod
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className={box}>
          <p className="font-semibold">🧩 Kod</p>
          <p className="font-mono text-xs">{codeNew ? "phone’u okuyor (yeni)" : "phone’u bilmiyor (eski)"}</p>
        </div>
        <div className={box}>
          <p className="font-semibold">🗄️ Veritabanı</p>
          <p className="font-mono text-xs">{dbNew ? "phone sütunu VAR" : "phone sütunu yok"}</p>
        </div>
      </div>
      <p className={broken ? "rounded bg-red-500/10 p-2" : "rounded bg-emerald-500/10 p-2"}>
        <b>{STEPS[step]}:</b>{" "}
        {broken
          ? "❌ Yeni kod ‘phone’u soruyor, veritabanında yok → her istek P2022 hatası. Restoranlar hata ekranı görüyor."
          : codeNew && dbNew
            ? "✅ İkisi de yeni. Bitti."
            : dbNew
              ? "✅ Sütun eklendi ama eski kod onu bilmiyor ve umursamıyor. Hiçbir şey bozulmadı."
              : "✅ Her şey eski hâlinde."}
      </p>
      <div className="flex gap-2">
        <button className={btn} disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          ← geri
        </button>
        <button className={btnMain} disabled={step === 2} onClick={() => setStep((s) => s + 1)}>
          sonraki adım →
        </button>
      </div>
    </div>
  );
}

/* ───────────── 4. Gerçek defter: control_db (Neon) ───────────── */

type Status = {
  repo: string[] | null;
  ledger: { name: string; finishedAt: string | null; rolledBack: boolean; checksum: string }[];
  pending: string[] | null;
  missingInDb: string[];
  extraInDb: string[];
  verdict: "in-sync" | "pending" | "drift" | "missing";
};

const VERDICT: Record<Status["verdict"], { text: string; cls: string }> = {
  "in-sync": { text: "✅ Çizim ile bina aynı: her proje uygulanmış, plansız değişiklik yok.", cls: "bg-emerald-500/10" },
  pending: { text: "🟡 Klasörde uygulanmamış proje var (pending). Kod yeni sütunu bekliyor ama veritabanında henüz yok.", cls: "bg-amber-500/10" },
  drift: { text: "🔴 Veritabanında planda olmayan bir şey var (drift).", cls: "bg-red-500/10" },
  missing: { text: "🔴 Şemada olan bir sütun veritabanında yok ama bekleyen proje de yok. Biri elle mi sildi?", cls: "bg-red-500/10" },
};

const TRIES = [
  { id: "safe", label: "🟢 Boş bırakılabilir sütun ekle (kampaniya)" },
  { id: "drift", label: "😈 Plansız sütun ekle (wifi_password) → drift" },
  { id: "rename", label: "💥 Sütun adını değiştir (name → title)" },
  { id: "not-null", label: "💥 Dolu tabloya zorunlu sütun ekle (vat_no NOT NULL)" },
] as const;

type TryRes = { status: number; body: Record<string, unknown> };

function tryVerdict(r: TryRes): string {
  const b = r.body;
  if (b.ok) {
    const extra = (b.extraInDb as string[]) ?? [];
    return `✅ Postgres kabul etti (HTTP ${r.status}). Eski kod hâlâ çalışıyor (${String(b.oldCodeRows)} restoran okundu). Tadilattan sonra fazladan sütun: ${extra.join(", ") || "yok"}. Sonra geri alındı.`;
  }
  if (b.postgresCode === "42703") return `❌ Eski kod çöktü (HTTP ${r.status}): ${String(b.message)}. Çalışan kod hâlâ eski adı soruyor. Prisma: ${String(b.prismaCode)} · Postgres: 42703`;
  if (b.postgresCode === "23502") return `❌ Postgres reddetti (HTTP ${r.status}): ${String(b.message)}. Mevcut satırların bu sütunu boş kalırdı. Postgres: 23502`;
  return `⚠️ HTTP ${r.status}: ${String(b.error ?? b.message ?? "beklenmeyen cevap")}`;
}

export function MigrationLab() {
  const [st, setSt] = useState<Status | null>(null);
  const [stMsg, setStMsg] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [res, setRes] = useState<Record<string, TryRes>>({});

  async function load() {
    setBusy("load");
    try {
      const r = await fetch("/api/tutorial/migrations", { cache: "no-store" });
      const b = await r.json();
      if (r.ok) {
        setSt(b);
        setStMsg(`HTTP ${r.status} · requestId ${String(b.requestId).slice(0, 8)}…`);
      } else setStMsg(`HTTP ${r.status} · ${b.error ?? ""}`);
    } catch {
      setStMsg("İstek başarısız");
    } finally {
      setBusy(null);
    }
  }

  async function attempt(id: string) {
    setBusy(id);
    try {
      const r = await fetch("/api/tutorial/migrations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: id }) });
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
          {busy === "load" ? "⏳ …" : "📒 Defteri ve klasörü karşılaştır"}
        </button>
        {stMsg && <p className="text-xs text-zinc-500">{stMsg}</p>}
        {st && (
          <>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className={box}>
                <p className="mb-1 font-semibold">📁 Repodaki projeler (prisma/migrations)</p>
                <ul className="space-y-0.5 font-mono text-xs">
                  {(st.repo ?? ["(klasör okunamadı)"]).map((m) => (
                    <li key={m}>
                      {st.pending?.includes(m) ? "🟡" : "✅"} {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={box}>
                <p className="mb-1 font-semibold">📒 Veritabanının defteri (_prisma_migrations)</p>
                <ul className="space-y-0.5 font-mono text-xs">
                  {st.ledger.map((m) => (
                    <li key={m.name}>
                      ✅ {m.name}
                      <br />
                      <span className="text-zinc-500">
                        {m.finishedAt?.slice(0, 19).replace("T", " ")} UTC · checksum {m.checksum}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className={`rounded p-2 ${VERDICT[st.verdict].cls}`}>{VERDICT[st.verdict].text}</p>
            {(st.missingInDb.length > 0 || st.extraInDb.length > 0) && (
              <p className="font-mono text-xs">
                Şemada var, veritabanında yok: {st.missingInDb.join(", ") || "—"} · Veritabanında var, şemada yok: {st.extraInDb.join(", ") || "—"}
              </p>
            )}
          </>
        )}
      </div>
      <div className="space-y-2">
        {TRIES.map((t) => (
          <div key={t.id} className="space-y-1">
            <button className={btn} disabled={busy !== null} onClick={() => attempt(t.id)}>
              {busy === t.id ? "⏳ …" : t.label}
            </button>
            {res[t.id] && (
              <div className="space-y-1">
                <p className={res[t.id].body.ok ? "rounded bg-emerald-500/10 p-2" : "rounded bg-red-500/10 p-2"}>{tryVerdict(res[t.id])}</p>
                <details>
                  <summary className="cursor-pointer text-xs text-zinc-500">Ham cevabı göster</summary>
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
        Zararsız: Postgres’te tablo değişiklikleri de transaction içinde geri alınabiliyor. Her deneme yapılıyor, sonucu ölçülüyor ve geri alınıyor.
      </p>
    </div>
  );
}

/* ───────────── 5. Kopya bina: Neon branch ───────────── */

export function BranchSim() {
  const [hasBranch, setHasBranch] = useState(false);
  const [branchBroken, setBranchBroken] = useState(false);
  return (
    <div className="space-y-3 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className={box}>
          <p className="font-semibold">🏢 production (canlı restoranlar)</p>
          <p className="font-mono text-xs">users · restaurants · memberships ✅</p>
        </div>
        <div className={box + (hasBranch ? "" : " opacity-40")}>
          <p className="font-semibold">🧪 day-15-deneme (kopya)</p>
          <p className="font-mono text-xs">
            {!hasBranch ? "henüz yok" : branchBroken ? "users · restaurants · 💥 memberships SİLİNDİ" : "users · restaurants · memberships ✅ (aynı veri)"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={btnMain} disabled={hasBranch} onClick={() => setHasBranch(true)}>
          ➕ production’dan kopya (branch) aç
        </button>
        <button className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-40" disabled={!hasBranch || branchBroken} onClick={() => setBranchBroken(true)}>
          💥 Kopyada drop table memberships
        </button>
        <button className={btn} disabled={!hasBranch} onClick={() => (setHasBranch(false), setBranchBroken(false))}>
          🗑️ Kopyayı sil
        </button>
      </div>
      <p className="rounded bg-zinc-500/10 p-2">
        {!hasBranch
          ? "Neon’da bir branch, veritabanının saniyeler içinde açılan kopyasıdır. Veriyi tek tek kopyalamaz: değişene kadar aynı sayfaları paylaşır, o yüzden anında açılır ve neredeyse yer kaplamaz."
          : branchBroken
            ? "Kopyada tabloyu sildin, ama production’a dokunulmadı. Tadilatı önce kopyada dener, sonuç iyiyse gerçeğe uygularsın. Clopos’taki ‘PR başına preview ortamı’nın veritabanı versiyonu."
            : "Kopya açıldı: production’ın şu anki hâlinin aynısı. Burada ne yaparsan yap, gerçek restoranlar etkilenmez."}
      </p>
    </div>
  );
}
