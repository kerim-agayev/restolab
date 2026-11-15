"use client";

/** Gün 12: Modül 1 haritası — bir butona basıştan cevaba kadar her durak, hangi günde öğrenildi. */
import Link from "next/link";
import { useState } from "react";

const STOPS = [
  { day: 1, icon: "🧑‍💻", title: "Kod yazıldı ve yayına çıktı", say: "Branch → PR → preview → QA → merge → production. Ortam bilgisi (env) build anında gömüldü." },
  { day: 2, icon: "🔀", title: "İki developer aynı satıra dokundu", say: "Merge conflict, rebase. (Bu hafta stacked PR’larda gerçek hayatta yaşadın.)" },
  { day: 8, icon: "🍳", title: "Sayfa çizildi", say: "Önbellekten (SSG), sunucuda (SSR) ya da tarayıcıda (CSR). HTML resmi geldi, sonra JavaScript canlandırdı (hydration)." },
  { day: 11, icon: "📝", title: "Garson sepete ekledi", say: "Client state: tarayıcının bloknotu (localStorage). İyimser ekran güncellemesi." },
  { day: 9, icon: "🧾", title: "“Masa aç” / “Sipariş ver”e bastı", say: "Form → Server Action veya API. Tarayıcı kontrolü kolaylık, sunucu kontrolü gerçek (zod)." },
  { day: 6, icon: "📞", title: "İsim adrese çevrildi", say: "DNS rehber zinciri; defterde (cache, TTL) varsa anında." },
  { day: 5, icon: "📦", title: "Paket kutulandı ve yola çıktı", say: "Katmanlar, IP, router, NAT (santral), port (ofis), TCP (taahhütlü mektup)." },
  { day: 6, icon: "🔒", title: "Kimlik doğrulandı, zarf mühürlendi", say: "TLS: sertifika (isim, tarih, noter imzası). HSTS ile baştan https (Gün 7)." },
  { day: 7, icon: "🏬", title: "Yakındaki depo cevap verdi mi?", say: "CDN: HIT ise sunucuya hiç gitmez. CORS: başka siteyse tarayıcı izne bakar." },
  { day: 3, icon: "📨", title: "Sunucu HTTP isteğini okudu", say: "Method, header, body. Cevap: status code (2xx/4xx/5xx). Her istekte requestId’li log." },
  { day: 10, icon: "🪙", title: "Hesap yapıldı", say: "Para qəpik (tam sayı), fiyat sunucunun listesinden, zaman UTC → restoranın saati." },
  { day: 4, icon: "🔍", title: "Bir şey ters gitti, kim nasıl bakar?", say: "DevTools Network (Timing, Headers, Payload), curl, logda requestId. Hata hangi katmanda?" },
] as const;

export function ModuleMap() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ol className="space-y-1">
      {STOPS.map((s, i) => (
        <li key={`${s.day}-${s.title}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left text-sm ${open === i ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-300 dark:border-zinc-700"}`}
          >
            <span className="w-6 text-zinc-500">{i + 1}</span>
            <span>{s.icon}</span>
            <span className="flex-1 font-medium">{s.title}</span>
            <span className="rounded bg-zinc-500/15 px-1.5 text-xs">Gün {s.day}</span>
          </button>
          {open === i && (
            <div className="ml-8 space-y-1 p-2 text-sm">
              <p>{s.say}</p>
              <Link href={`/tutorial/${s.day}`} className="text-xs underline">
                Gün {s.day}’e git →
              </Link>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

const SELF = [
  "Bir PR’ın preview’ında QA yapıp merge edebiliyorum",
  "Merge conflict / rebase’in ne olduğunu anlatabiliyorum",
  "Status code ailelerini (2xx/4xx/5xx) ve 400/401/403/404/405/409/422 farkını biliyorum",
  "DevTools Network’te bir isteğin header’ını, payload’ını, timing’ini bulabiliyorum",
  "curl ile istek atıp exit code’u (6, 7, 28, 35/60) yorumlayabiliyorum",
  "Private/public IP, NAT, port ve TCP/UDP’yi benzetmeyle anlatabiliyorum",
  "DNS, TLS ve CDN’in bir istekteki yerini söyleyebiliyorum",
  "CORS hatasında engelleyenin tarayıcı olduğunu biliyorum",
  "SSG / SSR / CSR ve hydration’ı anlatabiliyorum",
  "Tarayıcıdan gelen veriye neden güvenilmediğini anlatabiliyorum (form, fiyat)",
  "Para neden float’ta tutulmaz, zaman neden UTC’de tutulur anlatabiliyorum",
];

export function SelfCheck() {
  const [c, setC] = useState<boolean[]>(() => SELF.map(() => false));
  const n = c.filter(Boolean).length;
  return (
    <div className="space-y-2">
      <ul className="space-y-1 text-sm">
        {SELF.map((s, i) => (
          <li key={s}>
            <label className="flex cursor-pointer gap-2">
              <input type="checkbox" checked={c[i]} onChange={() => setC((a) => a.map((v, j) => (j === i ? !v : v)))} />
              {s}
            </label>
          </li>
        ))}
      </ul>
      <p className="rounded-lg bg-zinc-500/10 p-3 text-sm">
        {n}/{SELF.length}.{" "}
        {n === SELF.length
          ? "🎉 Modül 1 tamam. Pazartesi veritabanına geçiyoruz."
          : "İşaretlemediğin satır = tekrar edilecek gün. Haritadan o güne git, sadece o bölümün ‘Sen anlat’ kutusunu tekrar yap."}
      </p>
    </div>
  );
}
