"use client";

/** Gün 10: para (float tuzağı, qəpik, hesap bölme, ƏDV yuvarlama) ve zaman (UTC vs Bakı, Z raporu günü). */
import { useState } from "react";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";
const input = "w-24 rounded border border-zinc-400 bg-white p-1 text-sm dark:bg-zinc-900";

/** qəpik → "12.34" (Intl yok: sunucu ve tarayıcı aynı metni üretsin diye) */
const fmt = (q: number) => `${q < 0 ? "-" : ""}${Math.floor(Math.abs(q) / 100)}.${String(Math.abs(q) % 100).padStart(2, "0")}`;

/* ───────────── 1. Float tuzağı: 1000 çay ───────────── */

export function FloatTrap() {
  const [count, setCount] = useState(0);
  const [ran, setRan] = useState(false);

  let floatSum = 0;
  let intSum = 0;
  for (let i = 0; i < count; i++) {
    floatSum += 0.1; // AZN, float
    intSum += 10; // qəpik, tam sayı
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        Kasa gün boyu <b>0.10 AZN</b>’lik çay satıyor. Toplamı iki kasiyer tutuyor: biri <b>AZN’i ondalıklı sayı</b> (float) olarak, diğeri{" "}
        <b>qəpik’i tam sayı</b> olarak topluyor.
      </p>
      <div className="flex flex-wrap gap-2">
        {[3, 10, 1000].map((n) => (
          <button
            key={n}
            className={count === n ? btnMain : btn}
            onClick={() => {
              setCount(n);
              setRan(true);
            }}
          >
            {n} çay sat
          </button>
        ))}
      </div>
      {ran && (
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className={`rounded-lg p-3 ${floatSum === intSum / 100 ? "bg-zinc-500/10" : "bg-rose-500/15"}`}>
            <p className="font-semibold">🧮 Float kasiyer (AZN)</p>
            <p className="font-mono">{floatSum.toString()}</p>
          </div>
          <div className="rounded-lg bg-emerald-500/15 p-3">
            <p className="font-semibold">🪙 Qəpik kasiyer (tam sayı)</p>
            <p className="font-mono">
              {intSum} qəpik = {fmt(intSum)} AZN
            </p>
          </div>
        </div>
      )}
      {count === 3 && <p className="text-xs">3 çay: float “0.30000000000000004” diyor. Ekranda 0.30 görünse bile içeride küsurat var.</p>}
      {count === 1000 && <p className="text-xs">1000 çay: float 100 AZN’e bile ulaşamadı. Küçük hatalar toplandıkça büyüdü. Gün sonu Z raporu tutmaz.</p>}
    </div>
  );
}

/* ───────────── 2. Hesabı bölmek: kayıp qəpik ───────────── */

function splitNaive(total: number, n: number) {
  const each = Math.round(total / n);
  return Array.from({ length: n }, () => each);
}
function splitFair(total: number, n: number) {
  const base = Math.floor(total / n);
  const rest = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < rest ? 1 : 0));
}

export function BillSplit() {
  const [total, setTotal] = useState(10000);
  const [n, setN] = useState(3);
  const naive = splitNaive(total, n);
  const fair = splitFair(total, n);
  const naiveSum = naive.reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1">
          Hesap (AZN):
          <input
            type="number"
            step="0.01"
            min="0.01"
            className={input}
            value={total / 100}
            onChange={(e) => setTotal(Math.max(1, Math.round(Number(e.target.value) * 100) || 1))}
          />
        </label>
        <label className="flex items-center gap-1">
          Kişi:
          <input type="number" min="1" max="12" className={input} value={n} onChange={(e) => setN(Math.min(12, Math.max(1, Number(e.target.value) || 1)))} />
        </label>
      </div>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className={`rounded-lg p-3 ${naiveSum === total ? "bg-zinc-500/10" : "bg-rose-500/15"}`}>
          <p className="font-semibold">Saf yöntem: herkese “yuvarlanmış pay”</p>
          <p className="font-mono text-xs">{naive.map(fmt).join(" + ")}</p>
          <p>
            Toplam: <b className="font-mono">{fmt(naiveSum)}</b>{" "}
            {naiveSum !== total && <span>→ {naiveSum < total ? "kasada eksik" : "müşteriden fazla"} {fmt(Math.abs(total - naiveSum))} AZN</span>}
          </p>
        </div>
        <div className="rounded-lg bg-emerald-500/15 p-3">
          <p className="font-semibold">Doğru yöntem: artan qəpikleri dağıt</p>
          <p className="font-mono text-xs">{fair.map(fmt).join(" + ")}</p>
          <p>
            Toplam: <b className="font-mono">{fmt(fair.reduce((a, b) => a + b, 0))}</b> ✅
          </p>
        </div>
      </div>
      <p className="text-xs text-zinc-500">Dene: 100 AZN / 3 kişi, 10 AZN / 6 kişi, 0.05 AZN / 2 kişi.</p>
    </div>
  );
}

/* ───────────── 3. ƏDV: satır satır mı, toplamda mı yuvarlamak? ───────────── */

const ITEMS = [
  { name: "Çay", q: 125 },
  { name: "Mineral su", q: 125 },
  { name: "Ayran", q: 125 },
];
const VAT = 18; // Azərbaycan ƏDV dərəcəsi %

export function VatRounding() {
  const [show, setShow] = useState(false);
  const perLine = ITEMS.map((i) => ({ ...i, vat: Math.round((i.q * VAT) / 100) }));
  const sumPerLine = perLine.reduce((a, b) => a + b.vat, 0);
  const subtotal = ITEMS.reduce((a, b) => a + b.q, 0);
  const onTotal = Math.round((subtotal * VAT) / 100);
  return (
    <div className="space-y-3">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-zinc-500">
          <tr>
            <th>Kalem</th>
            <th>Fiyat</th>
            <th>ƏDV %18 (tam)</th>
            <th>Satırda yuvarlanmış</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {perLine.map((i) => (
            <tr key={i.name} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="font-sans">{i.name}</td>
              <td>{fmt(i.q)}</td>
              <td>{((i.q * VAT) / 10000).toFixed(4)}</td>
              <td>{fmt(i.vat)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={btnMain} onClick={() => setShow(true)}>
        İki yöntemi karşılaştır
      </button>
      {show && (
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p className="rounded-lg bg-zinc-500/10 p-3">
            A) Her satırı yuvarla, sonra topla: <b className="font-mono">{fmt(sumPerLine)}</b> AZN
          </p>
          <p className="rounded-lg bg-zinc-500/10 p-3">
            B) Önce topla ({fmt(subtotal)}), sonra yuvarla: <b className="font-mono">{fmt(onTotal)}</b> AZN
          </p>
          <p className="rounded-lg bg-amber-500/15 p-3 sm:col-span-2">
            {sumPerLine === onTotal
              ? "Bu sefer aynı çıktı. Ama kalem sayısı arttıkça fark çıkar."
              : `Fark: ${fmt(Math.abs(sumPerLine - onTotal))} AZN. Hangisi “doğru”? İkisi de olabilir: önemli olan şirketin BİR kural seçmesi ve fiş, rapor, muhasebe, vergi bildiriminde HEP aynısını uygulaması. Yoksa raporlar birbirini tutmaz.`}
          </p>
        </div>
      )}
    </div>
  );
}

/* ───────────── 4. Zaman: UTC vs Bakı, Z raporu hangi güne? ───────────── */

const BAKU_OFFSET_H = 4; // Asia/Baku = UTC+4 (yaz saati uygulaması yok)

export function MidnightShift() {
  // UTC 2026-11-15 18:00 → 2026-11-16 02:00 arası, 30 dk adımlarla
  const [step, setStep] = useState(7);
  const utcMs = Date.UTC(2026, 10, 15, 18, 0) + step * 30 * 60 * 1000;
  const utcIso = new Date(utcMs).toISOString();
  const bakuIso = new Date(utcMs + BAKU_OFFSET_H * 3600 * 1000).toISOString();
  const utcDay = utcIso.slice(0, 10);
  const bakuDay = bakuIso.slice(0, 10);
  const bakuHour = Number(bakuIso.slice(11, 13));
  const businessDay = bakuHour < 5 ? new Date(utcMs + (BAKU_OFFSET_H - 24) * 3600 * 1000).toISOString().slice(0, 10) : bakuDay;

  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm">
        <span>Sipariş anı (kaydır):</span>
        <input type="range" min={0} max={16} value={step} onChange={(e) => setStep(Number(e.target.value))} className="w-full" />
      </label>
      <div className="grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-500/10 p-3">
          <p className="text-xs text-zinc-500">🖥️ Sunucu/DB (UTC)</p>
          <p className="font-mono">{utcIso.slice(0, 16).replace("T", " ")}</p>
          <p className="text-xs">Saf rapor bunu “{utcDay}” günü sayar</p>
        </div>
        <div className="rounded-lg bg-sky-500/10 p-3">
          <p className="text-xs text-zinc-500">🍽️ Restoranın duvar saati (Bakı)</p>
          <p className="font-mono">{bakuIso.slice(0, 16).replace("T", " ")}</p>
          <p className="text-xs">Takvim günü: {bakuDay}</p>
        </div>
        <div className="rounded-lg bg-emerald-500/10 p-3">
          <p className="text-xs text-zinc-500">📊 İş günü (gece 05:00’e kadar önceki gün)</p>
          <p className="font-mono">{businessDay}</p>
          <p className="text-xs">Z raporu bu güne yazılmalı</p>
        </div>
      </div>
      {utcDay !== businessDay || bakuDay !== businessDay ? (
        <p className="rounded-lg bg-rose-500/15 p-3 text-sm">
          💥 Aynı sipariş için üç farklı “gün” cevabı var: UTC {utcDay}, Bakı takvimi {bakuDay}, iş günü {businessDay}. Rapor hangisini
          kullandığını açıkça seçmezse bu sipariş YANLIŞ günün cirosuna yazılır. (Bakı saatiyle gece yarısından sonraki saatler riskli bölge.)
        </p>
      ) : (
        <p className="rounded-lg bg-emerald-500/10 p-3 text-sm">✅ Bu saatte üç “gün” aynı. Kaydırıcıyı gece yarısına doğru it.</p>
      )}
    </div>
  );
}
