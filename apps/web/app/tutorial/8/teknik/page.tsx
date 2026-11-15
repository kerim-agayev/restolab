import type { Metadata } from "next";
import Link from "next/link";
import { TaskList, type Task } from "@/components/tutorial/TaskList";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 8 (Teknik) — Render türlerini ölç | RestoLab" };

const tasks: Task[] = [
  {
    title: "F5 testi",
    cmd: "Tarayıcıda /tutorial/8/lab aç → F5 ile 3 kez yenile",
    expect: "Önbellek kutusu: aynı saat · Sunucu kutusu: her seferinde yeni · Tarayıcı kutusu: önce ‘Yükleniyor…’, sonra yeni saat",
    why: "Üç mutfağı gözle ayırt etmenin en hızlı yolu.",
  },
  {
    title: "Sayfa kaynağı (HTML’de ne var?)",
    cmd: "Lab sayfasında Ctrl+U → Ctrl+F ile “Yükleniyor” ve “T1” (saatin bir parçası, ör. 2026-11-15T1) ara",
    expect: "İlk iki saat HTML içinde · CSR kutusunda saat yok, “Yükleniyor…” var",
    why: "‘Google ne görür?’ sorusunun cevabı: HTML’de olan. CSR içeriği HTML’de yoktur.",
  },
  {
    title: "Aynısını curl ile (JavaScript çalıştırmayan bir ‘tarayıcı’)",
    cmd: "curl.exe -s https://restolab-kappa.vercel.app/tutorial/8/lab | findstr /c:\"Yükleniyor\"",
    expect: "Eşleşen satır bulunur (CSR kutusunun boş hâli HTML’de)",
    why: "curl JavaScript çalıştırmaz: CSR içeriği hiç gelmez. Arama motoru botlarının bir kısmı da böyle görür. (Merge’den sonra canlı adreste.)",
  },
  {
    title: "JavaScript’i kapatıp sayfaya bak",
    cmd: "F12 → Ctrl+Shift+P → “Disable JavaScript” yaz → Enter → F5",
    expect: "Lab’da ilk iki saat görünür, CSR kutusu sonsuza dek ‘Yükleniyor…’ · Gün 8 dersinde butonlar çalışmaz",
    why: "Server tarafında hazırlanan her şey JS olmadan da görünür. Bitince aynı yerden “Enable JavaScript”.",
  },
  {
    title: "CSR isteğini Network’te yakala",
    cmd: "F12 → Network → Fetch/XHR → lab sayfasında F5",
    expect: "cache?k=day8-csr&ttl=0 isteği (Initiator: ClientTime)",
    why: "Gün 4’teki Initiator sekmesi: isteği hangi bileşen attı?",
  },
  {
    title: "Build çıktısındaki işaretleri oku",
    cmd: "pnpm --filter web build",
    expect: "○ (Static) /tutorial/8 · ◐ (Partial Prerender) /tutorial/8/lab · ƒ (Dynamic) /api/…",
    why: "○ = tamamen önceden basılmış · ◐ = iskeleti önceden, dinamik parça istekte (Suspense) · ƒ = her istekte. Claude Code “bu route dinamik oldu” derse buraya bak.",
  },
];

const breakTasks: Task[] = [
  {
    title: "Hydration hatasını oku",
    cmd: "/tutorial/8/hydration aç → F12 → Console → F5",
    expect: "Minified React error #418 (production) · local’de: Hydration failed because the server rendered text didn’t match the client",
    why: "Hata kodunu (#418) arama motorunda arat: React’in sitesi tam açıklamayı verir. Developer’lar da tam böyle yapar.",
  },
  {
    title: "Local’de uzun hata mesajını gör (isteğe bağlı)",
    cmd: "pnpm --filter web dev  →  http://localhost:3000/tutorial/8/hydration",
    expect: "Ekranda Next.js hata kutusu: hangi metin sunucuda, hangisi tarayıcıda — farkı yan yana gösterir",
    why: "Development modu hataları açıklamalı gösterir, production kısaltır (daha küçük paket). Bitince Ctrl+C.",
  },
];

export default function Day8Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/8" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 8 · Teknik</p>
        <h1 className="text-3xl font-bold">Render türlerini tarayıcı, DevTools ve curl ile ölç</h1>
      </header>
      <Section n={1} title="Görevler">
        <TaskList items={tasks} />
      </Section>
      <Section n={2} title="Kır ve oku">
        <TaskList items={breakTasks} />
      </Section>
      <Section n={3} title="Kodda nasıl görünür?">
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-emerald-300">{`// 1) Önbellek (SSG/ISR mantığı)
async function CachedTime() {
  "use cache";
  cacheLife("hours");
  return <p>{new Date().toISOString()}</p>;
}

// 2) Her istekte sunucuda (SSR) — <Suspense> içinde kullanılır
async function RequestTime() {
  await connection();
  return <p>{new Date().toISOString()}</p>;
}

// 3) Tarayıcıda (CSR)
"use client";
useEffect(() => { fetch("/api/...").then(...) }, []);`}</pre>
        <Note icon="🤖">
          <p>
            <i>“Bunu server component’e çevirdim.”</i> → Kod artık tarayıcıya gitmiyor, veri sunucuda okunuyor. <i>“‘use client’ sınırını
            aşağı indirdim.”</i> → Sadece etkileşimli küçük parça client kaldı, bundle küçüldü. <i>“Hydration mismatch’i düzelttim.”</i> →
            Tarayıcıya özel bir değeri (saat, localStorage) useEffect’e taşıdı. <i>“Bu sayfayı cache’ledim (use cache).”</i> → Stoğa üretime
            geçti, bayatlık süresini cacheLife ile seçti.
          </p>
        </Note>
        <Note icon="🏢">
          <p>
            <b>Clopos köprüsü:</b> şirket reposunda <code>&quot;use client&quot;</code>, <code>getServerSideProps</code>,{" "}
            <code>getStaticProps</code>, <code>revalidate</code>, <code>use cache</code> kelimelerini ara. Hangi sayfaların stoğa, hangilerinin
            siparişe üretildiğini görürsün. Eski Next.js projelerinde (Pages Router) isimler farklıdır ama fikir aynı.
          </p>
        </Note>
      </Section>
    </main>
  );
}
