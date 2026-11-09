"use client";

import { useState } from "react";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
type Method = (typeof METHODS)[number];

const STATUSES = [
  [200, "200 OK"],
  [201, "201 Created"],
  [204, "204 No Content"],
  [400, "400 Bad Request"],
  [401, "401 Unauthorized"],
  [403, "403 Forbidden"],
  [404, "404 Not Found"],
  [409, "409 Conflict"],
  [422, "422 Unprocessable"],
  [429, "429 Too Many Requests"],
  [500, "500 Internal Server Error"],
  [502, "502 Bad Gateway"],
  [503, "503 Service Unavailable"],
] as const;

const CLIENT_TIMEOUT_MS = 3000;
const DEFAULT_BODY = '{\n  "masa": 5,\n  "urun": "Burger",\n  "adet": 2\n}';

type LogEntry = {
  at: string;
  method: string;
  url: string;
  status: number | "TIMEOUT" | "NETWORK";
  ms: number;
  requestId: string | null;
  rawRequest: string;
  rawResponse: string;
};

function statusColor(s: LogEntry["status"]) {
  if (typeof s !== "number") return "text-red-600";
  if (s < 300) return "text-emerald-600";
  if (s < 500) return "text-amber-600";
  return "text-red-600";
}

export function HttpLab() {
  const [method, setMethod] = useState<Method>("GET");
  const [status, setStatus] = useState(200);
  const [delay, setDelay] = useState(0);
  const [crash, setCrash] = useState(false);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selected, setSelected] = useState<LogEntry | null>(null);

  const hasBody = method === "POST" || method === "PUT";

  const send = async () => {
    const params = new URLSearchParams({ status: String(status) });
    if (delay) params.set("delay", String(delay));
    if (crash) params.set("crash", "1");
    const path = `/api/tutorial/http?${params}`;
    const reqHeaders: Record<string, string> = { accept: "application/json", "x-client": "restolab-tutorial" };
    if (hasBody) reqHeaders["content-type"] = "application/json";

    const rawRequest =
      `${method} ${path} HTTP/1.1\nHost: ${window.location.host}\n` +
      Object.entries(reqHeaders)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n") +
      (hasBody ? `\n\n${body}` : "");

    setLoading(true);
    const t0 = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    let entry: LogEntry;

    try {
      const res = await fetch(path, {
        method,
        headers: reqHeaders,
        body: hasBody ? body : undefined,
        signal: controller.signal,
        cache: "no-store",
      });
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* JSON değilse olduğu gibi göster */
      }
      const shownHeaders = ["content-type", "x-request-id", "x-restolab-channel", "cache-control"]
        .map((h) => [h, res.headers.get(h)] as const)
        .filter(([, v]) => v)
        .map(([h, v]) => `${h}: ${v}`)
        .join("\n");
      entry = {
        at: new Date().toLocaleTimeString(),
        method,
        url: path,
        status: res.status,
        ms: Math.round(performance.now() - t0),
        requestId: res.headers.get("x-request-id"),
        rawRequest,
        rawResponse: `HTTP/1.1 ${res.status} ${res.statusText}\n${shownHeaders}${pretty ? `\n\n${pretty}` : "\n\n(body yok)"}`,
      };
    } catch (e) {
      const isTimeout = e instanceof DOMException && e.name === "AbortError";
      entry = {
        at: new Date().toLocaleTimeString(),
        method,
        url: path,
        status: isTimeout ? "TIMEOUT" : "NETWORK",
        ms: Math.round(performance.now() - t0),
        requestId: null,
        rawRequest,
        rawResponse: isTimeout
          ? `(cevap gelmedi)\n\nTarayıcı ${CLIENT_TIMEOUT_MS / 1000} saniye bekledi ve vazgeçti (client timeout).\nSunucu belki hâlâ çalışıyor — ama kullanıcı için bu bir hata.`
          : `(ağ hatası)\n\n${String(e)}`,
      };
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
    setLogs((l) => [entry, ...l].slice(0, 30));
    setSelected(entry);
  };

  return (
    <div className="space-y-4">
      {/* Kontroller */}
      <div className="grid gap-3 rounded-lg border border-zinc-300 p-3 text-sm sm:grid-cols-2 dark:border-zinc-700">
        <label className="space-y-1">
          <span className="block font-medium">Method (ne yapmak istiyorsun?)</span>
          <select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="w-full rounded border bg-transparent px-2 py-1">
            {METHODS.map((m) => (
              <option key={m} value={m} className="text-black">
                {m}
                {m === "PATCH" ? " (bu endpoint desteklemiyor!)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Sunucu hangi status ile cevap versin?</span>
          <select value={status} onChange={(e) => setStatus(Number(e.target.value))} className="w-full rounded border bg-transparent px-2 py-1">
            {STATUSES.map(([code, label]) => (
              <option key={code} value={code} className="text-black">
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Sunucu ne kadar beklesin?</span>
          <select value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="w-full rounded border bg-transparent px-2 py-1">
            <option value={0} className="text-black">Hemen cevap ver</option>
            <option value={1500} className="text-black">1.5 sn (yavaş servis)</option>
            <option value={5000} className="text-black">5 sn (tarayıcı 3 sn bekler → TIMEOUT)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 self-end">
          <input type="checkbox" checked={crash} onChange={(e) => setCrash(e.target.checked)} />
          💥 Sunucu bilerek çöksün (gerçek exception)
        </label>
        {hasBody && (
          <label className="space-y-1 sm:col-span-2">
            <span className="block font-medium">Body (gönderdiğin veri — JSON). Bir virgülü sil ve gönder → 400!</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              spellCheck={false}
              className="w-full rounded border bg-zinc-950 p-2 font-mono text-xs text-zinc-100"
            />
          </label>
        )}
        <button
          onClick={send}
          disabled={loading}
          className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50 sm:col-span-2"
        >
          {loading ? "⏳ Cevap bekleniyor…" : "📨 İsteği gönder"}
        </button>
      </div>

      {/* Request / Response */}
      {selected && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold">➡️ Request (tarayıcının gönderdiği)</p>
            <pre className="h-64 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-sky-200">{selected.rawRequest}</pre>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              ⬅️ Response (sunucunun döndürdüğü) — <span className={statusColor(selected.status)}>{selected.status}</span> · {selected.ms} ms
            </p>
            <pre className="h-64 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-emerald-200">{selected.rawResponse}</pre>
          </div>
        </div>
      )}

      {/* Log paneli */}
      <div className="space-y-1">
        <p className="text-sm font-semibold">📜 Log paneli (son istekler — tıkla, detayını gör)</p>
        <div className="max-h-56 overflow-auto rounded-lg bg-zinc-950 p-2 font-mono text-xs text-zinc-200">
          {logs.length === 0 && <p className="text-zinc-500">Henüz istek yok. Yukarıdan bir istek gönder.</p>}
          {logs.map((l, i) => (
            <button
              key={`${l.at}-${i}`}
              onClick={() => setSelected(l)}
              className="block w-full truncate text-left hover:bg-zinc-800"
            >
              <span className="text-zinc-500">{l.at}</span> <span className="text-sky-300">{l.method.padEnd(6)}</span>{" "}
              <span className={statusColor(l.status)}>{String(l.status).padEnd(7)}</span> {String(l.ms).padStart(5)}ms{" "}
              <span className="text-zinc-500">reqId={l.requestId?.slice(0, 8) ?? "—"}</span> {l.url}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
