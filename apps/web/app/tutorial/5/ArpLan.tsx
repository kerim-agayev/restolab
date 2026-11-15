"use client";

import { useState } from "react";

const DEVICES = [
  { id: "laptop", icon: "💻", name: "Laptop (sen)", ip: "192.168.1.23", mac: "a4:5e:60:12:34:56" },
  { id: "tablet", icon: "📱", name: "Garson tableti", ip: "192.168.1.24", mac: "3c:22:fb:77:10:02" },
  { id: "printer", icon: "🖨️", name: "Mutfak yazıcısı", ip: "192.168.1.50", mac: "00:1b:a9:5c:00:50" },
  { id: "router", icon: "📶", name: "Router (gateway)", ip: "192.168.1.1", mac: "f0:9f:c2:aa:bb:01" },
  { id: "attacker", icon: "🦹", name: "Saldırgan", ip: "192.168.1.66", mac: "de:ad:be:ef:66:66" },
] as const;

type Step = { text: string; active: string[]; arrow?: string; cache?: string };

function buildSteps(attack: boolean): Step[] {
  const base: Step[] = [
    { text: "Laptop, Vercel’e (76.76.21.21) paket göndermek istiyor. Subnet hesabı: Vercel aynı ağda değil → paket ROUTER’a (192.168.1.1) gitmeli. Ama router’ın MAC adresini bilmiyor. ARP cache boş.", active: ["laptop"], cache: "(boş)" },
    { text: "📢 ARP Request (BROADCAST — herkese): “192.168.1.1 kimde? 192.168.1.23’e söylesin.” Ağdaki HERKES bu mesajı duyar.", active: ["laptop", "tablet", "printer", "router", ...(attack ? ["attacker"] : [])], arrow: "laptop → herkes" },
    { text: "Router cevap verir (sadece laptop’a): “192.168.1.1 benim, MAC’im f0:9f:c2:aa:bb:01.”", active: ["router", "laptop"], arrow: "router → laptop", cache: "192.168.1.1 → f0:9f:c2:aa:bb:01 ✅" },
  ];
  if (!attack) {
    return [
      ...base,
      { text: "Laptop cevabı ARP cache’ine yazar. Artık Ethernet çerçevesinin “Hedef MAC” alanına router’ın MAC’ini koyar ve paketi gönderir. Router paketi internete yönlendirir.", active: ["laptop", "router"], arrow: "laptop → router → 🌍", cache: "192.168.1.1 → f0:9f:c2:aa:bb:01 ✅" },
    ];
  }
  return [
    ...base,
    { text: "🦹 Saldırgan da cevap gönderir — sorulmasa bile, tekrar tekrar: “192.168.1.1 benim, MAC’im de:ad:be:ef:66:66.” ARP’de doğrulama YOK; son gelen cevap kazanır.", active: ["attacker", "laptop"], arrow: "saldırgan → laptop (YALAN)", cache: "192.168.1.1 → de:ad:be:ef:66:66 ☠️ (zehirlendi)" },
    { text: "Laptop artık “router” sanarak paketleri SALDIRGANA gönderir. Saldırgan paketleri okur, sonra gerçek router’a iletir — kimse bir şey fark etmez. Buna Man-in-the-Middle (MITM) denir.", active: ["laptop", "attacker", "router"], arrow: "laptop → 🦹 → router → 🌍", cache: "192.168.1.1 → de:ad:be:ef:66:66 ☠️" },
    { text: "Saldırgan ne görür? HTTP kullanılıyorsa şifreler dahil HER ŞEYİ. HTTPS kullanılıyorsa sadece anlamsız şifreli veri (Gün 6 — sniffing simülatörü). Savunma: HTTPS her yerde, switch’te Dynamic ARP Inspection, güvenilmeyen Wi‑Fi’da dikkat.", active: ["attacker"], cache: "192.168.1.1 → de:ad:be:ef:66:66 ☠️" },
  ];
}

export function ArpLan() {
  const [attack, setAttack] = useState(false);
  const [i, setI] = useState(0);
  const steps = buildSteps(attack);
  const s = steps[Math.min(i, steps.length - 1)];

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded border border-red-500/50 px-2 py-1">
          <input
            type="checkbox"
            checked={attack}
            onChange={(e) => {
              setAttack(e.target.checked);
              setI(0);
            }}
          />
          🦹 Ağda saldırgan var (ARP spoofing)
        </label>
        <span className="text-xs text-zinc-500">Adım {Math.min(i, steps.length - 1) + 1}/{steps.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {DEVICES.filter((d) => attack || d.id !== "attacker").map((d) => (
          <div
            key={d.id}
            className={`rounded-lg border p-2 text-center text-xs transition-all duration-500 ${
              s.active.includes(d.id)
                ? d.id === "attacker"
                  ? "scale-105 border-red-500 bg-red-500/20"
                  : "scale-105 border-emerald-500 bg-emerald-500/20"
                : "border-zinc-300 opacity-60 dark:border-zinc-700"
            }`}
          >
            <div className="text-2xl">{d.icon}</div>
            <div className="font-semibold">{d.name}</div>
            <div className="font-mono">{d.ip}</div>
            <div className="font-mono text-[10px] text-zinc-500">{d.mac}</div>
          </div>
        ))}
      </div>

      {s.arrow && <p className="text-center font-mono text-xs">➡️ {s.arrow}</p>}
      <p className="rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">{s.text}</p>
      <p className="font-mono text-xs">
        Laptop’un ARP cache’i: <span className={s.cache?.includes("☠️") ? "text-red-500" : ""}>{s.cache ?? "(değişmedi)"}</span>
      </p>

      <div className="flex gap-2">
        <button onClick={() => setI((x) => Math.max(0, x - 1))} className="rounded border px-3 py-1">← Önceki</button>
        <button onClick={() => setI((x) => Math.min(steps.length - 1, x + 1))} className="rounded bg-emerald-600 px-3 py-1 text-white">Sonraki →</button>
        <button onClick={() => setI(0)} className="rounded border px-3 py-1">Sıfırla</button>
      </div>
    </div>
  );
}
