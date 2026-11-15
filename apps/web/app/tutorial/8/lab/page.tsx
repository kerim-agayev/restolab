/**
 * Gün 8 lab: aynı bilgi (şu anki saat) üç farklı şekilde render ediliyor.
 *  1) 'use cache' + cacheLife → bir kez üretilir, önbellekte durur (SSG/ISR mantığı) → saat DONUK
 *  2) await connection() + <Suspense> → her istekte sunucuda üretilir (SSR) → her F5'te yeni
 *  3) Client Component + useEffect fetch → tarayıcıda, sayfa açıldıktan sonra (CSR)
 */
import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { Suspense } from "react";
import { ClientTime } from "./ClientTime";

export const metadata: Metadata = { title: "Gün 8 Lab — 3 render türü | RestoLab" };

async function CachedTime() {
  "use cache";
  cacheLife("hours");
  return <p className="font-mono text-lg">{new Date().toISOString()}</p>;
}

async function RequestTime() {
  await connection();
  return <p className="font-mono text-lg">{new Date().toISOString()}</p>;
}

function Box({ title, tag, children, note }: { title: string; tag: string; children: React.ReactNode; note: string }) {
  return (
    <div className="space-y-2 rounded-xl border border-zinc-300 p-4 dark:border-zinc-700">
      <p className="text-xs font-semibold uppercase text-emerald-600">{tag}</p>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
      <p className="text-xs text-zinc-600 dark:text-zinc-400">{note}</p>
    </div>
  );
}

export default function Day8Lab() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-8">
      <Link href="/tutorial/8" className="text-sm underline">
        ← Gün 8 dersine dön
      </Link>
      <h1 className="text-3xl font-bold">Lab: aynı saat, üç mutfak</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Üç kutu da “şu anki saati” gösteriyor. <b>F5</b> ile sayfayı birkaç kez yenile: hangisi değişiyor? Sonra <b>Ctrl+U</b> (sayfa
        kaynağı) aç ve üç saati HTML içinde ara.
      </p>

      <Box
        tag="🗂️ Önbellek (SSG/ISR mantığı)"
        title="Önceden hazırlanmış saat"
        note="'use cache' + cacheLife('hours'): bir kez üretildi, saatlerce aynı kalır. F5 değiştirmez. Menü kartı gibi."
      >
        <CachedTime />
      </Box>

      <Box
        tag="🍳 Sunucu, her istekte (SSR)"
        title="Sipariş üzerine hazırlanan saat"
        note="await connection(): her istekte sunucuda yeniden üretilir. F5 → yeni saat. Ama yine HTML’in içinde gelir."
      >
        <Suspense fallback={<p className="font-mono text-lg">⏳ mutfak hazırlıyor…</p>}>
          <RequestTime />
        </Suspense>
      </Box>

      <Box
        tag="🔥 Tarayıcı (CSR)"
        title="Masada pişen saat"
        note="Sayfa açıldıktan sonra tarayıcı istek atar. Sayfa kaynağında saat YOK, sadece ‘Yükleniyor…’ var. DevTools → Network’te ayrı bir fetch görürsün."
      >
        <ClientTime />
      </Box>

      <p className="text-sm">
        Bir de bilerek bozulmuş sayfa var:{" "}
        <Link href="/tutorial/8/hydration" className="underline">
          /tutorial/8/hydration → hydration hatası
        </Link>
      </p>
    </main>
  );
}
