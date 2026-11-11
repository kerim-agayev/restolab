"use client";

import { useState } from "react";

const BASE = "https://restolab-kappa.vercel.app/api/tutorial/http";

const FLAG_HELP: Record<string, string> = {
  "-i": "Cevabın HEADER’larını da göster (status satırı + header’lar + body). En çok kullanılan flag.",
  "-v": "Verbose: her şeyi göster — bağlantı, TLS el sıkışma, giden (>) ve gelen (<) header’lar. Debug için.",
  "-s": "Silent: ilerleme çubuğunu gizle. Script’lerde temiz çıktı için.",
  "-X": "Method’u seç (GET varsayılan). -X POST, -X DELETE…",
  "-H": "Header ekle. Ör. -H \"content-type: application/json\". Birden fazla -H yazılabilir.",
  "-d": "Body (data) gönder. -d varsa curl otomatik POST yapar.",
  "--max-time": "En fazla N saniye bekle, sonra vazgeç (client timeout). Çıkış kodu 28 olur.",
};

export function CurlBuilder() {
  const [method, setMethod] = useState("POST");
  const [status, setStatus] = useState("201");
  const [delay, setDelay] = useState("0");
  const [json, setJson] = useState(true);
  const [body, setBody] = useState('{"masa":5,"urun":"Burger","adet":2}');
  const [flagI, setFlagI] = useState(true);
  const [flagV, setFlagV] = useState(false);
  const [flagS, setFlagS] = useState(true);
  const [maxTime, setMaxTime] = useState("");
  const [shell, setShell] = useState<"ps" | "bash">("ps");
  const [copied, setCopied] = useState(false);

  const hasBody = method === "POST" || method === "PUT";
  const params = new URLSearchParams({ status });
  if (delay !== "0") params.set("delay", delay);
  const url = `${BASE}?${params}`;

  const used: string[] = [];
  const parts: string[] = [shell === "ps" ? "curl.exe" : "curl"];
  if (flagS) { parts.push("-s"); used.push("-s"); }
  if (flagI) { parts.push("-i"); used.push("-i"); }
  if (flagV) { parts.push("-v"); used.push("-v"); }
  if (maxTime) { parts.push(`--max-time ${maxTime}`); used.push("--max-time"); }
  if (method !== "GET") { parts.push(`-X ${method}`); used.push("-X"); }
  if (hasBody && json) { parts.push('-H "content-type: application/json"'); used.push("-H"); }
  if (hasBody) {
    // PowerShell 5.1 native komutlara tırnakları bozarak geçirir → içteki " karakterleri \" olarak kaçırılmalı
    const quoted = shell === "ps" ? `'${body.replace(/"/g, '\\"')}'` : `'${body}'`;
    parts.push(`-d ${quoted}`);
    used.push("-d");
  }
  parts.push(`"${url}"`);
  const cmd = parts.join(" ");

  const expected =
    delay !== "0" && maxTime && Number(maxTime) * 1000 < Number(delay)
      ? `curl: (28) Operation timed out after ${maxTime}000 milliseconds\n→ Gün 3’teki TIMEOUT’un aynısı: sunucu ${Number(delay) / 1000} sn çalışacaktı, curl ${maxTime} sn’de vazgeçti.`
      : method === "PATCH"
        ? "HTTP/1.1 405 Method Not Allowed\nContent-Length: 0\n→ Bu adres PATCH kabul etmiyor."
        : hasBody && !json
          ? "HTTP/1.1 415 Unsupported Media Type\n{\"error\":\"Unsupported Media Type\",…}\n→ content-type header’ını unuttun!"
          : `HTTP/1.1 ${status} …\ncontent-type: application/json\nx-request-id: 8c1f…\n\n{"requestId":"8c1f…","status":${status},…}`;

  return (
    <div className="space-y-3 text-sm">
      <div className="grid gap-3 rounded-lg border border-zinc-300 p-3 sm:grid-cols-3 dark:border-zinc-700">
        <label className="space-y-1">
          <span className="block font-medium">Method</span>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded border bg-transparent px-2 py-1">
            {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => <option key={m} className="text-black">{m}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <span className="block font-medium">?status=</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded border bg-transparent px-2 py-1">
            {["200", "201", "400", "401", "403", "404", "500"].map((s) => <option key={s} className="text-black">{s}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <span className="block font-medium">?delay= (ms)</span>
          <select value={delay} onChange={(e) => setDelay(e.target.value)} className="w-full rounded border bg-transparent px-2 py-1">
            {["0", "1500", "5000"].map((d) => <option key={d} className="text-black">{d}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-3">
          <label className="flex items-center gap-1"><input type="checkbox" checked={flagI} onChange={(e) => setFlagI(e.target.checked)} /> -i</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={flagV} onChange={(e) => setFlagV(e.target.checked)} /> -v</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={flagS} onChange={(e) => setFlagS(e.target.checked)} /> -s</label>
          <label className="flex items-center gap-1">
            --max-time
            <select value={maxTime} onChange={(e) => setMaxTime(e.target.value)} className="rounded border bg-transparent px-1">
              <option value="" className="text-black">yok</option>
              <option value="2" className="text-black">2</option>
              <option value="10" className="text-black">10</option>
            </select>
          </label>
          {hasBody && (
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={json} onChange={(e) => setJson(e.target.checked)} /> content-type: application/json header’ı (kapat → 415!)
            </label>
          )}
        </div>
        {hasBody && (
          <label className="space-y-1 sm:col-span-3">
            <span className="block font-medium">Body (-d)</span>
            <input value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded border bg-transparent px-2 py-1 font-mono text-xs" />
          </label>
        )}
      </div>

      <div className="flex gap-2 text-xs">
        <button onClick={() => setShell("ps")} className={`rounded px-2 py-1 ${shell === "ps" ? "bg-sky-600 text-white" : "border"}`}>PowerShell (VS Code varsayılanı)</button>
        <button onClick={() => setShell("bash")} className={`rounded px-2 py-1 ${shell === "bash" ? "bg-sky-600 text-white" : "border"}`}>Git Bash / Linux / Mac</button>
      </div>

      <div className="relative">
        <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 pr-20 text-xs text-emerald-300">{cmd}</pre>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="absolute top-2 right-2 rounded bg-zinc-700 px-2 py-0.5 text-xs text-white"
        >
          {copied ? "✓ Kopyalandı" : "Kopyala"}
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold">Beklenen çıktı (yaklaşık):</p>
        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs whitespace-pre-wrap text-zinc-200">{expected}</pre>
      </div>

      <ul className="space-y-1 text-xs">
        {used.map((f) => (
          <li key={f}>
            <code className="font-bold">{f}</code> — {FLAG_HELP[f]}
          </li>
        ))}
      </ul>
    </div>
  );
}
