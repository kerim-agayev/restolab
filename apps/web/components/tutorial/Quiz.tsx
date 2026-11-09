"use client";

import { useState } from "react";

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

function Question({ item, n }: { item: QuizQuestion; n: number }) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <p className="font-medium">
        {n}. {item.q}
      </p>
      <div className="grid gap-2">
        {item.options.map((opt, i) => {
          const isAnswer = i === item.answer;
          const color =
            picked === null
              ? "border-zinc-300 hover:border-zinc-500 dark:border-zinc-700"
              : isAnswer
                ? "border-emerald-500 bg-emerald-500/15"
                : i === picked
                  ? "border-red-500 bg-red-500/15"
                  : "border-zinc-300 opacity-60 dark:border-zinc-700";
          return (
            <button
              key={opt}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${color}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="text-sm">
          {picked === item.answer ? "✅ Doğru! " : "❌ Yanlış. "}
          <span className="text-zinc-600 dark:text-zinc-400">{item.explain}</span>{" "}
          <button onClick={() => setPicked(null)} className="underline">
            Tekrar dene
          </button>
        </p>
      )}
    </div>
  );
}

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <Question key={q.q} item={q} n={i + 1} />
      ))}
    </div>
  );
}
