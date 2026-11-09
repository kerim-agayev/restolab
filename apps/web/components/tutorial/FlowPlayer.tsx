"use client";

import { useEffect, useState } from "react";

export type FlowStep = { title: string; detail: string };

/**
 * Animasyonlu akış: kutular soldan sağa tek tek yanar.
 * "Oynat" otomatik ilerletir, "Sonraki/Önceki" elle gezdirir.
 */
export function FlowPlayer({ steps }: { steps: FlowStep[] }) {
  const [current, setCurrent] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const atEnd = current >= steps.length - 1;
  // Sona gelince ayrıca state değiştirmeye gerek yok: "oynuyor mu?" bilgisi hesaplanır.
  const isPlaying = playing && !atEnd;

  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => setCurrent((c) => c + 1), 1400);
    return () => clearTimeout(t);
  }, [isPlaying, current]);

  const play = () => {
    if (atEnd) setCurrent(-1);
    setPlaying(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-center gap-2">
            <button
              onClick={() => {
                setPlaying(false);
                setCurrent(i);
              }}
              className={`rounded-lg border px-3 py-2 text-sm transition-all duration-500 ${
                i === current
                  ? "scale-110 border-emerald-500 bg-emerald-500/20 font-semibold"
                  : i < current
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-zinc-300 opacity-60 dark:border-zinc-700"
              }`}
            >
              {i + 1}. {s.title}
            </button>
            {i < steps.length - 1 && (
              <span className={i < current ? "text-emerald-500" : "text-zinc-400"}>→</span>
            )}
          </div>
        ))}
      </div>

      <div className="min-h-16 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
        {current === -1 ? (
          <span className="text-zinc-500">▶ Oynat’a bas veya bir kutuya tıkla.</span>
        ) : (
          <>
            <b>{steps[current].title}:</b> {steps[current].detail}
          </>
        )}
      </div>

      <div className="flex gap-2 text-sm">
        <button onClick={play} className="rounded bg-emerald-600 px-3 py-1 text-white">
          ▶ Oynat
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setCurrent((c) => Math.max(-1, c - 1));
          }}
          className="rounded border px-3 py-1"
        >
          ← Önceki
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setCurrent((c) => Math.min(steps.length - 1, c + 1));
          }}
          className="rounded border px-3 py-1"
        >
          Sonraki →
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setCurrent(-1);
          }}
          className="rounded border px-3 py-1"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
