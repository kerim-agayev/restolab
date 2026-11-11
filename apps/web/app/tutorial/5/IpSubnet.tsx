"use client";

import { useState } from "react";

function parseIp(s: string): number | null {
  const parts = s.trim().split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => (/^\d{1,3}$/.test(p) ? Number(p) : NaN));
  if (nums.some((n) => Number.isNaN(n) || n > 255)) return null;
  return ((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0;
}

const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
const maskOf = (cidr: number) => (cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0);

function classify(n: number): { label: string; color: string; help: string } {
  const a = n >>> 24;
  const b = (n >>> 16) & 255;
  if (a === 127) return { label: "Loopback (localhost)", color: "text-sky-500", help: "Bilgisayarın kendisi. 127.0.0.1 = “ben”. Dışarıdan erişilemez." };
  if (a === 10) return { label: "Private (10.0.0.0/8)", color: "text-amber-500", help: "İç ağ adresi. Şirket ağları ve cloud VPC’ler (AWS, K8s) genelde bunu kullanır. İnternette doğrudan görünmez." };
  if (a === 172 && b >= 16 && b <= 31) return { label: "Private (172.16.0.0/12)", color: "text-amber-500", help: "İç ağ adresi. Docker container’ları sıkça bu aralıktan IP alır (Gün 57)." };
  if (a === 192 && b === 168) return { label: "Private (192.168.0.0/16)", color: "text-amber-500", help: "Ev / ofis Wi‑Fi’ı. Router sana bu aralıktan IP verir (DHCP — Gün 6)." };
  if (a === 169 && b === 254) return { label: "Link-local (169.254.x.x)", color: "text-red-500", help: "DHCP’den IP alınamadı! Wi‑Fi’a bağlı görünüp internet yoksa ipconfig’te bunu görürsün." };
  return { label: "Public", color: "text-emerald-500", help: "İnternette görünen gerçek adres. Vercel, Google vb. sunucuların adresleri böyle." };
}

const PRESETS = [
  { label: "🏠 Ev Wi‑Fi", ip: "192.168.1.23", cidr: 24, other: "192.168.1.50" },
  { label: "☁️ Cloud VPC", ip: "10.0.3.17", cidr: 16, other: "10.0.200.4" },
  { label: "💻 localhost", ip: "127.0.0.1", cidr: 8, other: "127.0.0.53" },
  { label: "🌍 Vercel", ip: "76.76.21.21", cidr: 24, other: "76.76.22.9" },
];

export function IpSubnet() {
  const [ipText, setIpText] = useState("192.168.1.23");
  const [cidr, setCidr] = useState(24);
  const [otherText, setOtherText] = useState("192.168.1.50");

  const ip = parseIp(ipText);
  const other = parseIp(otherText);
  const mask = maskOf(cidr);

  if (ip === null) {
    return (
      <div className="space-y-2 text-sm">
        <input value={ipText} onChange={(e) => setIpText(e.target.value)} className="rounded border bg-transparent px-2 py-1 font-mono" />
        <p className="text-red-500">Geçerli bir IPv4 adresi değil. 4 parça olmalı, her parça 0–255 (ör. 192.168.1.23).</p>
      </div>
    );
  }

  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hostBits = 32 - cidr;
  const hosts = hostBits >= 2 ? 2 ** hostBits - 2 : hostBits === 1 ? 2 : 1;
  const same = other !== null && ((other & mask) >>> 0) === network;
  const cls = classify(ip);
  const allBits = ip.toString(2).padStart(32, "0");

  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setIpText(p.ip);
              setCidr(p.cidr);
              setOtherText(p.other);
            }}
            className="rounded border px-2 py-1 text-xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1">
          <span className="block text-xs">IP adresi</span>
          <input value={ipText} onChange={(e) => setIpText(e.target.value)} className="w-40 rounded border bg-transparent px-2 py-1 font-mono" />
        </label>
        <label className="flex-1 space-y-1">
          <span className="block text-xs">
            CIDR: <b>/{cidr}</b> → ilk {cidr} bit ağın, son {hostBits} bit cihazların
          </span>
          <input type="range" min={8} max={30} value={cidr} onChange={(e) => setCidr(Number(e.target.value))} className="w-full" />
        </label>
      </div>

      {/* Bit görünümü */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 font-mono text-xs">
          {[0, 1, 2, 3].map((o) => (
            <div key={o} className="text-center">
              <div className="flex">
                {allBits.slice(o * 8, o * 8 + 8).split("").map((b, i) => {
                  const idx = o * 8 + i;
                  return (
                    <span key={idx} className={`w-4 ${idx < cidr ? "bg-violet-500/30" : "bg-emerald-500/30"}`}>
                      {b}
                    </span>
                  );
                })}
              </div>
              <div className="mt-1 font-semibold">{(ip >>> (24 - o * 8)) & 255}</div>
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs">
          <span className="bg-violet-500/30 px-1">mor</span> = ağ (mahalle) kısmı ·{" "}
          <span className="bg-emerald-500/30 px-1">yeşil</span> = cihaz (ev numarası) kısmı
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-300 p-3 font-mono text-xs dark:border-zinc-700">
          <p>Subnet mask: <b>{toIp(mask)}</b></p>
          <p>Ağ adresi:   <b>{toIp(network)}/{cidr}</b></p>
          <p>Broadcast:   <b>{toIp(broadcast)}</b></p>
          <p>Cihaz aralığı: {hostBits >= 2 ? `${toIp(network + 1)} – ${toIp(broadcast - 1)}` : "—"}</p>
          <p>Kaç cihaz sığar: <b>{hosts.toLocaleString("tr-TR")}</b></p>
        </div>
        <div className="space-y-1 rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">
          <p className={`font-semibold ${cls.color}`}>{cls.label}</p>
          <p className="text-xs">{cls.help}</p>
        </div>
      </div>

      <div className="space-y-1 rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">
        <label className="flex flex-wrap items-center gap-2">
          İkinci cihaz:
          <input value={otherText} onChange={(e) => setOtherText(e.target.value)} className="w-40 rounded border bg-transparent px-2 py-1 font-mono" />
        </label>
        {other === null ? (
          <p className="text-red-500">Geçersiz IP</p>
        ) : same ? (
          <p className="text-emerald-600">
            ✅ Aynı ağda ({toIp(network)}/{cidr}). Router’a gerek yok — doğrudan konuşurlar (önce ARP ile MAC’i bulurlar ↓).
          </p>
        ) : (
          <p className="text-amber-600">
            ↗️ Farklı ağda. Paket önce <b>gateway</b>’e (router) gider, o yönlendirir. Garson tableti mutfak yazıcısına ulaşamıyorsa ilk
            bakılacak yer: aynı subnet’teler mi?
          </p>
        )}
      </div>
    </div>
  );
}
