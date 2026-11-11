"use client";

/**
 * Feynman tekniği bileşenleri — "ezberleme, anla" dersleri için.
 * Döngü: 1) Hikâye (sade dil + benzetme) → 2) Dokun (mini simülasyon) → 3) Tahmin et → 4) Sen anlat (teach-back)
 *        → 5) Ancak şimdi teknik adı (TermCard). Kavram önce, isim sonra.
 */
import { Children, useState, type ReactNode } from "react";

/** Bir bölüm: büyük bir soru ile başlar, içindeki adımlar tek tek açılır. */
export function Chapter({
  n,
  title,
  question,
  children,
}: {
  n: number;
  title: string;
  question: string;
  children: ReactNode;
}) {
  return (
    <section id={`b${n}`} className="scroll-mt-4 space-y-4 rounded-2xl border border-zinc-300 p-4 sm:p-6 dark:border-zinc-700">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Bölüm {n}</p>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">❓ {question}</p>
      </header>
      <Reveal>{children}</Reveal>
    </section>
  );
}

/** Çocukları teker teker gösterir: bir seferde tek adım. */
export function Reveal({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const [count, setCount] = useState(1);
  return (
    <div className="space-y-4">
      {items.slice(0, count)}
      {count < items.length && (
        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-full rounded-lg border-2 border-dashed border-emerald-500/60 p-3 font-medium text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
        >
          Devam ↓ <span className="text-xs text-zinc-500">({count}/{items.length})</span>
        </button>
      )}
    </div>
  );
}

/** 1. adım — sade hikâye. */
export function Story({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-2 rounded-xl bg-sky-500/10 p-4 leading-relaxed">
      <p className="text-xs font-semibold uppercase text-sky-700 dark:text-sky-400">🧒 Basitçe</p>
      {children}
    </div>
  );
}

/** Ekonomi geçmişine köprü. */
export function Econ({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-1 rounded-xl border border-violet-500/40 bg-violet-500/10 p-4 text-sm leading-relaxed">
      <p className="text-xs font-semibold uppercase text-violet-700 dark:text-violet-400">💼 Ekonomiden bildiğin</p>
      {children}
    </div>
  );
}

/** Dokun: interaktif kutunun çerçevesi. */
export function Try({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-300 p-4 dark:border-zinc-700">
      <p className="text-xs font-semibold uppercase text-zinc-500">🎮 Dokun: {title}</p>
      {children}
    </div>
  );
}

export type PredictOption = { label: string; right?: boolean };

/** Tahmin et → sonra gör. Yanlış tahmin cezalandırılmaz: beynin "aa, neden?" demesi öğrenmenin ta kendisi. */
export function Predict({
  question,
  options,
  reveal,
}: {
  question: string;
  options: PredictOption[];
  reveal: ReactNode;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const right = picked !== null && options[picked].right;
  return (
    <div className="space-y-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
      <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-400">🔮 Önce tahmin et</p>
      <p className="font-medium">{question}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => (
          <button
            key={o.label}
            disabled={picked !== null}
            onClick={() => setPicked(i)}
            className={`rounded-lg border p-2 text-left text-sm ${
              picked === i
                ? o.right
                  ? "border-emerald-500 bg-emerald-500/20"
                  : "border-amber-600 bg-amber-600/20"
                : "border-zinc-300 hover:border-amber-500 dark:border-zinc-700"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="space-y-2 text-sm leading-relaxed">
          <p className="font-semibold">
            {right ? "✅ Doğru tahmin!" : "🤔 Güzel tahmin — ama olan şu (yanlış tahmin = beynin şu an öğreniyor):"}
          </p>
          {reveal}
        </div>
      )}
    </div>
  );
}

/**
 * Feynman'ın kalbi: kendi cümlenle anlat. Anlatamadığın yer = henüz anlamadığın yer.
 * Yazdıktan sonra "benim anlatımım" ve kontrol listesi açılır; kendini puanlarsın.
 */
export function TeachBack({
  prompt,
  hints,
  model,
  checklist,
}: {
  prompt: string;
  hints: string[];
  model: ReactNode;
  checklist: string[];
}) {
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(() => checklist.map(() => false));
  const [copied, setCopied] = useState(false);
  const score = checked.filter(Boolean).length;
  const ready = text.trim().length >= 30;

  return (
    <div className="space-y-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4">
      <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">🗣️ Sen anlat (en önemli adım)</p>
      <p className="font-medium">{prompt}</p>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Teknik kelime kullanmak zorunda değilsin. 12 yaşındaki bir yeğene anlatır gibi yaz. Kullanabileceğin kelimeler:{" "}
        {hints.map((h) => (
          <span key={h} className="mr-1 inline-block rounded bg-zinc-500/15 px-1.5 py-0.5">
            {h}
          </span>
        ))}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Kendi cümlelerinle…"
        className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <div className="flex flex-wrap gap-2">
        <button
          disabled={!ready}
          onClick={() => setShown(true)}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {ready ? "Benim anlatımımla karşılaştır" : `Biraz daha yaz (${text.trim().length}/30)`}
        </button>
        {ready && (
          <button
            onClick={() => {
              navigator.clipboard?.writeText(`Feynman — ${prompt}\n\n${text}`).then(
                () => setCopied(true),
                () => setCopied(false),
              );
            }}
            className="rounded-lg border border-zinc-400 px-3 py-1.5 text-sm"
          >
            {copied ? "Kopyalandı ✓ — Claude Code’a yapıştır" : "📋 Kopyala (Claude’a göster, eksiğini söylesin)"}
          </button>
        )}
      </div>
      {shown && (
        <div className="space-y-3">
          <div className="rounded-lg bg-white/70 p-3 text-sm leading-relaxed dark:bg-zinc-900/70">
            <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">Benim anlatımım</p>
            {model}
          </div>
          <p className="text-sm font-medium">Senin metninde bu fikirler var mı? (kelimeler değil, fikir önemli)</p>
          <ul className="space-y-1 text-sm">
            {checklist.map((c, i) => (
              <li key={c}>
                <label className="flex cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => setChecked((arr) => arr.map((v, j) => (j === i ? !v : v)))}
                  />
                  {c}
                </label>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            {score === checklist.length
              ? "🎉 Tamamını yakaladın. Bu konuyu artık biliyorsun — ezberlemeden."
              : `${score}/${checklist.length}. İşaretlemediğin fikir = boşluk. Hikâyeye geri dön, sadece o kısmı tekrar oku, sonra tekrar yaz. Feynman’ın 3. adımı tam olarak bu.`}
          </p>
        </div>
      )}
    </div>
  );
}

export type Term = { term: string; plain: string; heard: string };

/** En son: teknik isim. "Şirkette bunu şöyle duyarsın." */
export function TermCard({ terms }: { terms: Term[] }) {
  return (
    <div className="space-y-2 rounded-xl border border-zinc-300 p-4 dark:border-zinc-700">
      <p className="text-xs font-semibold uppercase text-zinc-500">🏷️ Şimdi adını koyalım (fikri zaten biliyorsun)</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-zinc-500">
            <tr>
              <th className="py-1 pr-3">Teknik adı</th>
              <th className="py-1 pr-3">Aslında ne?</th>
              <th className="py-1">Şirkette nasıl duyarsın</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((t) => (
              <tr key={t.term} className="border-t border-zinc-200 align-top dark:border-zinc-800">
                <td className="py-1.5 pr-3 font-mono font-semibold">{t.term}</td>
                <td className="py-1.5 pr-3">{t.plain}</td>
                <td className="py-1.5 italic text-zinc-600 dark:text-zinc-400">“{t.heard}”</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** İsteğe bağlı derinlik: kapalı gelir. */
export function Deeper({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rounded-xl border border-zinc-300 p-3 dark:border-zinc-700">
      <summary className="cursor-pointer text-sm font-medium">🔬 {title} (isteğe bağlı — atlayabilirsin)</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}
