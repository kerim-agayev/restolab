import Link from "next/link";
import type { ReactNode } from "react";
import { LESSONS } from "./lessons";

/** Her ders sayfasının ortak iskeleti: başlık, önceki/sonraki gün linkleri. */
export function TutorialShell({ day, children }: { day: number; children: ReactNode }) {
  const lesson = LESSONS.find((l) => l.day === day);
  const prev = LESSONS.find((l) => l.day === day - 1);
  const next = LESSONS.find((l) => l.day === day + 1);

  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial" className="text-sm underline">
          ← Tüm dersler
        </Link>
        <p className="text-sm text-zinc-500">Gün {day}</p>
        <h1 className="text-3xl font-bold">{lesson?.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{lesson?.summary}</p>
      </header>

      {children}

      <nav className="flex justify-between border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        {prev ? <Link href={`/tutorial/${prev.day}`}>← Gün {prev.day}: {prev.title}</Link> : <span />}
        {next ? <Link href={`/tutorial/${next.day}`}>Gün {next.day}: {next.title} →</Link> : <span />}
      </nav>
    </main>
  );
}

/** Ders içindeki numaralı bölüm. */
export function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">
        {n}. {title}
      </h2>
      {children}
    </section>
  );
}

/** Restoran benzetmesi / şirket köprüsü gibi vurgulu notlar. */
export function Note({ icon = "💡", children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
      <span>{icon}</span>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
