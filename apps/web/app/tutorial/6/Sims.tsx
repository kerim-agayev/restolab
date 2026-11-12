"use client";

/** Gün 6 (Network 2) simülasyonları: DNS, DHCP, ping/traceroute, TLS, dinleme (sahte veri), firewall, uçtan uca yolculuk. */
import { useEffect, useRef, useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";

/** Kendi kendini temizleyen interval yardımcısı. */
function useTicker() {
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (ref.current) clearInterval(ref.current);
    },
    [],
  );
  return {
    start(fn: () => boolean, ms: number) {
      if (ref.current) clearInterval(ref.current);
      ref.current = setInterval(() => {
        if (fn() && ref.current) clearInterval(ref.current);
      }, ms);
    },
    stop() {
      if (ref.current) clearInterval(ref.current);
    },
  };
}

/* ───────────── 1. DNS: telefon rehberi zinciri ───────────── */

const DNS_STEPS = [
  { icon: "🧠", who: "Tarayıcının kendi defteri", say: "Bu ismi daha önce sordum mu?", cacheStop: true },
  { icon: "💻", who: "Windows’un defteri", say: "Peki bilgisayarın hafızasında var mı?", cacheStop: true },
  { icon: "📞", who: "İnternet sağlayıcının rehber görevlisi (resolver)", say: "Bilmiyorum, ama nasıl bulunacağını biliyorum. Önce ‘en üst rehber’e soruyorum." },
  { icon: "🌍", who: "Kök rehber (root)", say: "Ben tek tek isimleri bilmem; .app uzantısını hangi rehber tutuyor, onu söylerim → ‘.app rehberine sor’." },
  { icon: "🏷️", who: ".app rehberi (TLD)", say: "vercel.app’i Vercel’in kendi rehberi tutuyor → ‘Vercel’e sor’." },
  { icon: "🏢", who: "Vercel’in kendi rehberi (authoritative)", say: "restolab-kappa.vercel.app = 216.198.79.195. Bu bilgi GERÇEK kaynaktan." },
  { icon: "✅", who: "Cevap geri döndü", say: "Herkes cevabı defterine yazdı (TTL = 300 sn: 5 dakika boyunca tekrar sorma)." },
];

export function DnsChain() {
  const [step, setStep] = useState(-1);
  const [cached, setCached] = useState(false);
  const [done, setDone] = useState(false);
  const ticker = useTicker();

  function run() {
    setDone(false);
    setStep(0);
    const last = cached ? 0 : DNS_STEPS.length - 1;
    let i = 0;
    ticker.start(() => {
      if (i >= last) {
        setDone(true);
        setCached(true);
        return true;
      }
      i += 1;
      setStep(i);
      return false;
    }, 800);
  }

  const visible = step < 0 ? [] : DNS_STEPS.slice(0, step + 1);
  const hit = cached && done && step === 0;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button className={btnMain} onClick={run}>
          🔎 “restolab-kappa.vercel.app” kimin adresi?
        </button>
        <button
          className={btn}
          onClick={() => {
            ticker.stop();
            setCached(false);
            setStep(-1);
            setDone(false);
          }}
        >
          🗑️ Defterleri sil (cache temizle)
        </button>
      </div>
      <p className="text-xs text-zinc-500">Defterde kayıt: {cached ? "VAR ✅ (TTL dolana kadar)" : "YOK"}</p>
      <ol className="space-y-2">
        {visible.map((s, i) => (
          <li key={s.who} className={`rounded-lg border p-2 text-sm ${i === step ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-300 dark:border-zinc-700"}`}>
            <p className="font-semibold">
              {s.icon} {s.who}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">{s.say}</p>
          </li>
        ))}
      </ol>
      {hit && (
        <p className="rounded-lg bg-emerald-500/15 p-3 text-sm">
          ⚡ Defterde vardı! Zincirin hiçbir halkasına gitmedik: bilgi bedava ve anında. İlk seferde ~7 halka, ikinci seferde 1.
        </p>
      )}
    </div>
  );
}

/* ───────────── 2. DNS kayıt türleri + TTL ───────────── */

const RECORDS = [
  { type: "A", value: "216.198.79.195", plain: "“Bu isim şu evin (sunucunun) adresinde.” En temel kayıt. IPv4 adresi.", econ: "Rehberdeki ‘isim → adres’ satırı." },
  { type: "AAAA", value: "2606:4700::6810:1", plain: "Aynısı ama yeni nesil, uzun adres (IPv6). Eski adresler (IPv4) azaldığı için.", econ: "Aynı mal, ikinci depo." },
  { type: "CNAME", value: "cname.vercel-dns.com", plain: "“Bu isim başka bir ismin takma adı.” Adresi sen tutma, onu tutana yönlendir.", econ: "Bayi: ürünü kendi tutmaz, toptancıya yönlendirir." },
  { type: "MX", value: "10 mail.restolab.com", plain: "“Bu alan adının e-postaları şu posta sunucusuna gider.” Sayı: öncelik.", econ: "Şirketin resmi posta kutusu adresi." },
  { type: "TXT", value: "v=spf1 include:resend.com ~all", plain: "Serbest not satırı. ‘Bu alan adı adına e-posta atmaya şu servis yetkili’ gibi kanıtlar için kullanılır.", econ: "Noter onaylı yetki belgesi." },
  { type: "NS", value: "ns1.vercel-dns.com", plain: "“Bu alan adının ASIL rehberi kim?” (authoritative sunucu).", econ: "Şirketin ticaret sicil adresi: asıl kayıt orada." },
];

function fmt(sec: number) {
  if (sec < 120) return `${sec} saniye`;
  if (sec < 7200) return `${Math.round(sec / 60)} dakika`;
  return `${Math.round(sec / 3600)} saat`;
}

export function DnsRecords() {
  const [open, setOpen] = useState<string | null>("A");
  const [ttl, setTtl] = useState(300);
  return (
    <div className="space-y-4">
      <ul className="space-y-1">
        {RECORDS.map((r) => (
          <li key={r.type} className="rounded-lg border border-zinc-300 dark:border-zinc-700">
            <button className="flex w-full flex-wrap items-center gap-2 p-2 text-left text-sm" onClick={() => setOpen(open === r.type ? null : r.type)}>
              <span className="w-16 rounded bg-zinc-500/15 px-1.5 py-0.5 text-center font-mono font-semibold">{r.type}</span>
              <span className="font-mono text-xs">{r.value}</span>
              <span className="ml-auto text-xs text-zinc-500">{open === r.type ? "▲" : "▼ ne demek?"}</span>
            </button>
            {open === r.type && (
              <div className="space-y-1 border-t border-zinc-200 p-2 text-sm dark:border-zinc-800">
                <p>{r.plain}</p>
                <p className="text-xs text-violet-700 dark:text-violet-400">💼 {r.econ}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="space-y-2 rounded-lg bg-zinc-500/10 p-3 text-sm">
        <p className="font-semibold">⏳ TTL = bilginin raf ömrü</p>
        <p>
          Sunucunu taşıdın ve A kaydını değiştirdin. Dünyadaki defterler eski adresi ne kadar süre hatırlar? TTL’ni seç:
        </p>
        <div className="flex flex-wrap gap-2">
          {[60, 300, 3600, 86400].map((v) => (
            <button key={v} className={ttl === v ? btnMain : btn} onClick={() => setTtl(v)}>
              {fmt(v)}
            </button>
          ))}
        </div>
        <p>
          ➡ Eski adresi hatırlayan defterler <b>en geç {fmt(ttl)}</b> sonra güncellenir.{" "}
          {ttl <= 300
            ? "Taze ama: herkes sık sık yeniden sorar → rehber sunucuları daha çok yorulur (maliyet ↑)."
            : "Ucuz ama: taşıma günü bir kısım kullanıcı gün boyu ESKİ adrese gider (bayat bilgi riski ↑)."}
        </p>
        <p className="text-xs text-violet-700 dark:text-violet-400">
          💼 Ekonomi: bu klasik bir takas — bilgiyi taze tutmanın maliyeti ile bayat bilginin maliyeti. Taşımadan önce TTL’yi
          düşürmek DevOps’un standart hilesi.
        </p>
      </div>
    </div>
  );
}

/* ───────────── 3. DHCP: otelde oda anahtarı (DORA) ───────────── */

const DORA = [
  { letter: "D", name: "Discover", from: "💻 Laptop → herkese", say: "“Ağa yeni girdim, kimse bana bir adres verebilir mi?”", hotel: "Resepsiyona girip yüksek sesle: “Boş oda var mı?”" },
  { letter: "O", name: "Offer", from: "📡 Router (DHCP sunucusu) → Laptop", say: "“Sana 192.168.0.103 adresini önerebilirim, 24 saatliğine.”", hotel: "Resepsiyon: “205 numara boş, 1 günlüğüne.”" },
  { letter: "R", name: "Request", from: "💻 Laptop → Router", say: "“Tamam, 192.168.0.103’ü istiyorum.” (başka teklif geldiyse hangisini seçtiğini herkese duyurur)", hotel: "Sen: “205’i alıyorum.”" },
  { letter: "A", name: "Acknowledge", from: "📡 Router → Laptop", say: "“Onaylandı. 192.168.0.103 senin, router=192.168.0.1, DNS=1.1.1.1. Süre dolunca yenile.”", hotel: "Resepsiyon: anahtar + kurallar (kahvaltı saati, wifi şifresi)." },
];

export function DhcpDora() {
  const [n, setN] = useState(0);
  return (
    <div className="space-y-3">
      <ol className="space-y-2">
        {DORA.slice(0, n).map((d, i) => (
          <li key={d.name} className={`rounded-lg border p-3 text-sm ${i === n - 1 ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-300 dark:border-zinc-700"}`}>
            <p className="font-semibold">
              <span className="mr-2 rounded bg-emerald-600 px-1.5 text-white">{d.letter}</span>
              {d.name} <span className="font-normal text-zinc-500">· {d.from}</span>
            </p>
            <p className="font-mono text-xs">{d.say}</p>
            <p className="text-xs text-sky-700 dark:text-sky-400">🏨 {d.hotel}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <button className={btnMain} disabled={n >= 4} onClick={() => setN((x) => x + 1)}>
          {n === 0 ? "📶 Wi‑Fi’ya bağlan" : "Sıradaki mesaj ▶"}
        </button>
        <button className={btn} onClick={() => setN(0)}>
          Sıfırla
        </button>
      </div>
      {n === 4 && (
        <p className="rounded-lg bg-zinc-500/10 p-3 text-sm">
          Bu yüzden ev router’ında “DHCP kapalı” ise elle IP yazman gerekir; ve iki cihaza <b>aynı IP</b> elle verirsen
          “IP çakışması” olur (iki misafire aynı oda anahtarı). Süre (lease) dolunca laptop yenileme ister.
        </p>
      )}
    </div>
  );
}

/* ───────────── 4. ping + traceroute: TTL ile adım adım ───────────── */

const HOPS = [
  { name: "Evdeki router", ip: "192.168.0.1", ms: 2 },
  { name: "İnternet sağlayıcı (giriş)", ip: "100.64.x.x", ms: 12 },
  { name: "Sağlayıcı omurgası 1", ip: "10.x.x.x", ms: 3 },
  { name: "Sağlayıcı omurgası 2", ip: "109.x.x.x", ms: 3 },
  { name: "Şehirlerarası bağlantı", ip: "10.x.x.x", ms: 5 },
  { name: "Çıkış / peering noktası", ip: "109.x.x.x", ms: 2 },
  { name: "Hedef sunucu (example.com)", ip: "104.20.x.x", ms: 2 },
];

export function PingTrace() {
  const [ttl, setTtl] = useState(3);
  const [auto, setAuto] = useState(false);
  const ticker = useTicker();

  function runTrace() {
    setAuto(true);
    let t = 1;
    setTtl(1);
    ticker.start(() => {
      if (t >= HOPS.length) {
        setAuto(false);
        return true;
      }
      t += 1;
      setTtl(t);
      return false;
    }, 700);
  }

  const reached = ttl >= HOPS.length;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span>Paketin ömrü (TTL):</span>
        {HOPS.map((_, i) => (
          <button key={i} className={ttl === i + 1 ? btnMain : btn} onClick={() => setTtl(i + 1)} disabled={auto}>
            {i + 1}
          </button>
        ))}
        <button className={btn} onClick={runTrace} disabled={auto}>
          🔍 traceroute’u otomatik çalıştır
        </button>
      </div>
      <ol className="space-y-1 text-sm">
        {HOPS.map((h, i) => {
          const passed = i + 1 <= ttl;
          const dies = i + 1 === ttl && !reached;
          return (
            <li
              key={i}
              className={`flex flex-wrap items-center gap-2 rounded-lg border p-2 ${
                dies ? "border-rose-500 bg-rose-500/10" : passed ? "border-emerald-500/60 bg-emerald-500/5" : "border-zinc-300 opacity-50 dark:border-zinc-700"
              }`}
            >
              <span className="w-5 text-zinc-500">{i + 1}</span>
              <span className="min-w-52">{h.name}</span>
              <span className="font-mono text-xs">{h.ip}</span>
              <span className="ml-auto text-xs">{passed ? `${h.ms} ms` : ""}</span>
              {dies && <span className="w-full text-xs">💀 TTL burada 0 oldu → bu router paketi attı ve “zamanı doldu” (ICMP Time Exceeded) diye geri haber verdi.</span>}
            </li>
          );
        })}
      </ol>
      <p className="rounded-lg bg-zinc-500/10 p-3 text-sm">
        {reached
          ? "🎯 Paket hedefe vardı, hedef “buradayım” (echo reply) dedi. İşte ping budur: tek bir ‘orada mısın?’ sorusu."
          : `Paket ${ttl}. durakta öldü. traceroute şunu yapar: TTL=1 gönder (1. router cevap verir), TTL=2 gönder (2. router cevap verir)… ve böylece yolun haritasını çıkarır.`}
      </p>
      <p className="text-xs text-zinc-500">Not: IP’ler bu sayfada bilerek kısaltıldı (örnek harita). Kendi gerçek yolunu Teknik sayfada çıkaracaksın.</p>
    </div>
  );
}

/* ───────────── 5. TLS: mühürlü zarf + noter ───────────── */

const TLS_CASES = [
  { id: "ok", label: "✅ Normal site", name: true, date: true, issuer: true, msg: "🔒 Kilit kapalı: kimlik doğrulandı, yol şifreli." },
  { id: "exp", label: "📅 Süresi dolmuş sertifika", name: true, date: false, issuer: true, msg: "⚠️ “Bağlantınız gizli değil” (NET::ERR_CERT_DATE_INVALID). Kimliğin süresi bitmiş." },
  { id: "name", label: "🪪 Başka site adına verilmiş", name: false, date: true, issuer: true, msg: "⚠️ İsim uyuşmuyor (ERR_CERT_COMMON_NAME_INVALID). Elindeki kimlik başka birine ait." },
  { id: "self", label: "✍️ Kendi kendine imzalı", name: true, date: true, issuer: false, msg: "⚠️ Tanımadığım imza (ERR_CERT_AUTHORITY_INVALID). Kimliği ‘ben kendim onayladım’ diyen biri verdi." },
];

export function TlsCheck() {
  const [id, setId] = useState("ok");
  const c = TLS_CASES.find((x) => x.id === id) ?? TLS_CASES[0];
  const row = (ok: boolean, text: string) => (
    <li className="flex gap-2">
      <span>{ok ? "✅" : "❌"}</span>
      <span>{text}</span>
    </li>
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {TLS_CASES.map((t) => (
          <button key={t.id} className={id === t.id ? btnMain : btn} onClick={() => setId(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-2 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
        <p className="font-semibold">Tarayıcı, siteyle konuşmaya başlamadan 3 şeyi kontrol eder:</p>
        <ul className="space-y-1">
          {row(c.name, "İsim: kimlik kartındaki isim, girdiğim adresle aynı mı?")}
          {row(c.date, "Tarih: kimlik hâlâ geçerli mi?")}
          {row(c.issuer, "İmza: kimliği, güvendiğim bir noter (CA) mı onayladı?")}
        </ul>
        <p className={`rounded-lg p-2 ${c.name && c.date && c.issuer ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>{c.msg}</p>
      </div>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        <li>Site <b>kimlik kartını</b> (sertifika) gösterir.</li>
        <li>Tarayıcı kartı yukarıdaki 3 kontrolle denetler.</li>
        <li>İkisi, <b>kimsenin duymadığı</b> bir ortak gizli anahtar üretir (el sıkışma).</li>
        <li>Bundan sonra her şey o anahtarla <b>mühürlü zarfta</b> gider.</li>
      </ol>
    </div>
  );
}

/* ───────────── 6. Kafede dinleme (SAHTE veri) ───────────── */

const HTTP_PACKETS = [
  { n: 1, info: "GET /menu HTTP/1.1  Host: kafe-demo.test", danger: false },
  { n: 2, info: "POST /login   user=garson1&password=demo1234", danger: true },
  { n: 3, info: "Set-Cookie: session=abc123xyz  (oturum anahtarı)", danger: true },
  { n: 4, info: "200 OK  {\"ad\":\"Garson 1\",\"rol\":\"waiter\"}", danger: false },
];
const TLS_PACKETS = [
  "TLS Application Data  17 03 03 00 5a 8f 2c e1 4b …",
  "TLS Application Data  17 03 03 02 1f d0 77 a9 3e …",
  "TLS Application Data  17 03 03 00 3c 5e b1 09 c4 …",
  "TLS Application Data  17 03 03 00 9d 12 f8 6a 70 …",
];

export function Sniffer() {
  const [secure, setSecure] = useState(false);
  const [listening, setListening] = useState(false);
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">⚠️ Tamamen SAHTE veri ve simülasyon. Gerçek ağ dinleme yok.</p>
      <div className="flex flex-wrap gap-2">
        <button className={!secure ? btnMain : btn} onClick={() => setSecure(false)}>
          http:// (şifresiz)
        </button>
        <button className={secure ? btnMain : btn} onClick={() => setSecure(true)}>
          https:// (TLS)
        </button>
        <button className={btn} onClick={() => setListening((l) => !l)}>
          {listening ? "👀 Dinlemeyi bırak" : "👀 Kafedeki aynı Wi‑Fi’daki biri dinliyor olsun"}
        </button>
      </div>
      {listening ? (
        <div className="space-y-1 rounded-lg bg-zinc-900 p-3 font-mono text-xs text-green-300">
          {(secure ? TLS_PACKETS : HTTP_PACKETS.map((p) => p.info)).map((line, i) => (
            <p key={i} className={!secure && HTTP_PACKETS[i].danger ? "text-rose-300" : ""}>
              {i + 1}  {line}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Dinleyen yok: iki seçenek de sorunsuz çalışır. Dinleyeni açınca farkı gör.</p>
      )}
      {listening && (
        <p className="rounded-lg bg-zinc-500/10 p-3 text-sm">
          {secure
            ? "🔒 Dinleyen sadece kiminle konuştuğunu ve ne kadar veri aktığını görür; içeriği anlamsız baytlar. (Şifre, çerez, sipariş: hiçbiri.)"
            : "😬 Aynı ağdaki herkes şifreyi ve oturum çerezini düz metin olarak okur. Bu yüzden her yerde HTTPS zorunlu."}
        </p>
      )}
    </div>
  );
}

/* ───────────── 7. Firewall kuralları (en az yetki) ───────────── */

const PORTS = [
  { port: 443, name: "Web sitesi (HTTPS)", want: "all", why: "Müşteriler siteye girebilmeli → herkese açık olmalı. Kapatırsan site ÇALIŞMAZ (güvenlik ↔ erişilebilirlik takası)." },
  { port: 22, name: "SSH (sunucuya uzaktan yönetim)", want: "office", why: "Sadece yöneticiler lazım. Herkese açarsan botlar sürekli şifre dener." },
  { port: 5432, name: "PostgreSQL veritabanı", want: "app", why: "Sadece uygulama sunucusu konuşmalı. Müşterinin veritabanına işi yok." },
  { port: 6379, name: "Redis (cache)", want: "app", why: "Genelde şifresiz/zayıf. Sadece uygulama sunucusu görmeli." },
] as const;
const SOURCES = [
  { v: "all", label: "Herkes (0.0.0.0/0)" },
  { v: "office", label: "Sadece şirket IP’si" },
  { v: "app", label: "Sadece uygulama sunucusu" },
  { v: "none", label: "Kapalı" },
] as const;

export function FirewallGame() {
  const [rules, setRules] = useState<Record<number, string>>({ 443: "all", 22: "all", 5432: "all", 6379: "all" });
  const [checked, setChecked] = useState(false);
  const exposed = PORTS.filter((p) => rules[p.port] === "all" && p.want !== "all");
  return (
    <div className="space-y-3">
      <p className="text-sm">Yeni sunucun hazır ve <b>her şey herkese açık</b> geldi. Her kapı için “kime açık?” seç.</p>
      <ul className="space-y-2">
        {PORTS.map((p) => (
          <li key={p.port} className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-700">
            <span className="w-14 font-mono font-semibold">{p.port}</span>
            <span className="min-w-44 flex-1">{p.name}</span>
            <select
              value={rules[p.port]}
              onChange={(e) => {
                setRules((r) => ({ ...r, [p.port]: e.target.value }));
                setChecked(false);
              }}
              className="rounded border border-zinc-400 bg-transparent p-1 text-sm"
            >
              {SOURCES.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.label}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <button className={btnMain} onClick={() => setChecked(true)}>
        Kuralları uygula ve test et
      </button>
      {checked && (
        <div className="space-y-2 text-sm">
          {exposed.length > 0 && (
            <div className="rounded-lg bg-zinc-900 p-3 font-mono text-xs text-rose-300">
              {exposed.map((p, i) => (
                <p key={p.port}>
                  [otomatik tarayıcı 203.0.113.{10 + i}] :{p.port} açık → deneme başladı… (örnek log, sahte IP)
                </p>
              ))}
            </div>
          )}
          <ul className="space-y-1">
            {PORTS.map((p) => {
              const ok = rules[p.port] === p.want;
              const worse = rules[p.port] === "all" && p.want !== "all";
              return (
                <li key={p.port} className={`rounded-lg p-2 ${ok ? "bg-emerald-500/10" : worse ? "bg-rose-500/15" : "bg-amber-500/15"}`}>
                  {ok ? "✅" : worse ? "🚨" : "🤔"} <b>{p.port}</b>: {p.why}
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-violet-700 dark:text-violet-400">
            💼 Ekonomi: her açık kapı bir <b>saldırı yüzeyi</b>; açık bıraktığın her yetki, olası bir zararın ihtimalini büyütür.
            Kural: işini görmeye yetecek en dar yetkiyi ver (least privilege).
          </p>
        </div>
      )}
    </div>
  );
}

/* ───────────── 8. Enter’a bastın: uçtan uca ───────────── */

const JOURNEY = [
  { key: "DHCP", ms: 0, color: "bg-zinc-400", say: "Ağa ilk girişte oda anahtarını (IP) aldın. Zaten bağlıysan bu adım atlanır." },
  { key: "ARP", ms: 1, color: "bg-orange-400", say: "Router’ın kapı etiketini (MAC) öğrendin. Defterde varsa anında geçilir." },
  { key: "DNS", ms: 24, color: "bg-teal-500", say: "İsim → adres: rehber zincirine sordun (önbellekte varsa ~0 ms)." },
  { key: "TCP", ms: 14, color: "bg-emerald-500", say: "Taahhütlü mektup el sıkışması: ‘hazır mısın?’ SYN → SYN‑ACK → ACK." },
  { key: "TLS", ms: 31, color: "bg-violet-500", say: "Kimlik kartı (sertifika) kontrolü + gizli anahtar. Sonra her şey mühürlü." },
  { key: "HTTP (bekleme)", ms: 86, color: "bg-sky-500", say: "İsteği gönderdin; sunucu mutfağı çalıştırıyor. Buna TTFB denir." },
  { key: "İndirme", ms: 12, color: "bg-indigo-500", say: "Cevabın gövdesi (HTML/JSON) sana akıyor." },
];

export function EnterJourney() {
  const [n, setN] = useState(0);
  const ticker = useTicker();
  const total = JOURNEY.slice(0, n).reduce((s, j) => s + j.ms, 0);
  const all = JOURNEY.reduce((s, j) => s + j.ms, 0);

  function play() {
    let i = 0;
    setN(0);
    ticker.start(() => {
      i += 1;
      setN(i);
      return i >= JOURNEY.length;
    }, 900);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button className={btnMain} onClick={play}>
          ⏎ Enter’a bas (https://restolab-kappa.vercel.app)
        </button>
        <button className={btn} onClick={() => { ticker.stop(); setN(0); }}>
          Sıfırla
        </button>
        <span className="text-sm text-zinc-500">toplam ≈ {total} ms</span>
      </div>
      <div className="flex h-6 w-full overflow-hidden rounded bg-zinc-500/15">
        {JOURNEY.slice(0, n).map((j) => (
          <div key={j.key} className={`${j.color} h-full`} style={{ width: `${(Math.max(j.ms, 1) / all) * 100}%` }} title={j.key} />
        ))}
      </div>
      <ol className="space-y-1">
        {JOURNEY.slice(0, n).map((j, i) => (
          <li key={j.key} className={`flex gap-2 rounded-lg border p-2 text-sm ${i === n - 1 ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-300 dark:border-zinc-700"}`}>
            <span className={`mt-1 h-3 w-3 shrink-0 rounded ${j.color}`} />
            <span>
              <b>{j.key}</b> <span className="text-xs text-zinc-500">{j.ms} ms (örnek)</span>
              <br />
              <span className="text-zinc-600 dark:text-zinc-400">{j.say}</span>
            </span>
          </li>
        ))}
      </ol>
      {n === JOURNEY.length && (
        <p className="rounded-lg bg-emerald-500/15 p-3 text-sm">
          🎯 Gün 4’te DevTools → Network → <b>Timing</b> sekmesinde gördüğün renkli çubuk işte bu. Artık her rengin ne olduğunu biliyorsun.
        </p>
      )}
    </div>
  );
}
