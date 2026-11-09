import type { Metadata } from "next";
import Link from "next/link";
import { LESSONS } from "@/components/tutorial/lessons";

export const metadata: Metadata = { title: "Tutorial | RestoLab" };

export default function TutorialIndex() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <Link href="/" className="text-sm underline">
        ← Ana sayfa
      </Link>
      <h1 className="text-3xl font-bold">Tutorial</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Her gün bir ders. İstediğin zaman geri gel, animasyonları oynat, alıştırmaları tekrar yap.
      </p>
      <ol className="space-y-3">
        {LESSONS.map((l) => (
          <li key={l.day}>
            <Link
              href={`/tutorial/${l.day}`}
              className="block rounded-lg border border-zinc-300 p-4 hover:border-emerald-500 dark:border-zinc-700"
            >
              <p className="text-sm text-zinc-500">Gün {l.day}</p>
              <p className="font-semibold">{l.title}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{l.summary}</p>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
