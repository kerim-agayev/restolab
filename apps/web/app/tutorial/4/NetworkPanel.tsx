"use client";

import { useState } from "react";

type ReqType = "document" | "script" | "stylesheet" | "font" | "fetch" | "other";
type Timing = { queue: number; dns: number; connect: number; ssl: number; send: number; wait: number; download: number };
type Req = {
  id: string;
  name: string;
  url: string;
  method: string;
  status: number;
  type: ReqType;
  initiator: string;
  initiatorStack: string[];
  size: string;
  cacheable?: boolean;
  timing: Timing;
  reqHeaders: [string, string][];
  resHeaders: [string, string][];
  payload?: string;
  response: string;
  cookies: { sent: [string, string][]; set: string[] };
  real?: boolean;
};

const HOST = "https://restolab-kappa.vercel.app";
const T = (dns: number, connect: number, ssl: number, wait: number, download: number): Timing => ({
  queue: 2, dns, connect, ssl, send: 1, wait, download,
});

const MOCK: Req[] = [
  {
    id: "doc", name: "tutorial/4", url: `${HOST}/tutorial/4`, method: "GET", status: 200, type: "document",
    initiator: "Other", initiatorStack: ["Adres çubuğuna yazdın / linke tıkladın → tarayıcı sayfayı istedi"],
    size: "9.8 kB", timing: T(18, 22, 31, 64, 9),
    reqHeaders: [["accept", "text/html"], ["accept-language", "tr,en;q=0.9"], ["cookie", "_vercel_jwt=eyJhbGciOi… (preview koruması)"], ["user-agent", "Mozilla/5.0 (Windows NT 10.0) Chrome/142"]],
    resHeaders: [["content-type", "text/html; charset=utf-8"], ["cache-control", "public, max-age=0, must-revalidate"], ["x-vercel-cache", "HIT"], ["x-vercel-id", "fra1::abcde"], ["strict-transport-security", "max-age=63072000"]],
    response: "<!DOCTYPE html><html lang=\"tr\"><head>…</head><body>…RestoLab…</body></html>",
    cookies: { sent: [["_vercel_jwt", "eyJhbGciOi…"]], set: [] },
  },
  {
    id: "js", name: "main-app.js", url: `${HOST}/_next/static/chunks/main-app.js`, method: "GET", status: 200, type: "script",
    initiator: "tutorial/4", initiatorStack: ["HTML içindeki <script src=\"/_next/static/chunks/main-app.js\"> etiketi"],
    size: "98.4 kB", cacheable: true, timing: T(0, 0, 0, 22, 41),
    reqHeaders: [["accept", "*/*"]], resHeaders: [["content-type", "application/javascript"], ["cache-control", "public, max-age=31536000, immutable"]],
    response: "(self.webpackChunk=…) — React ve Next.js'in tarayıcıda çalışan kodu (sıkıştırılmış)",
    cookies: { sent: [], set: [] },
  },
  {
    id: "css", name: "app.css", url: `${HOST}/_next/static/css/app.css`, method: "GET", status: 200, type: "stylesheet",
    initiator: "tutorial/4", initiatorStack: ["HTML içindeki <link rel=\"stylesheet\"> etiketi"],
    size: "12.1 kB", cacheable: true, timing: T(0, 0, 0, 18, 6),
    reqHeaders: [["accept", "text/css"]], resHeaders: [["content-type", "text/css"], ["cache-control", "public, max-age=31536000, immutable"]],
    response: "*,::before,::after{box-sizing:border-box}…(Tailwind CSS)",
    cookies: { sent: [], set: [] },
  },
  {
    id: "font", name: "geist.woff2", url: `${HOST}/_next/static/media/geist.woff2`, method: "GET", status: 200, type: "font",
    initiator: "app.css", initiatorStack: ["app.css içindeki @font-face { src: url(geist.woff2) }"],
    size: "28.0 kB", cacheable: true, timing: T(0, 0, 0, 15, 12),
    reqHeaders: [["accept", "font/woff2"]], resHeaders: [["content-type", "font/woff2"]],
    response: "(ikili font dosyası — okunabilir değil)",
    cookies: { sent: [], set: [] },
  },
  {
    id: "post", name: "http?status=201", url: `${HOST}/api/tutorial/http?status=201`, method: "POST", status: 201, type: "fetch",
    initiator: "HttpLab.tsx:72", initiatorStack: ["send (HttpLab.tsx:72)", "onClick (HttpLab.tsx:180)", "— React event —", "“📨 İsteği gönder” butonuna tıkladın"],
    size: "512 B", timing: T(0, 0, 0, 48, 2),
    reqHeaders: [["content-type", "application/json"], ["accept", "application/json"], ["x-client", "restolab-tutorial"]],
    resHeaders: [["content-type", "application/json"], ["x-request-id", "3f2a9c1e-…"], ["x-restolab-channel", "prod"], ["cache-control", "no-store"]],
    payload: '{"masa":5,"urun":"Burger","adet":2}',
    response: '{"requestId":"3f2a9c1e-…","status":201,"statusText":"Created","method":"POST","receivedBody":{"masa":5,"urun":"Burger","adet":2}}',
    cookies: { sent: [], set: [] },
  },
  {
    id: "crash", name: "http?crash=1", url: `${HOST}/api/tutorial/http?crash=1`, method: "GET", status: 500, type: "fetch",
    initiator: "HttpLab.tsx:72", initiatorStack: ["send (HttpLab.tsx:72)", "onClick (HttpLab.tsx:180)", "“💥 Sunucu bilerek çöksün” işaretliyken gönderdin"],
    size: "0 B", timing: T(0, 0, 0, 37, 0),
    reqHeaders: [["accept", "application/json"]], resHeaders: [["content-length", "0"]],
    response: "",
    cookies: { sent: [], set: [] },
  },
  {
    id: "login", name: "login (örnek — Gün 16)", url: `${HOST}/api/auth/login`, method: "POST", status: 200, type: "fetch",
    initiator: "LoginForm.tsx:31", initiatorStack: ["submit (LoginForm.tsx:31)", "“Giriş yap” butonuna tıkladın"],
    size: "214 B", timing: T(0, 0, 0, 120, 1),
    reqHeaders: [["content-type", "application/json"]],
    resHeaders: [["content-type", "application/json"], ["set-cookie", "restolab_session=a1b2…; Path=/; HttpOnly; Secure; SameSite=Lax"]],
    payload: '{"email":"karim@restolab.az","password":"••••••••"}',
    response: '{"ok":true,"user":{"name":"Karim","role":"owner"}}',
    cookies: { sent: [], set: ["restolab_session=a1b2…; Path=/; HttpOnly; Secure; SameSite=Lax"] },
  },
];

const THROTTLE = { none: 1, fast4g: 1.6, slow4g: 4 } as const;
type Throttle = keyof typeof THROTTLE;
const FILTERS: { key: string; label: string; match: (t: ReqType) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "fetch", label: "Fetch/XHR", match: (t) => t === "fetch" },
  { key: "doc", label: "Doc", match: (t) => t === "document" },
  { key: "js", label: "JS", match: (t) => t === "script" },
  { key: "css", label: "CSS", match: (t) => t === "stylesheet" },
  { key: "font", label: "Font", match: (t) => t === "font" },
];
const TABS = ["Headers", "Payload", "Preview", "Response", "Initiator", "Timing", "Cookies"] as const;
type Tab = (typeof TABS)[number];

const TAB_HELP: Record<Tab, string> = {
  Headers: "İsteğin kimlik kartı. General: URL, method, status. Request Headers: senin gönderdiğin üst bilgiler. Response Headers: sunucunun cevabındaki üst bilgiler (x-request-id burada!). QA ilk buraya bakar.",
  Payload: "Gönderdiğin body (POST/PUT). “Ben doğru veriyi mi gönderdim?” sorusunun cevabı. Bozuk JSON, eksik alan burada görünür.",
  Preview: "Cevabın biçimlendirilmiş, okunaklı hâli (JSON ağaç gibi). Hızlıca göz atmak için.",
  Response: "Cevabın HAM hâli — sunucunun gönderdiği metnin birebir aynısı. Preview bir şey göstermiyorsa buraya bak.",
  Initiator: "Bu isteği KİM başlattı? Hangi dosya, hangi satır, hangi tıklama. “Bu istek nereden geliyor?” bug'larında altın değerinde.",
  Timing: "Zaman nereye gitti? DNS (isim → IP), bağlantı (TCP), SSL (TLS el sıkışma), Waiting/TTFB (sunucunun düşünme süresi), Download. Yavaşlık şikâyetinde “sunucu mu yavaş, ağ mı?” buradan anlaşılır.",
  Cookies: "Bu istekle giden cookie'ler ve sunucunun Set-Cookie ile yerleştirdikleri. Login/oturum bug'larında bakılır. HttpOnly = JavaScript okuyamaz (güvenlik).",
};

const PHASES: { key: keyof Timing; label: string; color: string; help: string }[] = [
  { key: "queue", label: "Queueing", color: "bg-zinc-400", help: "Tarayıcının sırada bekletmesi" },
  { key: "dns", label: "DNS Lookup", color: "bg-teal-500", help: "İsim → IP (Gün 6)" },
  { key: "connect", label: "Initial connection", color: "bg-orange-500", help: "TCP el sıkışma (Gün 5)" },
  { key: "ssl", label: "SSL", color: "bg-violet-500", help: "TLS el sıkışma (Gün 6)" },
  { key: "send", label: "Request sent", color: "bg-sky-400", help: "İsteğin gönderilmesi" },
  { key: "wait", label: "Waiting (TTFB)", color: "bg-emerald-500", help: "Sunucunun ilk byte'ı göndermesine kadar — sunucu ne kadar düşündü?" },
  { key: "download", label: "Content Download", color: "bg-blue-600", help: "Cevabın indirilmesi" },
];

function total(t: Timing) {
  return Object.values(t).reduce((a, b) => a + b, 0);
}

function statusClass(s: number) {
  return s >= 400 ? "text-red-500" : s >= 300 ? "text-amber-500" : "";
}

/** JSON ise güzel biçimlendirilmiş metin, değilse null döner. */
function prettyJson(text: string): string | null {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return null;
  }
}

function JsonPreview({ text }: { text: string }) {
  const pretty = prettyJson(text);
  if (pretty) return <pre className="whitespace-pre-wrap text-xs">{pretty}</pre>;
  return <p className="text-xs text-zinc-500">{text ? "JSON değil — Preview gösteremiyor, Response sekmesine bak." : "Bu cevabın body'si boş (Response: 0 B)."}</p>;
}

function realTiming(url: string): Timing | null {
  const entries = performance.getEntriesByName(url) as PerformanceResourceTiming[];
  const e = entries.at(-1);
  if (!e) return null;
  const r = (n: number) => Math.max(0, Math.round(n));
  return {
    queue: r(e.domainLookupStart - e.startTime),
    dns: r(e.domainLookupEnd - e.domainLookupStart),
    connect: r((e.secureConnectionStart || e.connectEnd) - e.connectStart),
    ssl: e.secureConnectionStart ? r(e.connectEnd - e.secureConnectionStart) : 0,
    send: r(e.responseStart - e.requestStart) > 0 ? 1 : 0,
    wait: r(e.responseStart - e.requestStart),
    download: r(e.responseEnd - e.responseStart),
  };
}

export function NetworkPanel() {
  const [rows, setRows] = useState<Req[]>(MOCK);
  const [selectedId, setSelectedId] = useState<string>("post");
  const [tab, setTab] = useState<Tab>("Headers");
  const [filter, setFilter] = useState("all");
  const [preserve, setPreserve] = useState(false);
  const [disableCache, setDisableCache] = useState(false);
  const [throttle, setThrottle] = useState<Throttle>("none");
  const [busy, setBusy] = useState(false);
  const [reloads, setReloads] = useState(0);

  const factor = THROTTLE[throttle];
  const view = (r: Req) => {
    const fromCache = r.cacheable && !disableCache && reloads > 0;
    const timing = r.real
      ? r.timing
      : fromCache
        ? { queue: 1, dns: 0, connect: 0, ssl: 0, send: 0, wait: 0, download: 1 }
        : ({ ...r.timing, wait: Math.round(r.timing.wait * factor), download: Math.round(r.timing.download * factor) } as Timing);
    return { ...r, timing, size: fromCache ? "(disk cache)" : r.size };
  };

  const visible = rows.filter((r) => FILTERS.find((f) => f.key === filter)!.match(r.type)).map(view);
  const selected = rows.map(view).find((r) => r.id === selectedId);
  const maxTotal = Math.max(1, ...rows.map((r) => total(view(r).timing)));

  const reload = () => {
    setReloads((n) => n + 1);
    setRows((old) => (preserve ? [...old.filter((r) => r.real), ...MOCK.map((m) => ({ ...m, id: `${m.id}-${Date.now()}` })), ...old.filter((r) => !r.real)] : MOCK));
    if (!preserve) setSelectedId("doc");
  };

  const realRequest = async () => {
    setBusy(true);
    const url = `${window.location.origin}/api/tutorial/http?status=201&from=devtools-lab-${Date.now()}`;
    const body = '{"masa":7,"urun":"Lahmacun","adet":3}';
    const reqHeaders: [string, string][] = [["content-type", "application/json"], ["accept", "application/json"], ["x-client", "devtools-lab"]];
    try {
      const res = await fetch(url, { method: "POST", headers: Object.fromEntries(reqHeaders), body, cache: "no-store" });
      const text = await res.text();
      const resHeaders: [string, string][] = [];
      res.headers.forEach((v, k) => resHeaders.push([k, v]));
      await new Promise((r) => setTimeout(r, 50)); // timing kaydının oluşmasını bekle
      const timing = realTiming(url) ?? T(0, 0, 0, 0, 0);
      const row: Req = {
        id: `real-${Date.now()}`, name: "🔴 http?status=201 (GERÇEK)", url, method: "POST", status: res.status, type: "fetch",
        initiator: "NetworkPanel.tsx", initiatorStack: ["realRequest (NetworkPanel.tsx)", "“🔴 Gerçek istek at” butonuna tıkladın"],
        size: `${new Blob([text]).size} B`, timing, reqHeaders, resHeaders, payload: body, response: text,
        cookies: { sent: [], set: [] }, real: true,
      };
      setRows((r) => [...r, row]);
      setSelectedId(row.id);
      setTab("Timing");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2 text-xs">
      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center gap-3 rounded-t-lg border border-zinc-300 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-900">
        <button onClick={reload} className="rounded border px-2 py-0.5" title="Sayfayı yenilemeyi simüle et">🔄 Yenile</button>
        <label className="flex items-center gap-1"><input type="checkbox" checked={preserve} onChange={(e) => setPreserve(e.target.checked)} />Preserve log</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={disableCache} onChange={(e) => setDisableCache(e.target.checked)} />Disable cache</label>
        <select value={throttle} onChange={(e) => setThrottle(e.target.value as Throttle)} className="rounded border bg-transparent px-1">
          <option value="none" className="text-black">No throttling</option>
          <option value="fast4g" className="text-black">Fast 4G</option>
          <option value="slow4g" className="text-black">Slow 4G</option>
        </select>
        <button onClick={realRequest} disabled={busy} className="ml-auto rounded bg-red-600 px-2 py-0.5 font-semibold text-white disabled:opacity-50">
          {busy ? "…" : "🔴 Gerçek istek at"}
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`rounded px-2 py-0.5 ${filter === f.key ? "bg-sky-600 text-white" : "border"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* İstek listesi */}
      <div className="overflow-x-auto rounded border border-zinc-300 dark:border-zinc-700">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-zinc-100 dark:bg-zinc-900">
            <tr className="[&_th]:px-2 [&_th]:py-1">
              <th>Name</th><th>Status</th><th>Method</th><th>Type</th><th>Initiator</th><th>Size</th><th>Time</th><th className="w-32">Waterfall</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const tt = total(r.timing);
              return (
                <tr
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`cursor-pointer border-t border-zinc-200 dark:border-zinc-800 [&_td]:px-2 [&_td]:py-1 ${
                    r.id === selectedId ? "bg-sky-500/20" : "hover:bg-zinc-500/10"
                  } ${statusClass(r.status)}`}
                >
                  <td className="font-mono">{r.name}</td>
                  <td>{r.status}</td>
                  <td>{r.method}</td>
                  <td>{r.type}</td>
                  <td className="text-sky-600 underline">{r.initiator}</td>
                  <td>{r.size}</td>
                  <td>{tt} ms</td>
                  <td>
                    <div className="h-2 rounded bg-emerald-500" style={{ width: `${Math.max(2, (tt / maxTotal) * 100)}%` }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detay sekmeleri */}
      {selected && (
        <div className="rounded border border-zinc-300 dark:border-zinc-700">
          <div className="flex flex-wrap gap-1 border-b border-zinc-300 p-1 dark:border-zinc-700">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded px-2 py-0.5 ${tab === t ? "bg-zinc-700 text-white" : ""}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-2 p-3">
            <p className="rounded bg-amber-500/10 p-2 text-[11px]">💡 {TAB_HELP[tab]}</p>

            {tab === "Headers" && (
              <div className="space-y-2 font-mono">
                <p className="font-sans font-semibold">General</p>
                <p>Request URL: {selected.url}</p>
                <p>Request Method: {selected.method}</p>
                <p>Status Code: <span className={statusClass(selected.status)}>{selected.status}</span></p>
                <p className="font-sans font-semibold">Response Headers</p>
                {selected.resHeaders.map(([k, v]) => <p key={k}><span className="text-violet-500">{k}</span>: {v}</p>)}
                <p className="font-sans font-semibold">Request Headers</p>
                {selected.reqHeaders.map(([k, v]) => <p key={k}><span className="text-violet-500">{k}</span>: {v}</p>)}
              </div>
            )}
            {tab === "Payload" && (selected.payload ? <pre className="font-mono">{JSON.stringify(JSON.parse(selected.payload), null, 2)}</pre> : <p>Bu istekte payload yok (GET isteklerinde body olmaz).</p>)}
            {tab === "Preview" && <JsonPreview text={selected.response} />}
            {tab === "Response" && <pre className="whitespace-pre-wrap font-mono">{selected.response || "(boş)"}</pre>}
            {tab === "Initiator" && (
              <ol className="list-decimal space-y-1 pl-5 font-mono">
                {selected.initiatorStack.map((s) => <li key={s}>{s}</li>)}
              </ol>
            )}
            {tab === "Timing" && (
              <div className="space-y-1">
                {selected.real && <p className="font-semibold text-red-500">Bu GERÇEK ölçüm — tarayıcının Resource Timing API’sinden.</p>}
                {PHASES.map((p) => {
                  const v = selected.timing[p.key];
                  return (
                    <div key={p.key} className="grid grid-cols-[130px_1fr_60px] items-center gap-2">
                      <span title={p.help}>{p.label}</span>
                      <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800">
                        <div className={`h-3 rounded ${p.color}`} style={{ width: `${Math.min(100, (v / Math.max(1, total(selected.timing))) * 100)}%` }} />
                      </div>
                      <span className="text-right">{v} ms</span>
                    </div>
                  );
                })}
                <p className="pt-1 font-semibold">Toplam: {total(selected.timing)} ms</p>
                {selected.timing.dns === 0 && selected.timing.connect === 0 && (
                  <p className="text-zinc-500">DNS ve bağlantı 0 ms: tarayıcı aynı sunucuya açık bağlantıyı yeniden kullandı (keep-alive) — her istekte el sıkışmaya gerek yok.</p>
                )}
              </div>
            )}
            {tab === "Cookies" && (
              <div className="space-y-2 font-mono">
                <p className="font-sans font-semibold">Request Cookies (giden)</p>
                {selected.cookies.sent.length ? selected.cookies.sent.map(([k, v]) => <p key={k}>{k} = {v}</p>) : <p className="font-sans text-zinc-500">Yok</p>}
                <p className="font-sans font-semibold">Response Cookies (Set-Cookie ile gelen)</p>
                {selected.cookies.set.length ? selected.cookies.set.map((c) => <p key={c}>{c}</p>) : <p className="font-sans text-zinc-500">Yok</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
