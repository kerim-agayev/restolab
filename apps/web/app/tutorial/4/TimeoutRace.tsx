"use client";

import { useEffect, useState } from "react";

/**
 * Gün 3 tekrarı: "Tarayıcı TIMEOUT dedi ama sunucu logunda 200 var" nasıl olur?
 * İki şerit yan yana koşar: tarayıcının sabrı (timeout) ve sunucunun çalışma süresi.
 */
export function TimeoutRace() {
  const [serverMs, setServerMs] = useState(5000);
  const [timeoutMs, setTimeoutMs] = useState(3000);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  const max = Math.max(serverMs, timeoutMs) + 500;
  const elapsed = startedAt === null ? null : Math.max(0, Math.min(now - startedAt, max));
  const running = elapsed !== null && elapsed < max;

  // Animasyon: her karede "şimdi"yi güncelle; geçen süre startedAt'ten hesaplanır.
  useEffect(() => {
    if (startedAt === null) return;
    let id = 0;
    const tick = (t: number) => {
      setNow(t);
      if (t - startedAt < max) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [startedAt, max]);

  const reset = () => setStartedAt(null);
  const e = elapsed ?? 0;
  const clientGaveUp = timeoutMs < serverMs;
  const serverDone = e >= serverMs;
  const clientDone = e >= Math.min(timeoutMs, serverMs);
  const pct = (ms: number) => `${Math.min(100, (ms / max) * 100)}%`;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <label className="space-y-1">
          <span className="block">🍳 Mutfak (sunucu) yemeği kaç saniyede hazırlar? <b>{serverMs / 1000} sn</b></span>
          <input type="range" min={500} max={8000} step={500} value={serverMs} onChange={(ev) => { setServerMs(Number(ev.target.value)); reset(); }} className="w-full" />
        </label>
        <label className="space-y-1">
          <span className="block">🧑‍🍳 Garson (tarayıcı) kaç saniye bekler? <b>{timeoutMs / 1000} sn</b></span>
          <input type="range" min={500} max={8000} step={500} value={timeoutMs} onChange={(ev) => { setTimeoutMs(Number(ev.target.value)); reset(); }} className="w-full" />
        </label>
      </div>

      <div className="space-y-3 rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">
        {/* Tarayıcı şeridi */}
        <div>
          <p className="mb-1 text-xs text-zinc-500">TARAYICI (garson) — sabır sınırı: {timeoutMs / 1000} sn</p>
          <div className="relative h-7 rounded bg-zinc-200 dark:bg-zinc-800">
            <div className="absolute inset-y-0 left-0 rounded bg-sky-500/60" style={{ width: pct(Math.min(e, Math.min(timeoutMs, serverMs))) }} />
            <div className="absolute inset-y-0 w-0.5 bg-red-500" style={{ left: pct(timeoutMs) }} title="timeout" />
            {clientDone && (
              <span className="absolute inset-y-0 left-2 flex items-center text-xs font-semibold">
                {clientGaveUp ? "❌ TIMEOUT — “olmadı” deyip gitti" : "✅ Cevabı aldı"}
              </span>
            )}
          </div>
        </div>
        {/* Sunucu şeridi */}
        <div>
          <p className="mb-1 text-xs text-zinc-500">SUNUCU (mutfak) — iş süresi: {serverMs / 1000} sn</p>
          <div className="relative h-7 rounded bg-zinc-200 dark:bg-zinc-800">
            <div className="absolute inset-y-0 left-0 rounded bg-emerald-500/60" style={{ width: pct(Math.min(e, serverMs)) }} />
            {serverDone && (
              <span className="absolute inset-y-0 left-2 flex items-center text-xs font-semibold">
                ✅ 200 OK — log: {"{"}status:200, durationMs:{serverMs}{"}"}
                {clientGaveUp && " → ama cevabı alacak kimse yok!"}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setStartedAt(performance.now())}
        disabled={running}
        className="rounded bg-emerald-600 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        ▶ Yarışı başlat
      </button>

      {elapsed !== null && elapsed >= max && (
        <p className={`rounded-lg border p-3 text-sm ${clientGaveUp ? "border-red-500 bg-red-500/10" : "border-emerald-500 bg-emerald-500/10"}`}>
          {clientGaveUp ? (
            <>
              <b>Sonuç:</b> Garson {timeoutMs / 1000}. saniyede vazgeçti (kullanıcı hata gördü), mutfak {serverMs / 1000}. saniyede yemeği
              yine de hazırladı (sunucu logunda <b>200</b>). İkisi de “doğru” söylüyor — sorun, beklenen süre ile gerçek sürenin
              uyuşmaması. Tehlike: garson tekrar basarsa <b>iki burger</b> yapılır (idempotency — Gün 28).
            </>
          ) : (
            <>
              <b>Sonuç:</b> Mutfak, garsonun sabrı bitmeden yetişti → kullanıcı cevabı gördü. Şimdi sunucuyu yavaşlat veya garsonun
              sabrını azalt ve tekrar dene.
            </>
          )}
        </p>
      )}
    </div>
  );
}
