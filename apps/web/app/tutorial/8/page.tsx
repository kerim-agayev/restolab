import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { Note, TutorialShell } from "@/components/tutorial/TutorialShell";
import { HydrationSim, ServerOrClient, ThreeKitchens } from "./Sims";

export const metadata: Metadata = { title: "Gün 8 — Sayfa kim tarafından, ne zaman çiziliyor? | RestoLab" };

export default function Day8() {
  return (
    <TutorialShell day={8}>
      <Econ>
        <p>
          Hafta 1 isteğin <b>yolculuğuydu</b>. Hafta 2 aynı butona sayfanın <b>içinden</b> bakıyor. Bugünkü soru üretim ekonomisinden:
          bir ürünü <b>stoğa mı üretirsin</b> (önceden), <b>siparişe mi</b> (o an), yoksa <b>müşteriye kendisi mi monte ettirirsin</b>
          (IKEA)? Web sayfaları da tam bu üç yolla üretiliyor.
        </p>
      </Econ>

      <Chapter n={1} title="Üç mutfak" question="QR menü sayfasını kim, ne zaman hazırlıyor?">
        <Story>
          <p>
            Menü sayfası üç şekilde hazırlanabilir: <b>önceden basılır</b> (dün gece), <b>sipariş gelince hazırlanır</b> (o an, sunucuda),
            ya da <b>müşterinin masasında pişirilir</b> (tarayıcıda, JavaScript ile). Üçü de aynı menüyü gösterir. Fark: ne kadar hızlı,
            ne kadar taze, ve ilk gelen HTML’de menü var mı.
          </p>
        </Story>
        <Try title="Üç mutfağı sırayla oynat">
          <ThreeKitchens />
        </Try>
        <Econ>
          <p>
            <b>Stoğa üretim (SSG)</b>: ucuz ve hızlı teslim, ama talep/fiyat değişirse elde bayat stok. <b>Siparişe üretim (SSR)</b>: her
            zaman güncel, ama her sipariş üretim maliyeti. <b>Müşteriye monte ettirmek (CSR)</b>: senin maliyetin düşer, müşterinin cihazı
            ve sabrı öder. Doğru cevap ürüne göre değişir: QR menü çoğunlukla stoğa (önbellek), sepet ve ödeme siparişe.
          </p>
        </Econ>
        <TeachBack
          prompt="QR menü sayfası için hangi mutfağı seçerdin ve neden? Fiyatlar günde bir değişiyor."
          hints={["önceden", "taze", "hızlı", "bayat", "yenile"]}
          model={
            <p>
              Önceden hazırlanmış (önbellekli) sayfa seçerdim, çünkü yüzlerce müşteri aynı menüye bakıyor ve hız önemli. Fiyat günde bir
              değiştiği için önbelleği belirli aralıkla ya da fiyat değişince yeniletirim. Böylece hem hızlı hem yeterince taze olur.
            </p>
          }
          checklist={["Herkese aynı içerik → önceden hazırlamak mantıklı", "Hız önemli (QR’ı okutan bekletilmemeli)", "Fiyat değişince yenileme (revalidate) gerekir"]}
        />
        <TermCard
          terms={[
            { term: "SSG / ISR", plain: "Önceden basılmış sayfa / aralıklarla yeniden basılan", heard: "Bu sayfa statik, revalidate 60" },
            { term: "SSR", plain: "Her istekte sunucuda hazırlanan sayfa", heard: "Bu route dinamik render ediliyor" },
            { term: "CSR", plain: "Tarayıcıda JavaScript ile oluşan sayfa", heard: "Client-side fetch yapıyoruz" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Mutfak mı, masa mı?" question="Bir sayfanın hangi parçası sunucuda, hangisi tarayıcıda çalışmalı?">
        <Story>
          <p>
            Next.js’te bir sayfa parçalardan (component) oluşur. Varsayılan olarak her parça <b>mutfakta</b> (sunucuda) hazırlanır ve
            hazır gelir. Tıklama, yazma, zamanlayıcı gibi <b>masada</b> olması gereken şeyler için dosyanın başına{" "}
            <code>&quot;use client&quot;</code> yazılır. Mutfakta kalan parçanın kodu tarayıcıya hiç gitmez: daha az yük, daha güvenli.
          </p>
        </Story>
        <Try title="Her parçayı doğru yere koy">
          <ServerOrClient />
        </Try>
        <Predict
          question="Gizli bir API anahtarını “use client” yazan bir dosyada kullanırsan ne olur?"
          options={[{ label: "Hiçbir şey, sadece sunucuda kalır" }, { label: "Anahtar tarayıcıya gider, herkes görebilir", right: true }]}
          reveal={
            <p>
              Client Component’in kodu kullanıcının tarayıcısına indirilir. İçindeki her şey (DevTools → Sources) görülebilir. Gizli
              anahtarlar sadece Server tarafında kullanılır. Next.js bu yüzden <code>NEXT_PUBLIC_</code> ile başlamayan env değişkenlerini
              tarayıcıya hiç göndermez (Gün 1’deki <code>RELEASE_CHANNEL</code> hatırla).
            </p>
          }
        />
        <TeachBack
          prompt="‘use client’ ne zaman yazılır, ne zaman yazılmaz?"
          hints={["tıklama", "useState", "gizli anahtar", "varsayılan sunucu", "daha az kod"]}
          model={
            <p>
              Varsayılan olarak her parça sunucuda hazırlanır; bu daha hızlı ve güvenli çünkü kodu tarayıcıya gitmez. Sadece tıklama, yazma,
              zamanlayıcı, tarayıcı hafızası gibi kullanıcıyla etkileşen parçalar için ‘use client’ yazarım. Gizli bilgi kullanan parça asla
              client olmaz.
            </p>
          }
          checklist={["Varsayılan: Server Component", "Etkileşim (state, tıklama) → ‘use client’", "Gizli bilgiler sadece sunucuda"]}
        />
        <TermCard
          terms={[
            { term: "Server Component", plain: "Mutfakta hazırlanan parça", heard: "Bunu server component yap" },
            { term: "Client Component", plain: "Masada çalışan, etkileşimli parça", heard: "Buraya ‘use client’ ekledim" },
            { term: "Bundle", plain: "Tarayıcıya giden JavaScript paketi", heard: "Bundle size büyümüş" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="Kuru resim ve su (hydration)" question="Sayfa ekranda görünüyor ama buton neden ilk saniyede çalışmıyor?">
        <Story>
          <p>
            Sunucu tarayıcıya önce sayfanın <b>resmini</b> (HTML) gönderir: her şey görünür ama hiçbir şey çalışmaz. Sonra JavaScript gelir
            ve resmin üstüne “su döker”: butonlar canlanır. Buna <b>hydration</b> denir. Bir şart var: JavaScript’in ürettiği resim, sunucunun
            gönderdiği resimle <b>birebir aynı</b> olmalı. Değilse React “bu benim resmim değil” diye hata verir.
          </p>
        </Story>
        <Try title="Sayfayı yükle ve buton griyken tıkla">
          <HydrationSim />
        </Try>
        <Predict
          question="Bir bileşen ekrana new Date() ile saat yazıyor. Sunucu saat 10:00:00’da, tarayıcı 10:00:01’de çiziyor. Ne olur?"
          options={[{ label: "Sorun yok, saniye önemsiz" }, { label: "Hydration hatası: iki resim farklı", right: true }]}
          reveal={
            <p>
              Tek bir karakter farkı bile uyuşmazlıktır. Saat, rastgele sayı, saat dilimi ve <code>localStorage</code> en sık sebepler. Lab’da
              bunu bilerek bozduğumuz bir sayfa var.
            </p>
          }
        />
        <TeachBack
          prompt="Hydration hatasını, ‘kuru resim ve su’ benzetmesiyle anlat. Nasıl düzelir?"
          hints={["resim", "canlanır", "aynı olmalı", "useEffect", "sonra oku"]}
          model={
            <p>
              Sunucu sayfanın resmini gönderir, sonra tarayıcı aynı resmi kendisi çizip üstüne etkileşimi ekler. İki resim farklıysa (saat,
              rastgele sayı, tarayıcıya özel bilgi) React hata verir. Düzeltmek için tarayıcıya özel değeri sayfa canlandıktan sonra
              (useEffect içinde) okurum; ilk resim iki tarafta da aynı kalır.
            </p>
          }
          checklist={["Önce HTML (resim), sonra JS (canlandırma)", "İki taraf aynı resmi üretmeli", "Tarayıcıya özel değer sonradan (useEffect) okunur"]}
        />
        <TermCard
          terms={[
            { term: "Hydration", plain: "HTML resmini JavaScript ile canlandırmak", heard: "Hydration mismatch var" },
            { term: "React error #418", plain: "Production’daki kısa adı: metin uyuşmadı", heard: "Konsolda #418 görüyorum" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="Lab: kendi gözünle" question="Gerçek bir sayfada bu üç mutfağı nasıl ayırt ederim?">
        <Story>
          <p>
            Lab sayfasında aynı bilgi (şu anki saat) üç şekilde çiziliyor. Görevin: <b>F5</b> ile yenile ve hangisinin değiştiğine bak, sonra{" "}
            <b>Ctrl+U</b> ile sayfa kaynağını aç ve hangi saatin HTML içinde olduğunu bul.
          </p>
        </Story>
        <Note icon="🧪">
          <p>
            <Link href="/tutorial/8/lab" className="font-semibold underline">
              → Lab: aynı saat, üç mutfak
            </Link>{" "}
            · Bilerek bozuk sayfa:{" "}
            <Link href="/tutorial/8/hydration" className="font-semibold underline">
              → hydration hatası
            </Link>
          </p>
        </Note>
        <Predict
          question="Lab’da F5’e basınca hangi kutunun saati DEĞİŞMEZ?"
          options={[{ label: "Önbellek (SSG) kutusu", right: true }, { label: "Sunucu her istekte (SSR) kutusu" }, { label: "Tarayıcı (CSR) kutusu" }]}
          reveal={<p>Önbellekteki saat bir kez üretildi ve saatlerce aynı kalır. Diğer ikisi her seferinde yeni. Lab’da kendin doğrula.</p>}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "Google’ın menünü görmesi (SEO) önemli. Menü listesi için en kötü seçim hangisi?",
              options: ["Önceden basılmış (SSG)", "Sunucuda her istekte (SSR)", "Sadece tarayıcıda (CSR)"],
              answer: 2,
              explain: "CSR’da ilk HTML boş tabaktır; içerik sonra gelir. SSG ve SSR’da menü HTML’in içindedir.",
            },
            {
              q: "Kullanıcı ‘sayfa açıldı ama butona basınca bir şey olmadı, sonra çalıştı’ diyor. En olası sebep?",
              options: ["Sunucu çöktü", "Hydration bitmeden tıkladı (JS henüz gelmedi)", "CORS hatası"],
              answer: 1,
              explain: "HTML resmi gelmiş ama JavaScript henüz canlandırmamış. Büyük bundle ve yavaş internet bunu uzatır.",
            },
            {
              q: "Ödeme sağlayıcısının gizli anahtarı hangi bileşende kullanılmalı?",
              options: ["‘use client’ bileşeninde", "Server Component / Server Action / Route Handler’da", "localStorage’da"],
              answer: 1,
              explain: "Client kodu tarayıcıya iner ve görülebilir. Gizli bilgiler sadece sunucuda.",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Terminal ve DevTools görevleri:{" "}
        <Link href="/tutorial/8/teknik" className="underline">
          Gün 8 — Teknik sayfa →
        </Link>
      </p>
    </TutorialShell>
  );
}
