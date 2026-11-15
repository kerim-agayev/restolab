"use client";

import { useEffect, useState } from "react";

type State = "open" | "closed" | "filtered";
const TARGET: { port: number; service: string; state: State; risk?: string }[] = [
  { port: 22, service: "ssh", state: "open", risk: "Normal ama şifreyle girişe açıksa brute force riski. Sadece anahtar (key) ile giriş olmalı." },
  { port: 80, service: "http", state: "open", risk: "Sadece HTTPS’e yönlendirmeli (301 → 443)." },
  { port: 443, service: "https", state: "open" },
  { port: 3306, service: "mysql", state: "closed" },
  { port: 5432, service: "postgresql", state: "filtered", risk: "✅ İyi: firewall veritabanını dış dünyadan saklıyor." },
  { port: 6379, service: "redis", state: "open", risk: "🚨 KRİTİK: Redis internete açık! Çoğu zaman şifresiz → veriler okunur/silinir. Gerçek hayatta en sık bulunan açıklardan." },
  { port: 8080, service: "http-proxy", state: "closed" },
  { port: 27017, service: "mongodb", state: "filtered", risk: "✅ İyi: firewall arkasında." },
];

function exchange(state: State, type: "sS" | "sT"): string[] {
  if (state === "closed") return ["→ SYN", "← RST  (kapı kapalı: “burada kimse yok”) — anında cevap"];
  if (state === "filtered") return ["→ SYN", "… cevap yok … (firewall paketi sessizce attı)", "⏱ timeout → filtered"];
  return type === "sS"
    ? ["→ SYN", "← SYN-ACK  (kapı açık!)", "→ RST  (bağlantıyı TAMAMLAMADAN kaç — “yarı açık” tarama, uygulama loglarında iz azdır)"]
    : ["→ SYN", "← SYN-ACK  (kapı açık!)", "→ ACK  (tam bağlantı kuruldu — uygulama logunda görünür)", "→ RST  (kapat)"];
}

export function PortScanner() {
  const [type, setType] = useState<"sS" | "sT">("sS");
  const [idx, setIdx] = useState(-1);
  const scanning = idx >= 0 && idx < TARGET.length;
  const finished = idx >= TARGET.length;

  useEffect(() => {
    if (!scanning) return;
    const delay = TARGET[idx].state === "filtered" ? 1600 : 650;
    const t = setTimeout(() => setIdx((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [scanning, idx]);

  const done = TARGET.slice(0, Math.max(0, idx));
  const current = scanning ? TARGET[idx] : null;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs">$ nmap</span>
        {(["sS", "sT"] as const).map((t) => (
          <button key={t} onClick={() => { setType(t); setIdx(-1); }} className={`rounded px-2 py-1 font-mono text-xs ${type === t ? "bg-sky-600 text-white" : "border"}`}>
            -{t}
          </button>
        ))}
        <span className="font-mono text-xs">10.0.0.5 (lab-server)</span>
        <button onClick={() => setIdx(0)} disabled={scanning} className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50">
          ▶ Taramayı başlat
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        -sS = SYN (yarı açık) tarama · -sT = TCP connect (tam bağlantı). Bu bir SİMÜLATÖR — gerçek bir sisteme paket gitmiyor.
      </p>

      {current && (
        <div className="rounded-lg border border-amber-500 bg-amber-500/10 p-3 font-mono text-xs">
          <p className="font-sans font-semibold">Taranıyor: {current.port}/tcp</p>
          {exchange(current.state, type).map((l) => <p key={l}>{l}</p>)}
        </div>
      )}

      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100">
        {`Starting Nmap ( https://nmap.org )
Nmap scan report for lab-server (10.0.0.5)
PORT      STATE     SERVICE
${done
  .map((p) => `${`${p.port}/tcp`.padEnd(10)}${p.state.padEnd(10)}${p.service}`)
  .join("\n")}${finished ? `\n\nNmap done: 1 IP address (1 host up) scanned` : scanning ? "\n…" : ""}`}
      </pre>

      {finished && (
        <div className="space-y-1">
          <p className="font-semibold">🛡️ Pentest raporu (bulgular):</p>
          {TARGET.filter((p) => p.risk).map((p) => (
            <p key={p.port} className="text-xs">
              <b className="font-mono">{p.port}/{p.service}</b> ({p.state}) — {p.risk}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
