"use client";

import { useState } from "react";

const views = {
  before: {
    label: "Başlangıç",
    graph: `main:     A ── B ── C          (arkadaşın C'yi merge etti)
                \\
senin:           D ── E        (sen D ve E commit'lerini attın)`,
    text: "Sen branch'i B'den açtın. Sen çalışırken main'e C eklendi. Şimdi senin branch'in main'in gerisinde.",
  },
  merge: {
    label: "git merge main",
    graph: `main:     A ── B ── C
                \\        \\
senin:           D ── E ── M   (M = merge commit)`,
    text: "Merge: main'i kendi branch'ine katar ve bir 'merge commit' (M) oluşturur. Geçmiş olduğu gibi kalır, ama grafik dallı-budaklı görünür. Güvenli, yeni başlayanlar için önerilen yol.",
  },
  rebase: {
    label: "git rebase main",
    graph: `main:     A ── B ── C
                          \\
senin:                     D' ── E'   (commit'lerin C'nin ÜSTÜNE taşındı)`,
    text: "Rebase: senin commit'lerini alıp main'in en ucuna yeniden yazar (D → D'). Geçmiş tek düz çizgi olur, temiz görünür. AMA commit'ler yeniden yazıldığı için push'ta --force gerekir. Paylaşılan branch'te tehlikeli!",
  },
} as const;

type Key = keyof typeof views;

export function MergeVsRebase() {
  const [k, setK] = useState<Key>("before");
  return (
    <div className="space-y-3">
      <div className="flex gap-2 text-sm">
        {(Object.keys(views) as Key[]).map((key) => (
          <button
            key={key}
            onClick={() => setK(key)}
            className={`rounded border px-3 py-1 ${k === key ? "border-emerald-500 bg-emerald-500/15 font-semibold" : ""}`}
          >
            {views[key].label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100">{views[k].graph}</pre>
      <p className="text-sm">{views[k].text}</p>
    </div>
  );
}
