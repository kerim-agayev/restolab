"use client";

import { useState } from "react";

const PUBLIC_IP = "85.132.44.10";
const SENDERS = [
  { id: "laptop", icon: "💻", name: "Laptop", ip: "192.168.1.23", port: 51234 },
  { id: "tablet", icon: "📱", name: "Garson tableti", ip: "192.168.1.24", port: 51234 },
];

type Row = { inside: string; outside: string; dest: string; who: string };

export function NatTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const send = (d: (typeof SENDERS)[number]) => {
    const inside = `${d.ip}:${d.port}`;
    if (rows.some((r) => r.inside === inside)) return;
    const outside = `${PUBLIC_IP}:${40001 + rows.length}`;
    setRows((r) => [...r, { inside, outside, dest: "76.76.21.21:443", who: d.name }]);
    setLog((l) => [
      `→ ${d.icon} ${d.name} gönderdi: kaynak ${inside} → hedef 76.76.21.21:443`,
      `   📶 Router kaynak adresi DEĞİŞTİRDİ: ${inside} ⇒ ${outside} (tabloya yazdı)`,
      ...l,
    ]);
  };

  const reply = (row: Row) => {
    setLog((l) => [
      `← 🌍 Vercel cevap verdi: hedef ${row.outside}`,
      `   📶 Router tabloya baktı: ${row.outside} ⇒ ${row.inside} (${row.who}) — cevabı doğru cihaza verdi`,
      ...l,
    ]);
  };

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap gap-2">
        {SENDERS.map((d) => (
          <button key={d.id} onClick={() => send(d)} className="rounded bg-emerald-600 px-3 py-1 text-white">
            {d.icon} {d.name} istek atsın
          </button>
        ))}
        <button
          onClick={() => {
            setRows([]);
            setLog([]);
          }}
          className="rounded border px-3 py-1"
        >
          Sıfırla
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        Dikkat: iki cihaz da AYNI kaynak portu (51234) kullanıyor. Router yine de karıştırmaz — dışarıda farklı portlar verir.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left font-mono text-xs">
          <thead>
            <tr className="[&_th]:border-b [&_th]:py-1">
              <th>İçeride (private)</th>
              <th>Dışarıda (public)</th>
              <th>Hedef</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-2 font-sans text-zinc-500">NAT tablosu boş — bir cihaz istek atsın.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.inside} className="[&_td]:py-1">
                <td>{r.inside}</td>
                <td className="text-emerald-600">{r.outside}</td>
                <td>{r.dest}</td>
                <td>
                  <button onClick={() => reply(r)} className="rounded border px-2 font-sans">← Cevap gelsin</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <pre className="max-h-48 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs whitespace-pre-wrap text-zinc-200">
        {log.length ? log.join("\n") : "Log boş."}
      </pre>
    </div>
  );
}
