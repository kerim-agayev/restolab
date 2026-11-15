import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Deeper, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { CartLab, LayoutShift, OptimisticLab, WhoseData } from "./Sims";

export const metadata: Metadata = { title: "Gün 11 — Sepet nerede durur? State, güven ve hız | RestoLab" };

export default function Day11() {
  return (
    <TutorialShell day={11}>
      <Econ>
        <p>
          Bugünün ekonomi fikri <b>asimetrik bilgi ve güven</b> (Gün 6’daki sertifikanın devamı): müşteri kendi faturasını yazabiliyorsa, kasanın
          o faturaya güvenmesi saflık olur. Tarayıcı müşterinin elinde. İkinci fikir <b>algılanan bekleme süresi</b>: kuyruk aynı uzunlukta
          olsa da insanlar “işlem başladı” hissini veren yerde daha az sabırsızlanır (optimistic UI).
        </p>
      </Econ>

      <Chapter n={1} title="Bloknot ve resmî kayıt" question="Garson tabletinde eklenen sepet nerede duruyor? Kime güvenmeliyiz?">
        <Story>
          <p>
            Tarayıcının küçük bir <b>bloknotu</b> var: <b>localStorage</b>. Oraya yazılan sepet sayfa yenilense de kalır. Ama bloknot{" "}
            <b>kullanıcının elinde</b>: DevTools’u açan herkes içindekini değiştirebilir, fiyat dahil. O yüzden sipariş verilince sunucu,
            bloknottaki fiyata değil <b>kendi resmî fiyat listesine</b> bakar.
          </p>
        </Story>
        <Try title="Sepete ekle → F5 → fiyatları boz → sipariş ver">
          <CartLab />
        </Try>
        <Predict
          question="Fiyatları 0.01 ₼ yapıp sipariş verirsen müşteri ne kadar öder?"
          options={[{ label: "0.01 ₼ × adet" }, { label: "Sunucunun kendi fiyatı (gerçek fiyat)", right: true }]}
          reveal={
            <p>
              Sunucu tarayıcının gönderdiği fiyatı sadece “iddia” olarak görür, karşılaştırır, ama hesabı kendi fiyat listesiyle yapar. Kural:{" "}
              <b>tarayıcıdan gelen hiçbir şey gerçek değildir</b>, sadece bir istektir. (Gün 9’daki form kontrolünün aynısı, bu kez para ile.)
            </p>
          }
        />
        <TeachBack
          prompt="localStorage’da tutulan sepet neden tehlikesiz ama oradaki fiyat neden güvenilmez?"
          hints={["bloknot", "kullanıcının elinde", "resmî fiyat listesi", "sunucu hesaplar"]}
          model={
            <p>
              Sepeti tarayıcıda tutmak kullanıcıya kolaylık: sayfa yenilense de kaybolmuyor. Ama tarayıcı kullanıcının elinde, içindeki fiyatı
              değiştirebilir. Bu yüzden sipariş verilince sunucu fiyatı kendi listesinden okuyup toplamı kendisi hesaplar; tarayıcının söylediği
              sadece bir istek.
            </p>
          }
          checklist={["localStorage: kalıcı ama kullanıcının elinde", "Kullanıcı değiştirebilir (DevTools)", "Fiyat ve toplam sunucuda hesaplanır"]}
        />
        <TermCard
          terms={[
            { term: "localStorage", plain: "Tarayıcının kalıcı bloknotu", heard: "Sepeti localStorage’da persist ediyoruz" },
            { term: "Cookie (httpOnly)", plain: "Her istekte sunucuya giden küçük not (JS okuyamaz)", heard: "Session httpOnly cookie’de" },
            { term: "Never trust the client", plain: "Tarayıcıdan geleni doğrula", heard: "Fiyatı client’tan alma!" },
          ]}
        />
        <Deeper title="Cookie, localStorage, sessionStorage farkı">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li><b>localStorage:</b> ~5 MB, sekme kapansa da kalır, sadece JavaScript okur, sunucuya kendiliğinden gitmez.</li>
            <li><b>sessionStorage:</b> aynısı ama sekme kapanınca silinir.</li>
            <li><b>Cookie:</b> küçük (~4 KB), <b>her istekte otomatik sunucuya gider</b>. <code>httpOnly</code> ise JavaScript okuyamaz (oturum anahtarı için ideal, Gün 17).</li>
          </ul>
        </Deeper>
      </Chapter>

      <Chapter n={2} title="Bu veri kimin?" question="Redux, Zustand, TanStack Query… Hangisi ne zaman?">
        <Story>
          <p>
            Uygulamadaki veriler iki türlü: <b>resmî kayıttan bir kopya</b> (menü, açık masalar: asıl sahibi sunucu, başkaları da değiştiriyor) ve{" "}
            <b>garsonun kendi bloknotu</b> (henüz gönderilmemiş sepet, açık menü, karanlık mod). Birincisine <b>server state</b>, ikincisine{" "}
            <b>client state</b> denir. Hangi aracı seçeceğin buna bağlı. Kütüphane adlarını ezberleme, soruyu sor: “bu verinin asıl sahibi kim?”
          </p>
        </Story>
        <Try title="Her veriyi doğru yere koy">
          <WhoseData />
        </Try>
        <Deeper title="Kısa karşılaştırma: TanStack Query · Redux Toolkit · Zustand · useState">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-zinc-500">
                <tr><th className="pr-2">Araç</th><th className="pr-2">Ne için?</th><th>Benzetme</th></tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-t border-zinc-200 dark:border-zinc-800"><td className="pr-2 font-semibold">TanStack Query</td><td className="pr-2">Server state: çek, önbellekte tut, bayatlayınca yenile, aynı isteği tekrarlama</td><td>Mutfakla aradaki akıllı garson</td></tr>
                <tr className="border-t border-zinc-200 dark:border-zinc-800"><td className="pr-2 font-semibold">Redux Toolkit</td><td className="pr-2">Büyük, çok ekranlı client state; her değişiklik kayıtlı (DevTools ile geriye sar)</td><td>Defter-i kebir: her hareket yevmiyeye yazılır</td></tr>
                <tr className="border-t border-zinc-200 dark:border-zinc-800"><td className="pr-2 font-semibold">Zustand</td><td className="pr-2">Küçük-orta global client state, az kod</td><td>Ortak beyaz tahta</td></tr>
                <tr className="border-t border-zinc-200 dark:border-zinc-800"><td className="pr-2 font-semibold">useState</td><td className="pr-2">Tek bileşenin kendi durumu</td><td>Cep notu</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">Clopos gibi eski ve büyük projelerde Redux sık görülür; yeni projelerde server state için TanStack Query, kalan küçük client state için Zustand/useState yaygın. Gün 94’te Redux Toolkit’i elle kuracağız.</p>
        </Deeper>
        <TeachBack
          prompt="Bir arkadaşın ‘her şeyi Redux’a koyalım’ diyor. Server state ile client state farkını kullanarak cevap ver."
          hints={["asıl sahibi", "sunucu", "bloknot", "bayatlar", "yenile"]}
          model={
            <p>
              Önce verinin asıl sahibine bakarım. Menü ve açık masalar sunucunun; başkaları da değiştirdiği için kopyası bayatlar, bunları
              çekip önbellekte tutan ve yenileyen bir araç (TanStack Query) daha uygun. Sepet, açık menü gibi sadece bu ekranı ilgilendiren şeyler
              client state; küçükse useState/Zustand, çok büyük ve çok ekranlıysa Redux. Hepsini Redux’a koymak sunucu verisinin bayatlamasını
              elle yönetmek demek.
            </p>
          }
          checklist={["Server state: asıl sahibi sunucu, bayatlar → TanStack Query", "Client state: bu ekrana ait → useState/Zustand/Redux", "Araç verinin sahibine göre seçilir"]}
        />
        <TermCard
          terms={[
            { term: "Server state", plain: "Sunucudaki resmî kaydın kopyası", heard: "Bu server state, Query’e taşı" },
            { term: "Client state", plain: "Sadece tarayıcıdaki geçici durum", heard: "UI state’i store’da tutuyoruz" },
            { term: "Store", plain: "Paylaşılan ortak durum kutusu", heard: "Redux store’a dispatch ettim" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="İyimser garson" question="Butona basınca sunucuyu beklemeden ekranı güncellemek doğru mu?">
        <Story>
          <p>
            İyi bir garson “çayınız geliyor” deyip not alır; mutfaktan onay beklemeden masadaki deneyim akar. Nadiren mutfak “çay bitti” derse geri
            gelip özür diler. Buna <b>optimistic UI</b> denir: ekran hemen güncellenir, sunucu reddederse <b>geri alınır</b> (rollback) ve kullanıcıya
            söylenir.
          </p>
        </Story>
        <Try title="İyimser modu aç/kapat, sonra sunucuyu hata verdir">
          <OptimisticLab />
        </Try>
        <Predict
          question="Hangi işlemde iyimser mod RİSKLİ?"
          options={[{ label: "Sepete ürün eklemek" }, { label: "Kartla ödeme almak", right: true }]}
          reveal={<p>Geri alınması kolay ve başarısı neredeyse kesin işlerde iyimser ol. Para, ödeme, stok düşme gibi geri dönüşü zor işlerde sunucunun onayını bekle.</p>}
        />
        <TeachBack
          prompt="Optimistic UI’ı garson benzetmesiyle anlat. Ne zaman kullanmazsın?"
          hints={["hemen göster", "geri al", "nadiren hata", "para"]}
          model={
            <p>
              Kullanıcının işlemini sunucuyu beklemeden ekranda hemen gösteririm çünkü çoğu zaman başarılı olur ve uygulama hızlı hisseder. Sunucu
              reddederse değişikliği geri alıp kullanıcıya haber veririm. Ödeme gibi geri dönüşü zor ve hatası pahalı işlerde kullanmam, onayı beklerim.
            </p>
          }
          checklist={["Ekran hemen güncellenir", "Hata olursa geri alınır ve kullanıcıya söylenir", "Para/ödeme gibi kritik işlerde kullanılmaz"]}
        />
        <TermCard
          terms={[
            { term: "Optimistic update", plain: "Onay beklemeden ekranı güncellemek", heard: "Optimistic update ekledim" },
            { term: "Rollback", plain: "Hata olunca geri almak", heard: "Hata gelirse rollback et" },
            { term: "Invalidate / refetch", plain: "Kopyayı bayat say ve yeniden çek", heard: "Mutation’dan sonra query’yi invalidate ettim" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="Hız nasıl ölçülür?" question="‘Site yavaş’ şikâyetini sayıya nasıl çeviririz?">
        <Story>
          <p>
            Google üç sayı önerir (<b>Core Web Vitals</b>), restoranda karşılıkları: <b>LCP</b> = ana yemeğin masaya gelme süresi (en büyük
            içeriğin görünmesi), <b>INP</b> = garsonu çağırınca dönme süresi (tıklamaya tepki), <b>CLS</b> = masa sarsılıp tabakların kayması
            (sayfa elemanlarının yerinden oynaması). Sonuncusunu dene.
          </p>
        </Story>
        <Try title="Görselin yerini ayır / ayırma">
          <LayoutShift />
        </Try>
        <TeachBack
          prompt="LCP, INP ve CLS’yi restoran benzetmesiyle bir cümlede anlat."
          hints={["ana yemek", "garson", "tabak kayması"]}
          model={
            <p>
              LCP ana yemeğin masaya ne kadar sürede geldiği, yani sayfanın en büyük parçasının ne zaman göründüğü. INP garsonu çağırınca ne kadar
              hızlı döndüğü, yani tıklamaya tepki süresi. CLS masa sarsılıp tabakların kayması gibi, sayfa elemanlarının beklenmedik şekilde yer
              değiştirmesi.
            </p>
          }
          checklist={["LCP = ana içerik ne zaman göründü", "INP = tıklamaya tepki süresi", "CLS = beklenmedik kayma"]}
        />
        <TermCard
          terms={[
            { term: "Core Web Vitals", plain: "Kullanıcı deneyiminin 3 sayısı", heard: "CWV skorları düştü" },
            { term: "LCP / INP / CLS", plain: "Yükleme / tepki / kayma", heard: "CLS’yi görsel boyutlarıyla düzelttim" },
            { term: "Lighthouse", plain: "Chrome’un ölçüm aracı", heard: "Lighthouse’ta 90 aldık" },
          ]}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "Sepet toplamı tarayıcıda hesaplanıp sunucuya ‘total: 3.00’ olarak gönderiliyor ve sunucu bunu tahsil ediyor. Sorun?",
              options: ["Sorun yok", "Kullanıcı total’i değiştirebilir; sunucu kendisi hesaplamalı"],
              answer: 1,
              explain: "Tarayıcıdan gelen her değer bir iddiadır. Para hesabı sunucuda.",
            },
            {
              q: "Açık masalar listesini hangi araçla tutmak daha doğal?",
              options: ["Redux’ta elle", "TanStack Query (server state: çek, önbellekle, yenile)", "localStorage"],
              answer: 1,
              explain: "Asıl sahibi sunucu ve başkaları değiştiriyor: kopya bayatlar, yenilenmesi gerekir.",
            },
            {
              q: "Sayfa yüklenirken butonlar aşağı kayıyor. Hangi metrik kötü?",
              options: ["LCP", "INP", "CLS"],
              answer: 2,
              explain: "Layout shift. Çözüm: görsellere/reklam alanlarına önceden yer ayırmak.",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        DevTools Application, Lighthouse ve curl görevleri:{" "}
        <Link href="/tutorial/11/teknik" className="underline">
          Gün 11 — Teknik sayfa →
        </Link>
      </p>
    </TutorialShell>
  );
}
