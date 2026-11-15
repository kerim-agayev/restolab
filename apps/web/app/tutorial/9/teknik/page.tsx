import type { Metadata } from "next";
import Link from "next/link";
import { TaskList, type Task } from "@/components/tutorial/TaskList";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 9 (Teknik) — Form, API ve status kodları | RestoLab" };

const U = "https://restolab-kappa.vercel.app/api/tutorial/masa";

const tasks: Task[] = [
  {
    title: "Server Action isteğini DevTools’ta yakala",
    cmd: "F12 → Network → Fetch/XHR → /tutorial/9’da “Masa aç”a bas",
    expect: "POST isteği sayfanın KENDİ adresine (/tutorial/9) · Request Headers’ta next-action: <uzun bir kimlik> · Payload’da masaNo, qonaq, ofisiant",
    why: "Server Action ayrı bir /api adresi değil: Next.js aynı sayfaya POST atar, hangi fonksiyonu çalıştıracağını next-action header’ından bilir.",
  },
  {
    title: "201: masa aç (curl, PowerShell)",
    cmd: `curl.exe -s -i -X POST ${U} -H "content-type: application/json" -d '{\\"masaNo\\":5,\\"qonaq\\":2,\\"ofisiant\\":\\"Aysel\\"}'`,
    expect: "HTTP/1.1 201 Created · x-request-id: … · {\"requestId\":…,\"masa\":{\"masaNo\":5,…}}",
    why: "PowerShell’de JSON içindeki tırnaklar \\\" ile kaçırılır (Gün 4). Canlıda çalışır (merge’den sonra).",
  },
  {
    title: "422: kurala aykırı",
    cmd: `curl.exe -s -X POST ${U} -H "content-type: application/json" -d '{\\"masaNo\\":99,\\"qonaq\\":0,\\"ofisiant\\":\\"A\\"}'`,
    expect: "{\"error\":\"Kurala uymayan alanlar var\",\"fields\":{\"masaNo\":\"Bu restoranda 50 masa var\",\"qonaq\":\"En az 1 qonaq\",\"ofisiant\":\"Ofisiant adı en az 2 harf\"}}",
    why: "fields = frontend’in her inputun altına yazacağı hatalar. Frontend’ci 422 görünce bunu ister.",
  },
  {
    title: "409: masa 7 dolu",
    cmd: `curl.exe -s -o NUL -w "%{http_code}" -X POST ${U} -H "content-type: application/json" -d '{\\"masaNo\\":7,\\"qonaq\\":2,\\"ofisiant\\":\\"Aysel\\"}'`,
    expect: "409",
    why: "-w \"%{http_code}\" sadece status kodunu yazdırır: QA’nın hızlı test için sevdiği numara.",
  },
];

const breakTasks: Task[] = [
  {
    title: "400: bozuk JSON",
    cmd: `curl.exe -s -o NUL -w "%{http_code}" -X POST ${U} -H "content-type: application/json" -d '{\\"masaNo\\":5,'`,
    expect: "400",
    why: "Biçim bozuk: sunucu okuyamıyor bile.",
  },
  {
    title: "415: content-type unutuldu",
    cmd: `curl.exe -s -o NUL -w "%{http_code}" -X POST ${U} -d "masa 5"`,
    expect: "415",
    why: "Gün 4’teki 415’in aynısı: ‘Bu formatta konuşmuyorum’.",
  },
  {
    title: "405: yanlış method",
    cmd: `curl.exe -s -o NUL -w "%{http_code}" ${U}`,
    expect: "405",
    why: "Route sadece POST dışa aktarıyor. GET ile gelince Next.js otomatik 405 döner (Gün 3’ün tekrarı).",
  },
  {
    title: "Logda requestId ile bul",
    cmd: "Vercel → restolab → Logs → arama: tutorial.masa",
    expect: "{\"level\":\"warn\",\"msg\":\"tutorial.masa.api\",\"status\":422,\"errors\":{…}}",
    why: "curl çıktısındaki x-request-id ile aynı satırı bul. QA bug report’una requestId yazılınca backend’ci saniyeler içinde bulur.",
  },
];

export default function Day9Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/9" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 9 · Teknik</p>
        <h1 className="text-3xl font-bold">Form, API ve status kodları: curl ile</h1>
      </header>
      <Section n={1} title="Görevler">
        <TaskList items={tasks} />
      </Section>
      <Section n={2} title="Kır ve oku">
        <TaskList items={breakTasks} />
      </Section>
      <Section n={3} title="Kod haritası">
        <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-emerald-300">{`lib/tutorial/masa.ts          ← TEK kural (zod şeması) + iş kuralı (masa 7)
app/tutorial/9/actions.ts     ← Server Action ("use server"): web formu buraya
app/api/tutorial/masa/route.ts← Route Handler (POST): terminal / mobil / curl buraya
app/tutorial/9/Sims.tsx       ← useActionState(masaAc) ile form`}</pre>
        <Note icon="🤖">
          <p>
            <i>“zod ile validate ettim, 422 dönüyorum.”</i> → Kural şemada, aykırı alanlar <code>fields</code> içinde. <i>“Client-side
            validation da ekledim.”</i> → Kullanıcı kolaylığı; sunucudaki kontrol kalkmamalı. <i>“Server action’a çevirdim.”</i> → Form artık
            ayrı API çağırmadan sunucu fonksiyonunu çalıştırıyor. <i>“Şemayı shared pakete taşıdım.”</i> → İki kapı aynı kuralı kullanıyor.
          </p>
        </Note>
        <Note icon="🏢">
          <p>
            <b>Clopos köprüsü:</b> NestJS tarafında aynı fikir <b>DTO + ValidationPipe</b> (class-validator) olarak geçer. Reponda{" "}
            <code>Dto</code>, <code>@IsInt</code>, <code>ValidationPipe</code>, frontend’de <code>zod</code>/<code>yup</code> ara. Hata cevabında
            alan listesi döndüren format, frontend’in input altına hata yazdığı yerdir.
          </p>
        </Note>
      </Section>
    </main>
  );
}
