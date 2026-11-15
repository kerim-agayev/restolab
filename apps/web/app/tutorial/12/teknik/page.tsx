import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Gün 12 (Teknik) — Terminal sınavı | RestoLab" };

const EXAM: { task: string; hint: string; answer: string }[] = [
  {
    task: "Canlı sitenin hangi bölgeden (region) servis edildiğini ve cevabın CDN’den gelip gelmediğini tek komutla bul.",
    hint: "Gün 7: header’lara bak.",
    answer: `curl.exe -sI https://restolab-kappa.vercel.app/tutorial | findstr /i "x-vercel"  → X-Vercel-Cache: HIT, X-Vercel-Id: fra1::…`,
  },
  {
    task: "HTTP Lab endpoint’ine PATCH at ve sadece status kodunu yazdır. Neden o kod?",
    hint: "Gün 3–4: route hangi method’ları dışa aktarıyor?",
    answer: `curl.exe -s -o NUL -w "%{http_code}" -X PATCH https://restolab-kappa.vercel.app/api/tutorial/http  → 405 (PATCH export edilmedi)`,
  },
  {
    task: "2 saniyelik sabırla 5 saniye süren bir istek at. Exit code kaç? Sunucu logunda ne görürsün?",
    hint: "Gün 3–4: client timeout ≠ server error.",
    answer: `curl.exe -s --max-time 2 "https://restolab-kappa.vercel.app/api/tutorial/http?delay=5000"; echo $LASTEXITCODE  → 28. Logda aynı istek 200, durationMs ~5000.`,
  },
  {
    task: "Bilgisayarının private IP’sini ve internetin seni gördüğü public IP’yi bul.",
    hint: "Gün 5: iki farklı komut.",
    answer: "ipconfig (IPv4 Address, 192.168.x.x) · curl.exe -s ifconfig.me (public, NAT arkası)",
  },
  {
    task: "Var olmayan bir isme istek at ve hatanın DNS katmanında olduğunu kanıtla.",
    hint: "Gün 6: .invalid uzantısı.",
    answer: "curl.exe -sS http://restolab-yok.invalid  → (6) Could not resolve host · Resolve-DnsName → DNS name does not exist",
  },
  {
    task: "Masa API’sine kurala aykırı bir masa gönder ve hangi alanların yanlış olduğunu oku.",
    hint: "Gün 9: 422 ve fields.",
    answer: `curl.exe -s -X POST https://restolab-kappa.vercel.app/api/tutorial/masa -H "content-type: application/json" -d '{\\"masaNo\\":99,\\"qonaq\\":0,\\"ofisiant\\":\\"A\\"}'`,
  },
  {
    task: "node ile 1000 kez 0.1 topla, sonra aynı işi qəpikle yap.",
    hint: "Gün 10.",
    answer: `node -e "let s=0;for(let i=0;i<1000;i++)s+=0.1;console.log(s)"  → 99.9999999999986 · qəpikle 10000`,
  },
  {
    task: "Sepet API’sine 1 qəpik fiyatla plov gönder; sunucu ne hesaplıyor?",
    hint: "Gün 11.",
    answer: `curl.exe -s -X POST https://restolab-kappa.vercel.app/api/tutorial/cart -H "content-type: application/json" -d '{\\"items\\":[{\\"id\\":\\"plov\\",\\"qty\\":1,\\"price_minor\\":1}]}'  → serverTotal_minor 1200, tampered ["plov"]`,
  },
];

export default function Day12Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/12" className="text-sm underline">
          ← Gün 12 tekrarı
        </Link>
        <p className="text-sm text-zinc-500">Gün 12 · Teknik</p>
        <h1 className="text-3xl font-bold">Terminal sınavı</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Önce komutu <b>kendin</b> yaz ve çalıştır. Takılırsan ipucunu aç, en son cevabı. Komutlar canlı adresi kullanır (bu PR merge olduktan sonra
          hepsi çalışır).
        </p>
      </header>
      <ol className="space-y-3">
        {EXAM.map((e, i) => (
          <li key={e.task} className="space-y-2 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
            <p className="font-semibold">
              {i + 1}. {e.task}
            </p>
            <details>
              <summary className="cursor-pointer text-xs">💡 İpucu</summary>
              <p className="mt-1 text-xs">{e.hint}</p>
            </details>
            <details>
              <summary className="cursor-pointer text-xs">✅ Cevap</summary>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded bg-zinc-950 p-2 text-xs text-emerald-300">{e.answer}</pre>
            </details>
          </li>
        ))}
      </ol>
    </main>
  );
}
