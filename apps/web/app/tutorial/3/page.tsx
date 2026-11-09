import type { Metadata } from "next";
import { FlowPlayer } from "@/components/tutorial/FlowPlayer";
import { Quiz } from "@/components/tutorial/Quiz";
import { SortGame } from "@/components/tutorial/SortGame";
import { Note, Section, TutorialShell } from "@/components/tutorial/TutorialShell";
import { HttpLab } from "./HttpLab";

export const metadata: Metadata = { title: "Gün 3 — HTTP: bir isteğin içinde ne var? | RestoLab" };

const journey = [
  { title: "Butona basıldı", detail: "Garson ‘Mətbəxə göndər’e bastı. React onClick fonksiyonu çalıştı ve fetch() çağırdı." },
  { title: "Request hazırlandı", detail: "Tarayıcı bir mektup yazdı: METHOD (POST) + URL (/api/orders) + HEADERS (kimim, ne format) + BODY (sipariş içeriği)." },
  { title: "İnternette yolculuk", detail: "Mektup HTTPS ile şifrelenip sunucuya gider. (DNS, TCP, TLS detaylarını Gün 5–6’da göreceğiz.)" },
  { title: "Sunucu (route handler)", detail: "Vercel’deki kodumuz isteği alır, okur, iş yapar (ileride: veritabanına yazar)." },
  { title: "Log yazıldı", detail: "Sunucu bir log satırı yazar: requestId, method, status, süre. Backend/QA sorunları buradan takip eder." },
  { title: "Response döndü", detail: "Cevap mektubu: STATUS CODE (201 Created) + HEADERS + BODY (oluşan sipariş)." },
  { title: "UI güncellendi", detail: "React cevabı okur, ekranda ‘Gönderildi ✓’ gösterir. Hata varsa kırmızı mesaj." },
];

export default function Day3() {
  return (
    <TutorialShell day={3}>
      <Section n={1} title="Benzetme: garsonun sipariş fişi">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-sky-500/50 p-3">
            <p className="font-semibold">➡️ Request = garsonun mutfağa verdiği fiş</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><b>Method</b> — ne istiyorsun? (yeni sipariş = POST)</li>
              <li><b>URL</b> — kime/neye? (/api/orders)</li>
              <li><b>Headers</b> — fişin üst bilgisi: kim yazdı, hangi dilde</li>
              <li><b>Body</b> — siparişin kendisi: masa 5, 2 burger</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/50 p-3">
            <p className="font-semibold">⬅️ Response = mutfağın cevabı</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><b>Status code</b> — kısa özet: 201 ‘alındı’, 409 ‘masa zaten açık’, 500 ‘mutfakta yangın’</li>
              <li><b>Headers</b> — cevabın üst bilgisi (format, takip no)</li>
              <li><b>Body</b> — cevabın içeriği (oluşan sipariş)</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section n={2} title="Butona basınca ne olur?">
        <FlowPlayer steps={journey} />
      </Section>

      <Section n={3} title="Method’lar: ne yapmak istiyorsun?">
        <table className="w-full text-left text-sm">
          <tbody className="[&_td]:border-b [&_td]:border-zinc-300 [&_td]:py-1 dark:[&_td]:border-zinc-700">
            <tr><td className="font-mono font-semibold">GET</td><td>Oku / getir</td><td>Menüyü göster: GET /api/menu</td></tr>
            <tr><td className="font-mono font-semibold">POST</td><td>Yeni oluştur</td><td>Sipariş aç: POST /api/orders</td></tr>
            <tr><td className="font-mono font-semibold">PUT</td><td>Tamamen değiştir</td><td>Ürünü baştan yaz: PUT /api/products/7</td></tr>
            <tr><td className="font-mono font-semibold">PATCH</td><td>Bir kısmını değiştir</td><td>Sadece fiyatı değiştir: PATCH /api/products/7</td></tr>
            <tr><td className="font-mono font-semibold">DELETE</td><td>Sil</td><td>Siparişten ürün çıkar: DELETE /api/orders/12/items/3</td></tr>
          </tbody>
        </table>
      </Section>

      <Section n={4} title="Status code’lar: cevabın özeti">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p className="rounded border border-emerald-500/50 p-2"><b>2xx ✅ Başarılı</b> — 200 OK, 201 Created, 204 No Content</p>
          <p className="rounded border border-sky-500/50 p-2"><b>3xx ↪️ Yönlendirme</b> — 301/302 ‘başka adrese git’</p>
          <p className="rounded border border-amber-500/50 p-2"><b>4xx 🙋 Hata SENDE (client)</b> — 400, 401, 403, 404, 409, 422, 429</p>
          <p className="rounded border border-red-500/50 p-2"><b>5xx 🔥 Hata SUNUCUDA</b> — 500, 502, 503, 504</p>
        </div>
        <Note icon="🏢">
          <p>
            <b>Şirkette duyacağın cümle:</b> ‘4xx dönüyorsa frontend’e bak, 5xx dönüyorsa backend’e bak.’ Ve en karıştırılan ikili:
            <b> 401</b> = ‘kim olduğunu bilmiyorum (giriş yap)’, <b>403</b> = ‘biliyorum ama yetkin yok’.
          </p>
        </Note>
      </Section>

      <Section n={5} title="Kır & düzelt: HTTP Laboratuvarı">
        <p className="text-sm">
          Bu laboratuvar <b>gerçek</b> bir API’ye istek atıyor (<code>/api/tutorial/http</code>). Görevler:
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>GET + 200 gönder. Response’taki <code>x-request-id</code> header’ını bul.</li>
          <li>POST + 201 gönder. Request’te body’nin, response’ta <code>receivedBody</code>’nin aynı olduğunu gör.</li>
          <li>POST’ta body’deki bir virgülü sil → gönder. Hangi status geldi? Neden?</li>
          <li><b>PATCH</b> seç → gönder. 405 geldi — bu endpoint PATCH’i desteklemiyor.</li>
          <li>‘5 sn bekle’ seç → TIMEOUT. Sunucu cevap verdi mi, yoksa tarayıcı mı vazgeçti?</li>
          <li>💥 ‘Sunucu çöksün’ işaretle → 500. Bu sefer gerçek bir exception oldu: aşağıdaki log görevine bak.</li>
        </ol>
        <HttpLab />
      </Section>

      <Section n={6} title="Gerçek araçlarla bak: DevTools + Vercel Logs">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            <b>DevTools:</b> Bu sayfada <kbd>F12</kbd> → <b>Network</b> sekmesi → laboratuvardan bir istek gönder → listede{" "}
            <code>http?status=…</code> satırına tıkla → <b>Headers</b>, <b>Payload</b> (body), <b>Response</b>, <b>Timing</b> sekmelerine bak.
          </li>
          <li>
            <b>Vercel Logs:</b> vercel.com → restolab → <b>Logs</b> → arama kutusuna requestId’nin ilk 8 karakterini yaz → senin isteğinin
            sunucu tarafındaki log satırını gör. 💥 crash isteği kırmızı <b>error</b> olarak görünür.
          </li>
        </ol>
        <Note icon="🏢">
          <p>
            <b>Yarın işte dene:</b> Clopos client’ta <kbd>F12</kbd> → Network → bir sayfayı yenile. Hangi URL’lere istek gidiyor? Hangi method,
            hangi status? Backend’ci ‘request id’yi at, loglara bakayım’ dediğinde artık ne istediğini biliyorsun.
          </p>
        </Note>
      </Section>

      <Section n={7} title="Alıştırma: isteğin yolculuğunu sırala">
        <SortGame
          items={[
            "Butona basıldı (onClick)",
            "fetch() request hazırlar",
            "Request internette yolculuk eder",
            "Sunucu isteği işler",
            "Sunucu log yazar",
            "Response geri döner",
            "UI güncellenir",
          ]}
        />
      </Section>

      <Section n={8} title="Quiz">
        <Quiz
          questions={[
            {
              q: "Garson yetkisi olmadan rapor sayfasını açmaya çalıştı. Hangi status code doğru?",
              options: ["401 Unauthorized", "403 Forbidden", "404 Not Found"],
              answer: 1,
              explain: "Sistem garsonun kim olduğunu biliyor (giriş yapmış) ama yetkisi yok → 403. Giriş yapmamış olsaydı 401.",
            },
            {
              q: "Response 500 dönüyor. Sorunu ilk nerede ararsın?",
              options: ["Frontend kodunda", "Sunucu (backend) loglarında, requestId ile", "Kullanıcının internetinde"],
              answer: 1,
              explain: "5xx = sunucu tarafı hata. requestId ile backend loglarında o isteğin satırını bulursun.",
            },
            {
              q: "Yeni sipariş oluşturmak için hangi method + status ikilisi en doğru?",
              options: ["GET + 200", "POST + 201", "DELETE + 204"],
              answer: 1,
              explain: "Yeni kayıt oluşturmak = POST, ‘oluşturuldu’ cevabı = 201 Created.",
            },
          ]}
        />
      </Section>
    </TutorialShell>
  );
}
