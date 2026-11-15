import type { Metadata } from "next";
import Link from "next/link";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 7 (Teknik) — curl görevleri ve Cache-Control | RestoLab" };

type Task = { title: string; cmd: string; expect: string; why: string };

const tasks: Task[] = [
  {
    title: "CDN’i header’dan oku",
    cmd: "curl.exe -sI https://restolab-kappa.vercel.app/tutorial | findstr /i \"x-vercel cache-control age\"",
    expect: "X-Vercel-Cache: HIT  ·  Age: <sayı>  ·  X-Vercel-Id: fra1::…  ·  Cache-Control: public, max-age=0, must-revalidate",
    why: "X-Vercel-Id’nin başındaki fra1, cevabı veren bölge (Frankfurt). HIT = depodan geldi. Age = kopyanın yaşı.",
  },
  {
    title: "Aynı komutu 5 saniye sonra tekrar çalıştır",
    cmd: "curl.exe -sI https://restolab-kappa.vercel.app/tutorial | findstr /i \"x-vercel-cache age\"",
    expect: "X-Vercel-Cache: HIT  ·  Age: öncekinden büyük",
    why: "Age her saniye artar: aynı kopya depoda yaşlanıyor. (Yeni bir deploy’da kopya yenilenir ve Age sıfırlanır.)",
  },
  {
    title: "HTTP → HTTPS yönlendirmesi ve HSTS",
    cmd: "curl.exe -sI http://restolab-kappa.vercel.app | findstr /i \"HTTP location\"\ncurl.exe -sI https://restolab-kappa.vercel.app | findstr /i \"strict-transport\"",
    expect: "308 Permanent Redirect + Location: https://…  ·  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload",
    why: "63072000 sn = 2 yıl: tarayıcı bu süre boyunca siteye sadece https ile gider. ‘preload’ = tarayıcıya gömülü listeye girmeye uygun.",
  },
  {
    title: "CORS’a izin veren API’nin header’ı",
    cmd: "curl.exe -sI https://api.github.com/zen | findstr /i \"access-control-allow-origin\"",
    expect: "Access-Control-Allow-Origin: *",
    why: "Sunucu ‘her origin okuyabilir’ diyor. Bölüm 4’teki gerçek denemede bu yüzden ‘Cevabı OKUYABİLDİM’ çıktı.",
  },
  {
    title: "CORS header’ı göndermeyen site",
    cmd: "curl.exe -sI https://www.iana.org/ | findstr /i \"access-control\"",
    expect: "(hiçbir şey yazmaz: header yok)",
    why: "Aynı site curl’de sorunsuz açılır (200). Tarayıcıdan JavaScript ile okumaya kalkınca CORS engeli. Fark tarayıcı kuralı.",
  },
  {
    title: "Preflight’ı elle gönder (OPTIONS)",
    cmd: "curl.exe -s -i -X OPTIONS https://api.github.com/zen -H \"Origin: https://baska-site.example\" -H \"Access-Control-Request-Method: GET\"",
    expect: "HTTP/1.1 204 No Content  ·  access-control-allow-methods: GET, POST, …  ·  access-control-allow-headers: Authorization, Content-Type, …",
    why: "Tarayıcı riskli bir istekten önce bunu kendisi gönderir. 204 + allow header’ları = ‘gelebilirsin’.",
  },
];

const labTasks: Task[] = [
  {
    title: "Kendi cache lab’ını curl ile dene (PR merge olduktan sonra canlıda)",
    cmd: "curl.exe -s \"https://restolab-kappa.vercel.app/api/tutorial/cache?newkey=1\"\n# çıkan key’i kullan:\ncurl.exe -sI \"https://restolab-kappa.vercel.app/api/tutorial/cache?k=<KEY>&ttl=30\" | findstr /i \"x-vercel-cache age cache-control\"\ncurl.exe -sI \"https://restolab-kappa.vercel.app/api/tutorial/cache?k=<KEY>&ttl=30\" | findstr /i \"x-vercel-cache age\"",
    expect: "1. istek: X-Vercel-Cache: MISS  ·  2. istek: HIT ve Age artıyor  ·  Cache-Control: public, max-age=0, s-maxage=30",
    why: "Preview adresleri Vercel girişi istediği için bu görevi canlı adreste yaparsın. Tarayıcıdaki Bölüm 3 aynısını preview’da da gösterir.",
  },
  {
    title: "DevTools’ta CORS hatasını gör",
    cmd: "F12 → Network → Fetch/XHR filtresi → sade sayfadaki ‘fetch → www.iana.org’ butonuna bas",
    expect: "Satırın Status’u (failed) / CORS error  ·  Console’da: blocked by CORS policy: No ‘Access-Control-Allow-Origin’ header",
    why: "Network’te isteğin gittiğini, Console’da ise tarayıcının cevabı sakladığını görürsün: sunucu ≠ tarayıcı.",
  },
];

function TaskList({ items }: { items: Task[] }) {
  return (
    <ol className="space-y-3">
      {items.map((t, i) => (
        <li key={t.title} className="space-y-1 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
          <p className="font-semibold">
            {i + 1}. {t.title}
          </p>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-2 text-xs text-emerald-300">{t.cmd}</pre>
          <p className="text-xs">
            <b>Beklenen:</b> <code>{t.expect}</code>
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{t.why}</p>
        </li>
      ))}
    </ol>
  );
}

const cacheControl: [string, string][] = [
  ["no-store", "Hiçbir yerde saklama (kişisel/hassas veri, login cevapları)"],
  ["no-cache", "Saklayabilirsin ama her kullanımdan önce sunucuya sorarak doğrula"],
  ["private", "Sadece kullanıcının tarayıcısında sakla, CDN saklamasın (kişiye özel cevap)"],
  ["public", "CDN ve herkes saklayabilir"],
  ["max-age=N", "Tarayıcı N saniye saklasın"],
  ["s-maxage=N", "CDN N saniye saklasın (tarayıcıyı etkilemez)"],
  ["stale-while-revalidate=N", "Süre dolsa bile N saniye eski kopyayı hemen ver, arkada yenisini getir"],
  ["immutable", "Bu dosya asla değişmez (içerik hash’li dosya adı), tekrar sorma"],
];

const vercelCache: [string, string][] = [
  ["HIT", "CDN deposundan geldi"],
  ["MISS", "Depoda yoktu, sunucudan üretildi ve depoya konuldu"],
  ["STALE", "Süresi dolmuş kopya verildi, arkada yenileniyor"],
  ["PRERENDER", "Build sırasında hazırlanmış statik sayfa"],
  ["BYPASS", "Cache atlandı (ör. no-store, giriş yapılmış istek)"],
];

export default function Day7Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/7" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 7 · Teknik</p>
        <h1 className="text-3xl font-bold">HTTPS, CDN ve CORS: terminal görevleri</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Tüm komutlar senin makinende doğrulandı. Sayılar değişir, şekil aynı kalır.</p>
      </header>

      <Section n={1} title="Gerçek görevler">
        <TaskList items={tasks} />
      </Section>

      <Section n={2} title="Kendi sunucunda cache ve CORS">
        <TaskList items={labTasks} />
      </Section>

      <Section n={3} title="Cheat sheet">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-semibold">Cache-Control</p>
            <table className="w-full text-left text-sm">
              <tbody>
                {cacheControl.map(([k, v]) => (
                  <tr key={k} className="border-t border-zinc-200 align-top dark:border-zinc-800">
                    <td className="py-1 pr-2 font-mono text-xs">{k}</td>
                    <td className="py-1 text-xs text-zinc-600 dark:text-zinc-400">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold">x-vercel-cache değerleri</p>
            <table className="w-full text-left text-sm">
              <tbody>
                {vercelCache.map(([k, v]) => (
                  <tr key={k} className="border-t border-zinc-200 align-top dark:border-zinc-800">
                    <td className="py-1 pr-2 font-mono text-xs">{k}</td>
                    <td className="py-1 text-xs text-zinc-600 dark:text-zinc-400">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Note icon="🤖">
          <p>
            <i>“Cache header’ı ekledim.”</i> → Cevabın CDN’de saklanma süresini koydu. <i>“CORS’u açtım.”</i> → Sunucu artık bazı
            origin’lere okuma izni veriyor; <b>hangi origin’lere?</b> diye sor: <code>*</code> herkese açık API’de tamam, oturumlu
            API’de risk. <i>“Cache’i purge ettim.”</i> → CDN deposundaki eski kopyaları attı. <i>“Stale görünüyor.”</i> → Eski kopya
            veriliyor, TTL ya da revalidate’e bak.
          </p>
        </Note>
        <Note icon="⚖️">
          <p>
            <b>Pentest köprüsü:</b> CORS yanlış yapılandırması (her origin’i yansıtmak), eksik HSTS/güvenlik header’ları ve CDN
            cache zehirlenmesi gerçek bulgu türleridir. Bunları sadece <b>kendi sunucunda</b> kontrol et.
          </p>
        </Note>
      </Section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        📖 Okumak istersen: MDN “CORS” ve “HTTP caching”, Cloudflare Learning Center “What is a CDN?”.
      </p>
    </main>
  );
}
