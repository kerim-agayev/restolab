"use client";

/** Gün 7 simülasyonları: HSTS, CDN/edge cache, gerçek cache lab'ı, CORS (simülatör + gerçek deneme), hata teşhis oyunu. */
import { useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";

/* ───────────── 1. http → https ve HSTS ───────────── */

export function HstsDemo() {
  const [hsts, setHsts] = useState(false);
  const steps = hsts
    ? [
        { t: "⌨️ Adres çubuğuna “restolab-kappa.vercel.app” yazdın (https yazmadan).", warn: false },
        { t: "🧠 Tarayıcı kendi notlarına bakar: “Bu siteye 2 yıl boyunca SADECE https ile gideceğim demiştim.”", warn: false },
        { t: "🔒 Şifresiz istek HİÇ gönderilmez. Tarayıcı adresi kendisi https’e çevirir (internal redirect).", warn: false },
        { t: "✅ Ağdaki hiç kimse şifresiz bir istek görmedi.", warn: false },
      ]
    : [
        { t: "⌨️ Adres çubuğuna “restolab-kappa.vercel.app” yazdın (https yazmadan).", warn: false },
        { t: "📬 Tarayıcı önce ŞİFRESİZ (http) bir istek gönderir: “siteye gelebilir miyim?”", warn: true },
        { t: "↪️ Sunucu: “308 — https’e git.” (curl’de gördüğün yönlendirme)", warn: false },
        { t: "🔒 Tarayıcı https ile tekrar dener, güvenli konuşma başlar.", warn: false },
      ];
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={hsts} onChange={(e) => setHsts(e.target.checked)} />
        Bu siteyi daha önce https ile ziyaret ettim ve site <b>HSTS</b> header’ı gönderiyor
      </label>
      <ol className="space-y-1 text-sm">
        {steps.map((s) => (
          <li key={s.t} className={`rounded-lg border p-2 ${s.warn ? "border-rose-500 bg-rose-500/10" : "border-zinc-300 dark:border-zinc-700"}`}>
            {s.t}
            {s.warn && <span className="block text-xs">⚠️ Bu ilk şifresiz istek kafedeki aynı ağdaki biri tarafından görülebilir/değiştirilebilir. İşte açık nokta tam burası.</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────── 2. CDN: bölgesel depo ───────────── */

const CITIES = [
  { name: "Bakü", edge: 6, origin: 68 },
  { name: "Berlin", edge: 5, origin: 11 },
  { name: "New York", edge: 6, origin: 92 },
] as const;

export function EdgeMap() {
  const [stock, setStock] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<string[]>([]);

  function request(city: (typeof CITIES)[number]) {
    const hit = stock[city.name];
    if (hit) {
      setLog((l) => [`👤 ${city.name}: yakındaki depodan teslim → ${city.edge} ms  (x-vercel-cache: HIT)`, ...l]);
    } else {
      setStock((s) => ({ ...s, [city.name]: true }));
      setLog((l) => [
        `👤 ${city.name}: yakın depoda YOK → fabrikaya (Frankfurt) gidildi → ${city.edge + city.origin} ms  (x-vercel-cache: MISS), kopya yakın depoya konuldu`,
        ...l,
      ]);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        🏭 Fabrika (origin sunucu): <b>Frankfurt</b>. Her şehirde bir bölgesel depo (edge). Aynı ürünü (sayfayı) isteyen kullanıcılar:
      </p>
      <div className="flex flex-wrap gap-2">
        {CITIES.map((c) => (
          <button key={c.name} className={btnMain} onClick={() => request(c)}>
            👤 {c.name} istek atsın {stock[c.name] ? "(depoda var)" : ""}
          </button>
        ))}
        <button
          className={btn}
          onClick={() => {
            setStock({});
            setLog((l) => ["🧹 Purge: tüm depolar boşaltıldı (fiyatı güncelledin, eski kopyalar atıldı).", ...l]);
          }}
        >
          🧹 Depoları boşalt (purge)
        </button>
      </div>
      <ul className="space-y-1 text-sm">
        {log.length === 0 && <li className="text-zinc-500">Henüz istek yok.</li>}
        {log.map((l, i) => (
          <li key={`${i}-${l}`} className="rounded-lg bg-zinc-500/10 p-2">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── 3. Gerçek cache lab'ı (kendi sunucunla) ───────────── */

type Row = { n: number; cache: string; age: string; generatedAt: string; ms: string; region: string };

export function CacheLab() {
  const [key, setKey] = useState<string | null>(null);
  const [ttl, setTtl] = useState(30);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function newKey() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/tutorial/cache?newkey=1", { cache: "no-store" });
      const data = (await res.json()) as { key: string };
      setKey(data.key);
      setRows([]);
    } catch {
      setError("Anahtar alınamadı. Sayfayı yenileyip tekrar dene.");
    } finally {
      setBusy(false);
    }
  }

  async function hit() {
    if (!key) return;
    setBusy(true);
    setError(null);
    try {
      const path = `/api/tutorial/cache?k=${key}&ttl=${ttl}`;
      const res = await fetch(path);
      const data = (await res.json()) as { generatedAt: string; servedFromRegion: string };
      const entries = performance.getEntriesByName(new URL(path, location.origin).href);
      const last = entries[entries.length - 1];
      setRows((r) => [
        ...r,
        {
          n: r.length + 1,
          cache: res.headers.get("x-vercel-cache") ?? "— (bu ortamda yok)",
          age: res.headers.get("age") ?? "—",
          generatedAt: data.generatedAt.slice(11, 19) + " UTC",
          ms: last ? `${Math.round(last.duration)} ms` : "—",
          region: data.servedFromRegion,
        },
      ]);
    } catch {
      setError("İstek başarısız oldu. Tekrar dene.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button className={btnMain} onClick={newKey} disabled={busy}>
          1️⃣ Yeni deneme başlat
        </button>
        <span>TTL:</span>
        {[0, 10, 30, 60].map((v) => (
          <button key={v} className={ttl === v ? btnMain : btn} onClick={() => setTtl(v)}>
            {v === 0 ? "cache yok" : `${v} sn`}
          </button>
        ))}
        <button className={btnMain} onClick={hit} disabled={busy || !key}>
          2️⃣ İstek at
        </button>
      </div>
      {key && <p className="text-xs text-zinc-500">Senin cache anahtarın: <span className="font-mono">{key}</span> (başka kimsenin cache’iyle karışmaz)</p>}
      {error && <p className="rounded-lg bg-rose-500/15 p-2 text-sm">{error}</p>}
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-zinc-500">
              <tr>
                <th className="py-1 pr-2">#</th>
                <th className="py-1 pr-2">x-vercel-cache</th>
                <th className="py-1 pr-2">age</th>
                <th className="py-1 pr-2">üretildiği an</th>
                <th className="py-1 pr-2">süre</th>
                <th className="py-1">bölge</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-1 pr-2">{r.n}</td>
                  <td className="py-1 pr-2 font-mono">{r.cache}</td>
                  <td className="py-1 pr-2 font-mono">{r.age}</td>
                  <td className="py-1 pr-2 font-mono">{r.generatedAt}</td>
                  <td className="py-1 pr-2 font-mono">{r.ms}</td>
                  <td className="py-1 font-mono">{r.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Ne bekliyoruz: ilk istek <b>MISS</b> (sunucu cevabı üretir, depoya koyar), sonrakiler <b>HIT</b> ve <b>üretildiği an AYNI</b>
        kalır, age artar. TTL dolunca yeni cevap üretilir. “cache yok” seçince hep yeni an. Local’de (npm run dev) CDN olmadığı için
        x-vercel-cache görünmez, sorun değil.
      </p>
    </div>
  );
}

/* ───────────── 4. CORS simülatörü ───────────── */

type Acao = "none" | "star" | "match" | "other";

export function CorsSim() {
  const [acao, setAcao] = useState<Acao>("none");
  const [preflight, setPreflight] = useState(false);
  const [optionsOk, setOptionsOk] = useState(false);

  const origin = "https://restolab-kappa.vercel.app";
  const allowed = acao === "star" || acao === "match";
  const steps: { t: string; bad?: boolean; good?: boolean }[] = [];
  steps.push({ t: `🌐 Sayfa ${origin} adresinde. Başka bir sitenin API’sine (https://api.baska-site.com) istek atmak istiyor.` });

  let blockedBeforeSend = false;
  if (preflight) {
    steps.push({ t: "🛂 İstek ‘riskli’ (JSON + özel header). Tarayıcı ÖNCE ‘ön kontrol’ (OPTIONS) gönderir: “bu sayfadan gelen böyle bir isteği kabul eder misin?”" });
    if (!optionsOk) {
      steps.push({ t: "❌ Sunucu OPTIONS’a izin vermedi. Tarayıcı asıl isteği HİÇ göndermez.", bad: true });
      blockedBeforeSend = true;
    } else {
      steps.push({ t: "✅ Sunucu OPTIONS’a ‘Access-Control-Allow-…’ header’larıyla izin verdi.", good: true });
    }
  }

  if (!blockedBeforeSend) {
    steps.push({ t: "📤 Asıl istek sunucuya gitti ve sunucu işini YAPTI (log’da 200 görünür)." });
    steps.push({
      t: `📥 Cevap geldi. Access-Control-Allow-Origin: ${acao === "none" ? "(yok)" : acao === "star" ? "*" : acao === "match" ? origin : "https://baska-site.com"}`,
    });
    if (allowed) steps.push({ t: "✅ Tarayıcı: “izin var” → JavaScript cevabı OKUYABİLİR.", good: true });
    else steps.push({ t: "🚫 Tarayıcı: “bu sayfaya izin verilmemiş” → cevabı JavaScript’ten SAKLAR. Konsolda CORS hatası görürsün.", bad: true });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <label className="space-y-1">
          <span className="block font-semibold">Sunucunun gönderdiği Access-Control-Allow-Origin</span>
          <select value={acao} onChange={(e) => setAcao(e.target.value as Acao)} className="w-full rounded border border-zinc-400 bg-transparent p-1">
            <option value="none">(hiç göndermiyor)</option>
            <option value="star">* (herkese izin)</option>
            <option value="match">tam bizim adresimiz</option>
            <option value="other">başka bir site adresi</option>
          </select>
        </label>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={preflight} onChange={(e) => setPreflight(e.target.checked)} /> İstek riskli (JSON + özel header → ön kontrol gerekir)
          </label>
          {preflight && (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={optionsOk} onChange={(e) => setOptionsOk(e.target.checked)} /> Sunucu OPTIONS’a izin veriyor
            </label>
          )}
        </div>
      </div>
      <ol className="space-y-1 text-sm">
        {steps.map((s) => (
          <li key={s.t} className={`rounded-lg border p-2 ${s.bad ? "border-rose-500 bg-rose-500/10" : s.good ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-300 dark:border-zinc-700"}`}>
            {s.t}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────── 5. Gerçek CORS denemesi (tarayıcında) ───────────── */

export function CorsReal() {
  const [res, setRes] = useState<Record<string, string>>({});

  async function call(id: string, url: string) {
    setRes((r) => ({ ...r, [id]: "⏳ gönderiliyor…" }));
    try {
      const r = await fetch(url);
      const text = (await r.text()).slice(0, 80);
      setRes((s) => ({ ...s, [id]: `✅ Cevabı OKUYABİLDİM (HTTP ${r.status}): “${text}”` }));
    } catch {
      setRes((s) => ({
        ...s,
        [id]: "🚫 TypeError: Failed to fetch. Tarayıcı cevabı JavaScript’e vermedi. F12 → Console’a bak: ‘blocked by CORS policy: No Access-Control-Allow-Origin header’ yazıyor. Network sekmesinde ise istek 200 görünebilir!",
      }));
    }
  }

  const items = [
    { id: "ok", label: "api.github.com/zen (CORS’a izin veriyor)", url: "https://api.github.com/zen" },
    { id: "bad", label: "www.iana.org (CORS header’ı göndermiyor)", url: "https://www.iana.org/" },
  ];
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">İki halka açık siteye GET isteği atılır (veri okumaktan başka bir şey yapmaz).</p>
      {items.map((it) => (
        <div key={it.id} className="space-y-1 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
          <button className={btnMain} onClick={() => call(it.id, it.url)}>
            fetch → {it.label}
          </button>
          {res[it.id] && <p className="text-xs">{res[it.id]}</p>}
        </div>
      ))}
    </div>
  );
}

/* ───────────── 6. Hata teşhis oyunu ───────────── */

const LAYERS = ["DNS", "TCP / port", "TLS", "HTTP (uygulama)", "CORS", "Cache"] as const;
const CASES: { symptom: string; answer: (typeof LAYERS)[number]; why: string }[] = [
  { symptom: "curl: (6) Could not resolve host", answer: "DNS", why: "İsim adrese çevrilemedi, bağlanmaya bile gelinmedi." },
  { symptom: "curl: (7) Connection refused, 2 saniyede", answer: "TCP / port", why: "Makine ayakta ama o portta kimse dinlemiyor." },
  { symptom: "NET::ERR_CERT_DATE_INVALID", answer: "TLS", why: "Sertifikanın tarihi geçmiş." },
  { symptom: "500 Internal Server Error, loglarda ‘Cannot read properties of undefined’", answer: "HTTP (uygulama)", why: "Bağlantı sağlam, uygulama kodu patladı." },
  { symptom: "Konsol: ‘blocked by CORS policy’ — ama sunucu loglarında istek 200", answer: "CORS", why: "Sunucu işi yaptı, tarayıcı cevabı sakladı. Header eksik." },
  { symptom: "Fiyatı güncelledim ama müşteri eski fiyatı görüyor. Header: x-vercel-cache: HIT, age: 3200", answer: "Cache", why: "CDN eski kopyayı veriyor: TTL bekle veya purge/revalidate yap." },
];

export function DebugGame() {
  const [picked, setPicked] = useState<Record<number, string>>({});
  const score = CASES.filter((c, i) => picked[i] === c.answer).length;
  return (
    <div className="space-y-3">
      {CASES.map((c, i) => {
        const p = picked[i];
        return (
          <div key={c.symptom} className="space-y-2 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
            <p className="font-mono text-xs">{c.symptom}</p>
            <div className="flex flex-wrap gap-1">
              {LAYERS.map((l) => (
                <button
                  key={l}
                  disabled={p !== undefined}
                  onClick={() => setPicked((s) => ({ ...s, [i]: l }))}
                  className={`rounded border px-2 py-1 text-xs ${p === l ? (l === c.answer ? "border-emerald-500 bg-emerald-500/20" : "border-rose-500 bg-rose-500/20") : "border-zinc-400"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            {p !== undefined && (
              <p className="text-xs">
                {p === c.answer ? "✅ " : `🤔 Doğrusu: ${c.answer}. `}
                {c.why}
              </p>
            )}
          </div>
        );
      })}
      {Object.keys(picked).length === CASES.length && (
        <p className="rounded-lg bg-emerald-500/15 p-3 text-sm">
          {score}/{CASES.length}. Debugging’in ilk kuralı: <b>hangi katmanda?</b> sorusu. Katmanı bulunca çözümün yarısı bitti.
        </p>
      )}
    </div>
  );
}
