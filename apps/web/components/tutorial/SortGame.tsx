"use client";

import { useId, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/** Doğru sıradan farklı ama her yüklemede aynı (deterministik) bir karışık sıra üretir. */
function scramble(items: string[]): string[] {
  const odd = items.filter((_, i) => i % 2 === 1);
  const even = items.filter((_, i) => i % 2 === 0).reverse();
  return [...odd, ...even];
}

function SortableRow({
  id,
  index,
  state,
  onMove,
}: {
  id: string;
  index: number;
  state: "idle" | "ok" | "wrong";
  onMove: (dir: -1 | 1) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const color =
    state === "ok"
      ? "border-emerald-500 bg-emerald-500/15"
      : state === "wrong"
        ? "border-red-500 bg-red-500/15"
        : "border-zinc-300 dark:border-zinc-700";

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${color} ${
        isDragging ? "z-10 shadow-lg" : ""
      }`}
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none select-none px-1 text-zinc-400"
        aria-label="Sürükle"
      >
        ⠿
      </span>
      <span className="w-5 text-zinc-500">{index + 1}.</span>
      <span className="flex-1">{id}</span>
      <button onClick={() => onMove(-1)} className="px-1 text-zinc-500" aria-label="Yukarı">
        ▲
      </button>
      <button onClick={() => onMove(1)} className="px-1 text-zinc-500" aria-label="Aşağı">
        ▼
      </button>
    </li>
  );
}

/**
 * Sürükle-bırak sıralama oyunu. `items` DOĞRU sırada verilir; oyuncuya karışık gösterilir.
 * Telefonda sürüklemek zor olursa ▲▼ butonları da çalışır.
 */
export function SortGame({ items, hint }: { items: string[]; hint?: string }) {
  const dndId = useId();
  const [order, setOrder] = useState(() => scramble(items));
  const [checked, setChecked] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setChecked(false);
    setOrder((o) => arrayMove(o, o.indexOf(String(active.id)), o.indexOf(String(over.id))));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    setChecked(false);
    setOrder((o) => arrayMove(o, i, j));
  };

  const correctCount = order.filter((v, i) => v === items[i]).length;
  const allCorrect = correctCount === items.length;

  return (
    <div className="space-y-3">
      {hint && <p className="text-sm text-zinc-500">{hint}</p>}
      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2">
            {order.map((id, i) => (
              <SortableRow
                key={id}
                id={id}
                index={i}
                state={!checked ? "idle" : id === items[i] ? "ok" : "wrong"}
                onMove={(dir) => move(i, dir)}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => setChecked(true)} className="rounded bg-emerald-600 px-3 py-1 text-white">
          Kontrol et
        </button>
        <button
          onClick={() => {
            setOrder(scramble(items));
            setChecked(false);
          }}
          className="rounded border px-3 py-1"
        >
          Karıştır
        </button>
        {checked &&
          (allCorrect ? (
            <span className="font-semibold text-emerald-600">🎉 Hepsi doğru!</span>
          ) : (
            <span className="text-red-600">
              {correctCount}/{items.length} doğru yerde. Kırmızıları düzelt.
            </span>
          ))}
      </div>
    </div>
  );
}
