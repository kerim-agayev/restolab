"use client";

import { useEffect, useState } from "react";

type Msg = {
  dir: "→" | "←" | "✖" | "⏱";
  label: string;
  detail: string;
  client: string;
  server: string;
};

function tcpSteps(loss: boolean): Msg[] {
  const s: Msg[] = [
    { dir: "→", label: "SYN  seq=100", detail: "“Merhaba, konuşabilir miyiz? Benim sıra numaram 100’den başlıyor.”", client: "SYN_SENT", server: "LISTEN" },
    { dir: "←", label: "SYN-ACK  seq=300 ack=101", detail: "“Olur! 100’ünü aldım (101’i bekliyorum). Benim numaram 300.”", client: "SYN_SENT", server: "SYN_RECEIVED" },
    { dir: "→", label: "ACK  ack=301", detail: "“Senin 300’ünü de aldım.” → El sıkışma bitti. Buna 3-way handshake denir.", client: "ESTABLISHED", server: "ESTABLISHED" },
  ];
  if (loss) {
    s.push(
      { dir: "✖", label: "DATA seq=101 “POST /api/orders …” (120 byte)", detail: "📉 Paket yolda KAYBOLDU (Wi‑Fi paraziti, yoğun router…). Sunucu hiçbir şey almadı.", client: "ESTABLISHED", server: "ESTABLISHED" },
      { dir: "⏱", label: "Retransmission timeout", detail: "Tarayıcının işletim sistemi ACK bekledi, gelmedi. TCP KENDİLİĞİNDEN fark etti — senin kodunun haberi bile yok.", client: "ESTABLISHED", server: "ESTABLISHED" },
      { dir: "→", label: "DATA seq=101 (TEKRAR GÖNDERİLDİ)", detail: "Aynı paket yeniden gönderildi. Kullanıcı sadece biraz gecikme hisseder.", client: "ESTABLISHED", server: "ESTABLISHED" },
    );
  } else {
    s.push({ dir: "→", label: "DATA seq=101 “POST /api/orders …” (120 byte)", detail: "Asıl HTTP isteği artık TCP bağlantısının içinde gidiyor.", client: "ESTABLISHED", server: "ESTABLISHED" });
  }
  s.push(
    { dir: "←", label: "ACK ack=221", detail: "“101’den 220’ye kadar hepsini aldım.” Sıra numaraları sayesinde hiçbir parça kaybolmaz, sırası karışmaz.", client: "ESTABLISHED", server: "ESTABLISHED" },
    { dir: "←", label: "DATA “HTTP/1.1 201 Created …”", detail: "Sunucunun cevabı da aynı bağlantıdan gelir.", client: "ESTABLISHED", server: "ESTABLISHED" },
    { dir: "→", label: "FIN", detail: "“İşim bitti, kapatıyorum.” (Keep-alive varsa bağlantı bir süre açık kalır — Gün 4 Timing’de DNS/connect 0 ms görmüştün!)", client: "FIN_WAIT", server: "CLOSE_WAIT" },
    { dir: "←", label: "FIN-ACK", detail: "“Tamam, ben de kapatıyorum.” Bağlantı kapandı.", client: "CLOSED", server: "CLOSED" },
  );
  return s;
}

function udpSteps(loss: boolean): Msg[] {
  return [
    { dir: "→", label: "DATAGRAM “restolab-kappa.vercel.app’in IP’si ne?”", detail: "UDP’de el sıkışma YOK. Direkt gönder ve unut. (DNS böyle çalışır — Gün 6.)", client: "—", server: "—" },
    loss
      ? { dir: "✖", label: "Cevap DATAGRAM KAYBOLDU", detail: "📉 Kayboldu ve UDP bunu FARK ETMEZ. Kimse tekrar göndermez. Uygulama isterse kendisi tekrar sorar (DNS istemcisi ~1 sn sonra tekrar dener). Görüntülü aramada bu, ekranın bir an donmasıdır.", client: "—", server: "—" }
      : { dir: "←", label: "DATAGRAM “76.76.21.21”", detail: "Cevap geldi. Toplam 2 mesaj — TCP’de en az 7 mesaj gerekirdi. UDP HIZLIDIR ama GARANTİ VERMEZ.", client: "—", server: "—" },
  ];
}

const DIR_STYLE: Record<Msg["dir"], string> = {
  "→": "text-sky-500",
  "←": "text-emerald-500",
  "✖": "text-red-500",
  "⏱": "text-amber-500",
};

export function TcpHandshake() {
  const [proto, setProto] = useState<"tcp" | "udp">("tcp");
  const [loss, setLoss] = useState(false);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const steps = proto === "tcp" ? tcpSteps(loss) : udpSteps(loss);
  const done = shown >= steps.length;
  const isPlaying = playing && !done;

  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => setShown((n) => n + 1), 1300);
    return () => clearTimeout(t);
  }, [isPlaying, shown]);

  const reset = () => {
    setShown(0);
    setPlaying(false);
  };
  const last = steps[Math.max(0, Math.min(shown, steps.length) - 1)];

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        {(["tcp", "udp"] as const).map((p) => (
          <button key={p} onClick={() => { setProto(p); reset(); }} className={`rounded px-3 py-1 ${proto === p ? "bg-sky-600 text-white" : "border"}`}>
            {p.toUpperCase()}
          </button>
        ))}
        <label className="flex items-center gap-1 rounded border border-red-500/50 px-2 py-1">
          <input type="checkbox" checked={loss} onChange={(e) => { setLoss(e.target.checked); reset(); }} /> 📉 Paket kaybı
        </label>
        <button onClick={() => { if (done) setShown(0); setPlaying(true); }} className="rounded bg-emerald-600 px-3 py-1 text-white">▶ Oynat</button>
        <button onClick={() => setShown((n) => Math.min(steps.length, n + 1))} className="rounded border px-3 py-1">Sonraki</button>
        <button onClick={reset} className="rounded border px-3 py-1">Sıfırla</button>
      </div>

      <div className="rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">
        <div className="mb-2 grid grid-cols-[1fr_2fr_1fr] text-center text-xs font-semibold">
          <span>💻 Tarayıcı<br /><span className="font-mono font-normal text-sky-500">{shown ? last.client : "CLOSED"}</span></span>
          <span />
          <span>🖥️ Sunucu :443<br /><span className="font-mono font-normal text-emerald-500">{shown ? last.server : "LISTEN"}</span></span>
        </div>
        <div className="space-y-1">
          {steps.slice(0, shown).map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_1fr] items-center font-mono text-xs">
              <span className="border-r-2 border-zinc-400 pr-2 text-right">{m.dir === "⏱" ? "⏱" : ""}</span>
              <span className={`px-2 text-center ${DIR_STYLE[m.dir]}`}>
                {m.dir === "→" && `${m.label} ──────▶`}
                {m.dir === "←" && `◀────── ${m.label}`}
                {m.dir === "✖" && `${m.label} ──✖`}
                {m.dir === "⏱" && m.label}
              </span>
              <span className="border-l-2 border-zinc-400" />
            </div>
          ))}
          {shown === 0 && <p className="text-center text-xs text-zinc-500">▶ Oynat’a bas.</p>}
        </div>
      </div>

      {shown > 0 && <p className="rounded-lg bg-amber-500/10 p-3">{last.detail}</p>}

      <div className="grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded border border-sky-500/50 p-2">
          <b>TCP</b> = imzalı kargo. Bağlantı kurar, her parçayı numaralar, kaybolanı tekrar gönderir, sırayı korur. Yavaş ama güvenilir.
          <br /><b>Kim kullanır:</b> HTTP/1.1–2, SSH, veritabanları (Postgres, MSSQL), Kafka.
        </div>
        <div className="rounded border border-violet-500/50 p-2">
          <b>UDP</b> = “at ve unut” kartpostal. Bağlantı yok, garanti yok, ama çok hızlı.
          <br /><b>Kim kullanır:</b> DNS, görüntülü arama, online oyun, HTTP/3 (QUIC — UDP üstüne kendi garantisini kurar).
        </div>
      </div>
    </div>
  );
}
