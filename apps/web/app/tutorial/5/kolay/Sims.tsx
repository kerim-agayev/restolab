"use client";

/** Gün 5 (sade anlatım) mini simülasyonları — her biri tek bir fikri gösterir. */
import { useEffect, useRef, useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";

/* ───────────── 1. Kargo kutusu (encapsulation) ───────────── */

const BOXES = [
  {
    label: "📝 Sipariş fişi",
    content: "Masa 5: 2 çay, 1 dolma",
    who: "Sadece karşıdaki MUTFAK (uygulama) okur.",
    cls: "border-emerald-500 bg-emerald-500/10",
  },
  {
    label: "🚪 Departman + parça no",
    content: "Mutfak kapısı: 443 · Parça 1/1",
    who: "Karşı bilgisayarda fişi DOĞRU programa verir, eksik parça varsa fark eder.",
    cls: "border-sky-500 bg-sky-500/10",
  },
  {
    label: "🏙️ Şehir adresi",
    content: "Kimden: 85.132.44.10 → Kime: 76.76.21.21 (Vercel)",
    who: "Yoldaki her POSTANE (router) sadece bunu okur, gerisini açmaz.",
    cls: "border-amber-500 bg-amber-500/10",
  },
  {
    label: "🏷️ Bu sokaktaki kapı etiketi",
    content: "Kime: router’ın kapısı (40-3f-8c-…)",
    who: "Sadece BU SOKAKTAKİ kurye okur. Her durakta söküp yenisini yapıştırırlar.",
    cls: "border-rose-500 bg-rose-500/10",
  },
];

export function KargoBox() {
  const [wrapped, setWrapped] = useState(1);
  const [opening, setOpening] = useState(false);

  function render(i: number): React.ReactNode {
    const b = BOXES[i];
    return (
      <div className={`rounded-lg border-2 p-2 sm:p-3 ${b.cls}`}>
        <p className="text-sm font-semibold">{b.label}</p>
        <p className="font-mono text-xs">{b.content}</p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{b.who}</p>
        {i > 0 && <div className="mt-2">{render(i - 1)}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        {opening ? "📭 Frankfurt’ta: dıştan içe doğru AÇILIYOR." : "📦 Bakü’de: içten dışa doğru SARILIYOR."}{" "}
        <b>{wrapped}/4</b> kat
      </p>
      {render(wrapped - 1)}
      <div className="flex flex-wrap gap-2">
        <button
          className={btnMain}
          disabled={wrapped >= 4}
          onClick={() => {
            setOpening(false);
            setWrapped((w) => w + 1);
          }}
        >
          📦 Bir kutu daha sar
        </button>
        <button
          className={btn}
          disabled={wrapped <= 1}
          onClick={() => {
            setOpening(true);
            setWrapped((w) => w - 1);
          }}
        >
          📭 Karşı tarafta bir kat aç
        </button>
      </div>
      {wrapped === 4 && !opening && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          ✅ Paket yola hazır. Dikkat et: en içteki fişi yolda kimse okumuyor — herkes sadece kendi etiketine bakıyor.
        </p>
      )}
    </div>
  );
}

/* ───────────── 2. Aynı sokak mı? (IP: ağ kısmı + ev kısmı) ───────────── */

const NEIGHBORS = [
  { name: "📡 Router (modem)", ip: "192.168.0.1", same: true },
  { name: "📱 Telefonun", ip: "192.168.0.57", same: true },
  { name: "🖨️ Ofisin yazıcısı", ip: "192.168.1.20", same: false },
  { name: "☁️ Vercel sunucusu", ip: "76.76.21.21", same: false },
];

function IpParts({ ip }: { ip: string }) {
  const p = ip.split(".");
  return (
    <span className="font-mono">
      <span className="rounded bg-amber-500/25 px-0.5">{p.slice(0, 3).join(".")}</span>.
      <span className="rounded bg-sky-500/25 px-0.5">{p[3]}</span>
    </span>
  );
}

export function SameStreet() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Sen (laptop): <IpParts ip="192.168.0.103" /> —{" "}
        <span className="rounded bg-amber-500/25 px-1">sarı = sokak</span>{" "}
        <span className="rounded bg-sky-500/25 px-1">mavi = kapı no</span>
      </p>
      <ul className="space-y-2">
        {NEIGHBORS.map((n) => {
          const a = answers[n.ip];
          const done = a !== undefined;
          return (
            <li key={n.ip} className="space-y-1 rounded-lg border border-zinc-300 p-2 dark:border-zinc-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-36 text-sm">{n.name}</span>
                <IpParts ip={n.ip} />
                {!done && (
                  <>
                    <button className={btn} onClick={() => setAnswers((s) => ({ ...s, [n.ip]: true }))}>
                      Aynı sokak
                    </button>
                    <button className={btn} onClick={() => setAnswers((s) => ({ ...s, [n.ip]: false }))}>
                      Başka sokak
                    </button>
                  </>
                )}
              </div>
              {done && (
                <p className="text-sm">
                  {a === n.same ? "✅ " : "❌ "}
                  {n.same
                    ? "Aynı sokak (192.168.0). Paketi DİREKT kapısına götürürsün, postaneye gerek yok."
                    : "Başka sokak. Laptop bunu kendisi götüremez → paketi POSTANEYE (router, 192.168.0.1) verir, o yönlendirir."}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────────── 3. Sokağa bağırmak (ARP) + yalancı komşu (spoofing) ───────────── */

export function StreetShout() {
  const [liar, setLiar] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [notebook, setNotebook] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const fooled = notebook?.startsWith("66");

  function shout() {
    const lines = [
      "💻 Laptop sokağa bağırıyor: “192.168.0.1 kimin? Kapı etiketini söylesin!”",
      "👂 Sokaktaki HERKES duyuyor (telefon, yazıcı, komşu…).",
    ];
    if (liar) {
      lines.push("😈 Komşu hemen atlıyor: “Benim! Kapım 66-66-66-66-66-66.” (yalan)");
      lines.push("📡 Router da cevap veriyor: “Benim, kapım 40-3f-8c-…” — ama laptop ilk/son duyduğuna inandı.");
      setNotebook("66-66-66-66-66-66 (😈 komşu)");
    } else {
      lines.push("📡 Sadece router cevap veriyor: “Benim, kapım 40-3f-8c-11-22-33.”");
      setNotebook("40-3f-8c-11-22-33 (📡 router)");
    }
    lines.push("📒 Laptop bunu defterine yazıyor ki her seferinde bağırmasın.");
    setLog(lines);
    setSent(false);
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={liar}
          onChange={(e) => {
            setLiar(e.target.checked);
            setLog([]);
            setNotebook(null);
            setSent(false);
          }}
        />
        😈 Sokakta yalancı bir komşu olsun
      </label>
      <div className="flex flex-wrap gap-2">
        <button className={btnMain} onClick={shout}>
          📢 Sokağa bağır
        </button>
        <button className={btn} disabled={!notebook} onClick={() => setSent(true)}>
          ✉️ İnternete mektup gönder
        </button>
      </div>
      {log.length > 0 && (
        <ol className="space-y-1 rounded-lg bg-zinc-500/10 p-3 text-sm">
          {log.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ol>
      )}
      {notebook && (
        <p className="text-sm">
          📒 Laptop’un defteri: <span className="font-mono">192.168.0.1 → {notebook}</span>
        </p>
      )}
      {sent && (
        <div className={`rounded-lg p-3 text-sm ${fooled ? "bg-rose-500/15" : "bg-emerald-500/15"}`}>
          {fooled ? (
            <>
              <p className="font-mono">💻 Laptop → 😈 Komşu (okur, kopyalar) → 📡 Router → 🌍 İnternet</p>
              <p>
                Mektup yine ulaştı, laptop hiçbir şey fark etmedi! Ama komşu <b>ortada</b> durup her şeyi okudu. Sorun:
                sokak, cevap vereni sorgusuz kabul ediyor. Çözüm: mektubu <b>mühürlü zarfa</b> koymak (HTTPS — Gün 6) ve
                ağ cihazlarının sahte cevapları engellemesi.
              </p>
            </>
          ) : (
            <p className="font-mono">💻 Laptop → 📡 Router → 🌍 İnternet ✅</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────── 4. Şirket santrali (NAT) ───────────── */

type NatRow = { who: string; ext: number };

export function Switchboard() {
  const [rows, setRows] = useState<NatRow[]>([]);
  const [msg, setMsg] = useState<string>("");

  function call(who: string) {
    const ext = 40001 + rows.length;
    setRows((r) => [...r, { who, ext }]);
    setMsg(
      `${who} dışarıyı aradı. Santral dışarıya kendi TEK numarasıyla (85.132.44.10) çıktı ve deftere yazdı: “dahili ${ext} = ${who}”.`,
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        Evin internete açılan <b>tek</b> numarası: <span className="font-mono">85.132.44.10</span>. İçeride birçok cihaz var.
      </p>
      <div className="flex flex-wrap gap-2">
        <button className={btnMain} onClick={() => call("💻 Laptop")}>
          💻 Laptop dışarı istek atsın
        </button>
        <button className={btnMain} onClick={() => call("📱 Telefon")}>
          📱 Telefon dışarı istek atsın
        </button>
        <button
          className={btn}
          onClick={() => setMsg("👤 Yabancı biri kimse çağırmadan kapıyı çaldı. Defterde böyle bir kayıt yok → santral çağrıyı ÇÖPE attı. (Bedava koruma!)")}
        >
          👤 Yabancı dışarıdan ulaşmaya çalışsın
        </button>
        <button
          className={btn}
          onClick={() => {
            setRows([]);
            setMsg("");
          }}
        >
          Sıfırla
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-zinc-500">
          <tr>
            <th>Santral defteri: dahili no</th>
            <th>Kimin?</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="py-1 text-zinc-500">
                (boş)
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.ext} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="py-1 font-mono">{r.ext}</td>
              <td>{r.who}</td>
              <td>
                <button
                  className="text-xs underline"
                  onClick={() =>
                    setMsg(`📨 Vercel cevap verdi: “85.132.44.10, dahili ${r.ext}’e”. Santral deftere baktı → ${r.who}’a teslim etti ✅`)
                  }
                >
                  cevap gelsin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {msg && <p className="rounded-lg bg-zinc-500/10 p-3 text-sm">{msg}</p>}
    </div>
  );
}

/* ───────────── 5. Plaza ofisleri (port) + refused vs timeout ───────────── */

const OFFICES = [
  { port: 443, name: "Web sitesi (HTTPS)", state: "open" as const },
  { port: 3000, name: "Senin Next.js dev sunucun", state: "open" as const },
  { port: 5432, name: "Veritabanı ofisi — bugün kimse gelmedi", state: "closed" as const },
  { port: 6379, name: "Kapıda güvenlik görevlisi var (firewall)", state: "filtered" as const },
];
type Office = (typeof OFFICES)[number];
const GIVE_UP_MS = 5000;

export function PlazaDoors() {
  const [target, setTarget] = useState<Office | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Office["state"] | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function knock(o: Office) {
    if (timer.current) clearInterval(timer.current);
    setTarget(o);
    setResult(null);
    setElapsed(0);
    let t = 0;
    const finishAt = o.state === "open" ? 150 : o.state === "closed" ? 250 : GIVE_UP_MS;
    timer.current = setInterval(() => {
      t += 50;
      setElapsed(Math.min(t, finishAt));
      if (t >= finishAt) {
        if (timer.current) clearInterval(timer.current);
        setResult(o.state);
      }
    }, 50);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        Plazanın adresi (IP): <span className="font-mono">10.0.0.5</span>. Hangi ofisin kapısını çalalım?
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {OFFICES.map((o) => (
          <button
            key={o.port}
            onClick={() => knock(o)}
            className="rounded-lg border border-zinc-300 p-2 text-left text-sm hover:border-emerald-500 dark:border-zinc-700"
          >
            <span className="font-mono font-semibold">Ofis {o.port}</span>
            <br />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">{o.name}</span>
          </button>
        ))}
      </div>
      {target && (
        <div className="space-y-2 rounded-lg bg-zinc-500/10 p-3 text-sm">
          <p>
            ✊ <span className="font-mono">10.0.0.5:{target.port}</span> kapısı çalınıyor…{" "}
            <span className="font-mono">{(elapsed / 1000).toFixed(1)} sn</span>
          </p>
          <div className="h-2 overflow-hidden rounded bg-zinc-500/20">
            <div className="h-full bg-amber-500" style={{ width: `${(elapsed / GIVE_UP_MS) * 100}%` }} />
          </div>
          {result === "open" && <p>✅ “Buyurun!” Biri kapıyı açtı → bağlantı kuruldu. (port <b>open</b>)</p>}
          {result === "closed" && (
            <p>
              🚫 Anında cevap: “Burada kimse yok!” — <b>hızlı ve net</b> bir RET. Bina var, ofis boş. (port <b>closed</b>) →
              curl’de: <span className="font-mono">Connection refused · exit 7</span>
            </p>
          )}
          {result === "filtered" && (
            <p>
              ⏳ Hiç ses yok… Görevli soruyu duymazdan geldi. Sen beklemekten vazgeçtin. Orada biri var mı yok mu{" "}
              <b>bilemiyorsun</b>. (port <b>filtered</b>) → curl’de:{" "}
              <span className="font-mono">Operation timed out · exit 28</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────── 6. Taahhütlü mektup vs canlı yayın (TCP vs UDP) ───────────── */

type Ev = { text: string; ok: boolean | null };

function buildEvents(mode: "tcp" | "udp", loss: boolean): Ev[] {
  const ev: Ev[] = [];
  if (mode === "tcp") ev.push({ text: "🤝 Önce el sıkışma: “Hazır mısın?” — “Hazırım.” — “Başlıyorum.”", ok: null });
  for (let i = 1; i <= 5; i++) {
    if (loss && i === 3) {
      ev.push({ text: `📦 Parça ${i} yolda kayboldu`, ok: false });
      if (mode === "tcp") {
        ev.push({ text: "📬 Alıcı: “3 numara gelmedi!” (imza atılmadı)", ok: null });
        ev.push({ text: `🔁 Parça ${i} TEKRAR gönderildi → ulaştı`, ok: true });
      }
    } else {
      ev.push({ text: `📦 Parça ${i} ulaştı${mode === "tcp" ? " — alıcı imzaladı ✍️" : ""}`, ok: true });
    }
  }
  ev.push(
    mode === "tcp"
      ? { text: "🏁 Sonuç: 5/5 parça, doğru sırada. Biraz daha yavaş ama EKSİKSİZ.", ok: true }
      : { text: loss ? "🏁 Sonuç: 4/5 parça. 3 kayboldu, kimse fark etmedi. Ama HIZLIYDI." : "🏁 Sonuç: 5/5, çok hızlı.", ok: !loss },
  );
  return ev;
}

export function Delivery() {
  const [mode, setMode] = useState<"tcp" | "udp">("tcp");
  const [loss, setLoss] = useState(true);
  const [events, setEvents] = useState<Ev[]>([]);
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function send() {
    if (timer.current) clearInterval(timer.current);
    const ev = buildEvents(mode, loss);
    setEvents(ev);
    setShown(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= ev.length && timer.current) clearInterval(timer.current);
    }, mode === "tcp" ? 650 : 300);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button className={mode === "tcp" ? btnMain : btn} onClick={() => setMode("tcp")}>
          ✉️ Taahhütlü mektup (TCP)
        </button>
        <button className={mode === "udp" ? btnMain : btn} onClick={() => setMode("udp")}>
          📻 Canlı yayın (UDP)
        </button>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={loss} onChange={(e) => setLoss(e.target.checked)} /> 📉 Yolda bir parça kaybolsun
        </label>
        <button className={btnMain} onClick={send}>
          ▶ Gönder
        </button>
      </div>
      {events.length > 0 && (
        <ol className="space-y-1 rounded-lg bg-zinc-500/10 p-3 text-sm">
          {events.slice(0, shown).map((e) => (
            <li
              key={e.text}
              className={e.ok === false ? "text-rose-600" : e.ok ? "text-emerald-700 dark:text-emerald-400" : ""}
            >
              {e.text}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
