"use client";

import { useState, type ReactNode } from "react";

type Layer = {
  key: string;
  name: string;
  osi: string;
  protocols: string;
  unit: string;
  who: string;
  analogy: string;
  pentest: string;
  fields: [string, string][];
  border: string;
  bg: string;
};

// İçten dışa: Application en içte, Link en dışta
const LAYERS: Layer[] = [
  {
    key: "app", name: "Application (Uygulama)", osi: "OSI 5–6–7", protocols: "HTTP, HTTPS, DNS, SSH, SMTP", unit: "Mesaj",
    who: "Tarayıcı ve senin kodun (Next.js, NestJS)", analogy: "Sipariş fişinin kendisi: ne istiyorsun?",
    pentest: "SQL injection, XSS, IDOR — uygulama mantığına saldırılar (Modül 12)",
    fields: [["Method", "POST"], ["Path", "/api/orders"], ["Host", "restolab-kappa.vercel.app"], ["Body", '{"masa":5,"urun":"Burger"}']],
    border: "border-sky-500", bg: "bg-sky-500/10",
  },
  {
    key: "tcp", name: "Transport (Taşıma)", osi: "OSI 4", protocols: "TCP, UDP", unit: "Segment",
    who: "İşletim sistemi (Windows çekirdeği)", analogy: "Zarf: hangi KAPIYA (port) teslim edilecek, kaçıncı parça?",
    pentest: "Port tarama (nmap -sS / -sT), SYN flood",
    fields: [["Kaynak port", "51234 (geçici, OS seçti)"], ["Hedef port", "443 (HTTPS)"], ["Sequence", "1001"], ["Flags", "PSH, ACK"]],
    border: "border-orange-500", bg: "bg-orange-500/10",
  },
  {
    key: "ip", name: "Internet / Network (Ağ)", osi: "OSI 3", protocols: "IPv4, IPv6, ICMP", unit: "Paket",
    who: "İşletim sistemi + yoldaki tüm router’lar", analogy: "Kargo kutusu: hangi BİNAYA (IP) gidecek?",
    pentest: "Ping sweep (canlı cihaz bulma), IP spoofing, traceroute ile keşif",
    fields: [["Kaynak IP", "192.168.1.23 (laptop — private)"], ["Hedef IP", "76.76.21.21 (Vercel)"], ["TTL", "64 (her router 1 azaltır)"], ["Protocol", "6 = TCP"]],
    border: "border-violet-500", bg: "bg-violet-500/10",
  },
  {
    key: "eth", name: "Link (Ağ erişimi)", osi: "OSI 1–2", protocols: "Ethernet, Wi‑Fi (802.11)", unit: "Frame → bit",
    who: "Ağ kartı, Wi‑Fi, switch", analogy: "Kamyon: sadece BİR SONRAKİ DURAĞA (router) kadar götürür",
    pentest: "ARP spoofing / MITM, Wi‑Fi saldırıları, MAC spoofing",
    fields: [["Kaynak MAC", "a4:5e:60:12:34:56 (laptop)"], ["Hedef MAC", "f0:9f:c2:aa:bb:01 — ROUTER’ın! (Vercel’in değil)"], ["EtherType", "0x0800 = IPv4"]],
    border: "border-emerald-500", bg: "bg-emerald-500/10",
  },
];

function bits(seed: string) {
  let out = "";
  for (let i = 0; i < 96; i++) out += (seed.charCodeAt(i % seed.length) >> i % 7) & 1;
  return out.match(/.{1,8}/g)!.join(" ");
}

export function LayerStack() {
  // step: kaç katman sarıldı (0 = sadece HTTP mesajı, 4 = kablodaki bitler)
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState("app");
  const sel = LAYERS.find((l) => l.key === selected)!;

  const render = (i: number): ReactNode => {
    if (i < 0) return null;
    const l = LAYERS[i];
    const isHeaderVisible = i < step;
    if (!isHeaderVisible) return render(i - 1);
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setSelected(l.key);
        }}
        className={`cursor-pointer rounded-lg border-2 p-2 transition-all duration-500 ${l.border} ${l.bg} ${
          selected === l.key ? "ring-2 ring-offset-1 ring-zinc-400" : ""
        }`}
      >
        <p className="mb-1 text-xs font-semibold">
          {l.name} başlığı <span className="font-normal text-zinc-500">· {l.unit}</span>
        </p>
        <p className="mb-2 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
          {l.fields.map(([k, v]) => `${k}: ${v}`).join(" · ")}
        </p>
        {i > 0 ? render(i - 1) : <div className="rounded bg-white/50 p-1 font-mono text-[11px] dark:bg-black/30">📄 POST /api/orders {"{"}&quot;masa&quot;:5{"}"}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="rounded border px-3 py-1">← Aç (alıcı tarafı)</button>
        <button onClick={() => setStep((s) => Math.min(5, s + 1))} className="rounded bg-emerald-600 px-3 py-1 text-white">Paketle (gönderen) →</button>
        <span className="text-zinc-500">
          {step <= 4 ? `Sarılan katman: ${step}/4` : "🔌 Kabloda / havada: sadece 0 ve 1"}
        </span>
      </div>

      {step <= 4 ? render(LAYERS.length - 1) : (
        <div className="space-y-2">
          <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-emerald-300">{bits("restolab-masa-5-burger")}</pre>
          <p className="text-sm">
            Fiziksel katman: Wi‑Fi’da radyo dalgası, kabloda elektrik, fiberde ışık. Alıcı tarafta işlem <b>tersine</b> yürür:
            her katman kendi başlığını okur, çıkarır ve içindekini bir üst katmana verir (← Aç).
          </p>
        </div>
      )}

      <div className={`space-y-1 rounded-lg border p-3 text-sm ${sel.border}`}>
        <p className="font-semibold">{sel.name} <span className="font-normal text-zinc-500">({sel.osi})</span></p>
        <p><b>Benzetme:</b> {sel.analogy}</p>
        <p><b>Protokoller:</b> {sel.protocols} · <b>Birim:</b> {sel.unit}</p>
        <p><b>Kim çalıştırır:</b> {sel.who}</p>
        <p><b>🛡️ Pentest’te bu katman:</b> {sel.pentest}</p>
      </div>
      <p className="text-xs text-zinc-500">Bir kutuya tıkla → detayını gör. “Paketle” ile katman katman sar, en sonunda kablodaki bitleri gör.</p>
    </div>
  );
}
