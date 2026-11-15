/** Teknik sayfalardaki terminal/DevTools görev kartları (Gün 8+). */
export type Task = { title: string; cmd: string; expect: string; why: string };

export function TaskList({ items }: { items: Task[] }) {
  return (
    <ol className="space-y-3">
      {items.map((t, i) => (
        <li key={t.title} className="space-y-1 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
          <p className="font-semibold">
            {i + 1}. {t.title}
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-zinc-950 p-2 text-xs text-emerald-300">{t.cmd}</pre>
          <p className="text-xs">
            <b>Beklenen:</b> <code>{t.expect}</code>
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{t.why}</p>
        </li>
      ))}
    </ol>
  );
}
