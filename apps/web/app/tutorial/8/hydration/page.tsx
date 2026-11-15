import type { Metadata } from "next";
import Link from "next/link";
import { WhereAmI } from "./WhereAmI";

export const metadata: Metadata = { title: "Gün 8 — Bilerek bozuk: hydration | RestoLab" };

export default function HydrationBreak() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-8">
      <Link href="/tutorial/8" className="text-sm underline">
        ← Gün 8 dersine dön
      </Link>
      <h1 className="text-3xl font-bold">💥 Bilerek bozuk sayfa: hydration hatası</h1>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        <li>
          <b>F12</b> → <b>Console</b> sekmesini aç, sonra sayfayı <b>F5</b> ile yenile.
        </li>
        <li>
          Kırmızı bir hata görmelisin. Production’da kısa hâli: <code>Minified React error #418</code> (metin uyuşmadı). Local’de
          (<code>pnpm dev</code>) uzun hâli: <code>Hydration failed because the server rendered text didn’t match the client</code>.
        </li>
        <li>
          <b>Ctrl+U</b> (sayfa kaynağı) aç ve “üretildi” kelimesini ara: HTML’de <b>“sunucuda”</b> yazıyor. Ekranda ise
          <b> “tarayıcıda”</b> görüyorsun. İşte uyuşmazlık bu.
        </li>
      </ol>
      <div className="rounded-xl border-2 border-rose-500/60 p-4">
        <WhereAmI />
      </div>
      <div className="space-y-2 rounded-xl bg-zinc-500/10 p-4 text-sm">
        <p className="font-semibold">Neden oldu? (ipucu: önce kendin düşün, sonra oku)</p>
        <details>
          <summary className="cursor-pointer">Cevabı göster</summary>
          <p className="mt-2">
            Sunucu “kuru resmi” (HTML) çizerken <code>window</code> yoktu → “sunucuda” yazdı. Tarayıcı aynı bileşeni çalıştırıp resmi
            “canlandırmaya” (hydration) gelince <code>window</code> var → “tarayıcıda” üretti. React iki resim farklı olunca hata verir.
            Gerçek hayatta en sık sebepler: <code>new Date()</code>/saat dilimi, <code>Math.random()</code>, <code>localStorage</code>,
            tarayıcı eklentilerinin HTML’i değiştirmesi. Çözüm: tarayıcıya özel değeri <code>useEffect</code> içinde, sayfa
            canlandıktan sonra okumak.
          </p>
        </details>
      </div>
    </main>
  );
}
