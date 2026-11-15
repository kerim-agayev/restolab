"use client";

/** Gün 8 simülasyonları: render türleri (SSG/SSR/CSR), Server vs Client Component, hydration. */
import { useEffect, useRef, useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";

function useTicker() {
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (ref.current) clearInterval(ref.current);
    },
    [],
  );
  return {
    start(fn: () => boolean, ms: number) {
      if (ref.current) clearInterval(ref.current);
      ref.current = setInterval(() => {
        if (fn() && ref.current) clearInterval(ref.current);
      }, ms);
    },
  };
}

/* ───────────── 1. Üç mutfak: SSG / SSR / CSR ───────────── */

const MODES = {
  ssg: {
    label: "🗂️ Önceden basılmış menü kartı (SSG)",
    steps: [
      "🌙 Dün gece (build sırasında) mutfak menü kartlarını BASTI ve rafa koydu.",
      "🙋 Müşteri geldi: garson raftan hazır kartı verdi. Mutfak hiç çalışmadı.",
      "👀 Müşteri menüyü ANINDA görüyor.",
    ],
    html: true,
    fresh: "Bayat olabilir: fiyat değişirse yeni kart basılana kadar eski kart.",
    speed: "En hızlı",
  },
  ssr: {
    label: "🍳 Sipariş üzerine hazırlanan tabak (SSR)",
    steps: [
      "🙋 Müşteri geldi ve istedi.",
      "🍳 Mutfak (sunucu) o an veritabanına bakıp sayfayı HAZIRLADI.",
      "🍽️ Hazır tabak (dolu HTML) masaya geldi: müşteri içeriği görüyor.",
    ],
    html: true,
    fresh: "Her zaman taze: o anki fiyat, o anki stok.",
    speed: "Orta (mutfak her seferinde çalışır)",
  },
  csr: {
    label: "🔥 Masada pişir (CSR)",
    steps: [
      "🙋 Müşteri geldi; garson BOŞ bir tabak ve bir tarif kitabı (JavaScript) getirdi.",
      "📖 Müşterinin cihazı tarifi indirdi ve okudu.",
      "📞 Cihaz malzemeleri ayrıca istedi (fetch/API).",
      "🍽️ Ancak şimdi menü ekranda: o ana kadar ‘Yükleniyor…’.",
    ],
    html: false,
    fresh: "Taze, ama ilk görüntü gecikir ve arama motorları boş tabak görebilir.",
    speed: "İlk görüntü en yavaş",
  },
} as const;
type Mode = keyof typeof MODES;

export function ThreeKitchens() {
  const [mode, setMode] = useState<Mode>("ssg");
  const [n, setN] = useState(0);
  const ticker = useTicker();
  const m = MODES[mode];

  function play(next: Mode) {
    setMode(next);
    setN(0);
    let i = 0;
    ticker.start(() => {
      i += 1;
      setN(i);
      return i >= MODES[next].steps.length;
    }, 900);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(MODES) as Mode[]).map((k) => (
          <button key={k} className={mode === k ? btnMain : btn} onClick={() => play(k)}>
            {MODES[k].label}
          </button>
        ))}
      </div>
      <ol className="space-y-1 text-sm">
        {m.steps.slice(0, n).map((s, i) => (
          <li key={s} className={`rounded-lg border p-2 ${i === n - 1 ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-300 dark:border-zinc-700"}`}>
            {s}
          </li>
        ))}
      </ol>
      {n >= m.steps.length && (
        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <p className="rounded-lg bg-zinc-500/10 p-2">⚡ <b>Hız:</b> {m.speed}</p>
          <p className="rounded-lg bg-zinc-500/10 p-2">🥬 <b>Tazelik:</b> {m.fresh}</p>
          <p className="rounded-lg bg-zinc-500/10 p-2">
            📄 <b>“Sayfa kaynağını görüntüle”de menü var mı?</b> {m.html ? "Evet ✅" : "Hayır ❌ (sadece boş kap + script)"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ───────────── 2. Server mı, Client mı? ───────────── */

const PARTS = [
  { name: "Menü listesi (veritabanından okunur)", answer: "server", why: "Veriyi sunucuda okuyup hazır HTML göndermek hızlı; DB şifresi tarayıcıya hiç gitmez." },
  { name: "“Sepete ekle” butonu (tıklanınca sayı artar)", answer: "client", why: "Tıklama, state (useState) gibi etkileşimler tarayıcıda çalışır." },
  { name: "Restoranın adresi ve çalışma saatleri", answer: "server", why: "Sabit bilgi; JavaScript göndermeye gerek yok, daha az kod = daha hızlı sayfa." },
  { name: "Yazdıkça filtreleyen arama kutusu", answer: "client", why: "Her tuş vuruşunda tepki veriyor: tarayıcıda olmalı." },
  { name: "Gizli API anahtarıyla ödeme sağlayıcısına istek", answer: "server", why: "Gizli anahtar asla tarayıcıya gitmemeli." },
  { name: "Sipariş süresi sayacı (her saniye değişir)", answer: "client", why: "Tarayıcıda zamanlayıcı (setInterval) çalıştırır." },
] as const;

export function ServerOrClient() {
  const [picked, setPicked] = useState<Record<number, string>>({});
  const done = Object.keys(picked).length === PARTS.length;
  const score = PARTS.filter((p, i) => picked[i] === p.answer).length;
  return (
    <div className="space-y-2">
      {PARTS.map((p, i) => {
        const v = picked[i];
        return (
          <div key={p.name} className="space-y-1 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex-1">{p.name}</span>
              {(["server", "client"] as const).map((k) => (
                <button
                  key={k}
                  disabled={v !== undefined}
                  onClick={() => setPicked((s) => ({ ...s, [i]: k }))}
                  className={`rounded border px-2 py-1 text-xs ${v === k ? (k === p.answer ? "border-emerald-500 bg-emerald-500/20" : "border-rose-500 bg-rose-500/20") : "border-zinc-400"}`}
                >
                  {k === "server" ? "🍳 Mutfak (Server)" : "🙋 Masa (Client)"}
                </button>
              ))}
            </div>
            {v !== undefined && <p className="text-xs">{v === p.answer ? "✅ " : "🤔 "}{p.why}</p>}
          </div>
        );
      })}
      {done && (
        <p className="rounded-lg bg-emerald-500/15 p-3 text-sm">
          {score}/{PARTS.length}. Kural: <b>varsayılan mutfak (Server)</b>; sadece tıklama, yazma, zamanlayıcı, tarayıcı hafızası gibi
          şeyler için <code>&quot;use client&quot;</code>.
        </p>
      )}
    </div>
  );
}

/* ───────────── 3. Hydration: resim gelir, sonra canlanır ───────────── */

export function HydrationSim() {
  const [phase, setPhase] = useState<"idle" | "html" | "js" | "live">("idle");
  const [count, setCount] = useState(0);
  const [missed, setMissed] = useState(0);
  const ticker = useTicker();

  function load() {
    setPhase("html");
    setCount(0);
    setMissed(0);
    let t = 0;
    ticker.start(() => {
      t += 1;
      if (t === 3) setPhase("js");
      if (t === 6) {
        setPhase("live");
        return true;
      }
      return false;
    }, 600);
  }

  const label = { idle: "Sayfa henüz açılmadı", html: "📄 HTML geldi: buton GÖRÜNÜYOR ama sadece bir resim", js: "📦 JavaScript indiriliyor…", live: "💧 Hydration bitti: buton artık CANLI" }[phase];

  return (
    <div className="space-y-3">
      <button className={btnMain} onClick={load}>
        🔄 Sayfayı yükle
      </button>
      <p className="text-sm">{label}</p>
      {phase !== "idle" && (
        <div className="space-y-2 rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">
          <button
            className={`rounded-lg px-3 py-1.5 text-sm text-white ${phase === "live" ? "bg-emerald-600" : "bg-zinc-500"}`}
            onClick={() => (phase === "live" ? setCount((c) => c + 1) : setMissed((m) => m + 1))}
          >
            🛒 Sepete ekle ({count})
          </button>
          {missed > 0 && (
            <p className="text-xs text-rose-600">
              {missed} tıklaman boşa gitti: buton henüz “kuru resim”di. Yavaş internette kullanıcıların “buton çalışmıyor” demesinin
              sebebi bu.
            </p>
          )}
        </div>
      )}
      <p className="text-xs text-zinc-500">İpucu: “Sayfayı yükle”ye bas ve buton griyken hemen tıkla.</p>
    </div>
  );
}
