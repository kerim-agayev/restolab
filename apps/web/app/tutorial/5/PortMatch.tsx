"use client";

import { useState } from "react";

const PAIRS: { service: string; port: number; note: string }[] = [
  { service: "HTTP", port: 80, note: "Şifresiz web" },
  { service: "HTTPS", port: 443, note: "Şifreli web — Vercel’e giden her istek" },
  { service: "SSH", port: 22, note: "Sunucuya uzaktan terminal (DevOps)" },
  { service: "DNS", port: 53, note: "İsim → IP (UDP!) — Gün 6" },
  { service: "MSSQL", port: 1433, note: "Senin bildiğin SQL Server" },
  { service: "PostgreSQL", port: 5432, note: "Neon — Gün 13" },
  { service: "Redis", port: 6379, note: "Cache — Gün 42" },
  { service: "MongoDB", port: 27017, note: "Menü DB’si — Gün 36" },
  { service: "Kafka", port: 9092, note: "Event’ler — Gün 47" },
  { service: "Elasticsearch", port: 9200, note: "Arama — Gün 61" },
  { service: "Next.js dev", port: 3000, note: "pnpm dev yazınca" },
];

const OPTIONS = [...PAIRS.map((p) => p.port)].sort((a, b) => a - b);

export function PortMatch() {
  const [answers, setAnswers] = useState<Record<string, number | "">>({});
  const [checked, setChecked] = useState(false);
  const correct = PAIRS.filter((p) => answers[p.service] === p.port).length;

  return (
    <div className="space-y-3 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        {PAIRS.map((p) => {
          const a = answers[p.service] ?? "";
          const state = !checked ? "" : a === p.port ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10";
          return (
            <label key={p.service} className={`flex items-center justify-between gap-2 rounded border px-2 py-1 ${state}`}>
              <span>
                <b>{p.service}</b>
                {checked && <span className="block text-xs text-zinc-500">{p.port} — {p.note}</span>}
              </span>
              <select
                value={a}
                onChange={(e) => {
                  setChecked(false);
                  setAnswers((x) => ({ ...x, [p.service]: e.target.value ? Number(e.target.value) : "" }));
                }}
                className="rounded border bg-transparent px-1 font-mono"
              >
                <option value="" className="text-black">port?</option>
                {OPTIONS.map((o) => (
                  <option key={o} value={o} className="text-black">{o}</option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setChecked(true)} className="rounded bg-emerald-600 px-3 py-1 text-white">Kontrol et</button>
        {checked && <span>{correct}/{PAIRS.length} doğru {correct === PAIRS.length ? "🎉" : "— kırmızıları düzelt"}</span>}
      </div>
    </div>
  );
}
