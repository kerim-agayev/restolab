import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Deeper, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { CacheLab, CorsReal, CorsSim, DebugGame, EdgeMap, HstsDemo } from "./Sims";

export const metadata: Metadata = { title: "Gün 7 — HTTPS, CDN ve CORS | RestoLab" };

const toc = ["https ve HSTS", "CDN: bölgesel depo", "Cache’i canlı gör", "CORS", "Hata teşhisi"];

export default function Day7() {
  return (
    <TutorialShell day={7}>
      <nav className="flex flex-wrap gap-2 text-sm">
        {toc.map((t, i) => (
          <a key={t} href={`#b${i + 1}`} className="rounded-full border border-zinc-300 px-3 py-1 dark:border-zinc-700">
            {i + 1}. {t}
          </a>
        ))}
      </nav>
      <Econ>
        <p>
          Bugün üç “neden böyle?”: <b>neden adres çubuğunda hep kilit var</b> (güven), <b>neden aynı sayfa Bakü’de de Berlin’de de
          hızlı</b> (lojistik: bölgesel depo), <b>neden tarayıcı bazı istekleri engelliyor</b> (mülkiyet hakkı: veri sahibinin izni).
          Üçünün de ekonomide karşılığı var.
        </p>
      </Econ>

      <Chapter n={1} title="https ve HSTS" question="Adres çubuğuna https yazmasam bile site nasıl güvenli açılıyor?">
        <Story>
          <p>
            Dün sertifikayı öğrendin. Peki kullanıcı <b>https yazmayı unutursa</b>? Tarayıcı önce şifresiz (http) dener, site
            “https’e git” der (308 yönlendirme). Ama o ilk şifresiz istek <b>açıkta</b> gidiyor. Çözüm: site tarayıcıya “bana 2 yıl
            boyunca sadece https ile gel” notunu bırakır. Buna <b>HSTS</b> denir. Tarayıcı bunu hatırlarsa ilk şifresiz isteği hiç göndermez.
          </p>
        </Story>
        <Try title="HSTS açıkken ve kapalıyken farkı gör">
          <HstsDemo />
        </Try>
        <Predict
          question="HSTS’i hatırlayan bir tarayıcı için kafedeki dinleyen ilk şifresiz isteği görebilir mi?"
          options={[
            { label: "Evet, yine ilk istek http gider" },
            { label: "Hayır, tarayıcı isteği zaten https’e çevirir", right: true },
          ]}
          reveal={<p>HSTS tam bunun için var: açık kalan o tek pencere kapanır. (İlk ziyaret için ayrıca ‘preload listesi’ vardır: tarayıcıya gömülü site listesi.)</p>}
        />
        <TeachBack
          prompt="Siteler https’e yönlendirme yapıyorsa HSTS’e neden ihtiyaç var?"
          hints={["ilk istek", "açıkta", "tarayıcı hatırlar", "yönlendirme"]}
          model={
            <p>
              Yönlendirme, ilk isteğin şifresiz gitmesine izin veriyor ve o istek aradaki biri tarafından görülüp
              değiştirilebilir. HSTS ile site tarayıcıya “bir daha sadece https ile gel” diye not bırakıyor; tarayıcı notu
              hatırlayınca ilk istek bile şifreli gidiyor, açık pencere kapanıyor.
            </p>
          }
          checklist={[
            "Yönlendirmede ilk istek şifresiz gider",
            "O ilk istek aradakine açıktır",
            "HSTS: tarayıcı hatırlar ve baştan https kullanır",
          ]}
        />
        <TermCard
          terms={[
            { term: "308 / 301 redirect", plain: "“Başka adrese git” cevabı", heard: "http’den https’e redirect var" },
            { term: "HSTS", plain: "“Bana hep https ile gel” notu", heard: "HSTS header’ı ekle" },
            { term: "Mixed content", plain: "https sayfada http kaynak yüklemek", heard: "Mixed content uyarısı alıyorum" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="CDN: bölgesel depo" question="Sunucu Frankfurt’ta. Bakü’deki müşteri neden her seferinde oraya kadar gitmek zorunda olsun?">
        <Story>
          <p>
            Bir fabrikan var (Frankfurt). Her müşteriye fabrikadan kargo yollarsan Bakü’ye gecikir. Akıllı çözüm: sık istenen
            ürünlerin kopyasını <b>her şehirdeki bölgesel depoda</b> tut. İlk isteyen biraz bekler (kopya depoya gidene kadar),
            sonrakiler depodan hemen alır. İnternette buna <b>CDN</b>, depoya <b>edge</b> denir.
          </p>
        </Story>
        <Try title="Üç şehirden istek at, sonra depoları boşalt">
          <EdgeMap />
        </Try>
        <Predict
          question="Berlin’de ilk istek ne kadar yavaş olur (fabrika Frankfurt’ta)?"
          options={[
            { label: "Çok yavaş (Bakü gibi)" },
            { label: "Hızlı sayılır, fabrika zaten yakın", right: true },
          ]}
          reveal={<p>Mesafe kuralı: fabrikaya yakın şehir MISS’te bile az bekler. CDN’in en çok kazandırdığı yer uzak şehirler (Bakü, New York).</p>}
        />
        <Econ>
          <p>
            <b>Lojistik:</b> Amazon’un bölgesel depoları gibi. Her yere stok koymak <b>depolama maliyeti</b>, her seferinde
            fabrikadan yollamak <b>teslimat gecikmesi</b>. CDN ikisini dengeler. Ve <b>bayat stok riski</b>: fiyat değiştiyse eski
            kopyalar depoda kalır, bu yüzden “purge” (depoyu boşalt) var.
          </p>
        </Econ>
        <TeachBack
          prompt="CDN’in kazancı ne, riski ne? Fabrika ve bölgesel depo ile anlat."
          hints={["fabrika", "depo", "ilk istek yavaş", "eski kopya"]}
          model={
            <p>
              Sık istenen cevabın kopyasını kullanıcıya yakın depolarda tutuyoruz, böylece uzaktaki müşteri de hızlı alıyor ve
              fabrika (sunucu) yorulmuyor. İlk isteyen depo boşken biraz bekliyor. Risk: içerik değişirse depodaki eski
              kopya bir süre müşteriye gidebiliyor; bu yüzden süre koyuyoruz ya da depoyu boşaltıyoruz.
            </p>
          }
          checklist={[
            "Kopya kullanıcıya yakın depoda tutulur → hızlı + sunucu rahat",
            "İlk istek MISS: yavaş, sonrakiler HIT: hızlı",
            "Risk: değişen içeriğin eski kopyası (bayat) → TTL / purge",
          ]}
        />
        <TermCard
          terms={[
            { term: "CDN / edge", plain: "Bölgesel depolar ağı / o depolardan biri", heard: "Edge’den servis ediliyor" },
            { term: "Origin", plain: "Fabrika: asıl sunucu", heard: "Origin’e istek gitmiş" },
            { term: "HIT / MISS", plain: "Depoda vardı / yoktu", heard: "x-vercel-cache: HIT" },
            { term: "Purge / invalidate", plain: "Depoyu boşaltmak", heard: "Cache’i purge et" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="Cache’i canlı gör" question="Bunu simülasyonda değil, kendi sunucunda görebilir miyim?">
        <Story>
          <p>
            Evet. Bu sitenin <code>/api/tutorial/cache</code> adresi her istekte “şu anki saati” üretir. Cevabına “CDN’de 30 saniye
            sakla” (<code>s-maxage=30</code>) notu koyduk. Cache çalışıyorsa saat <b>donmuş</b> görünür: aynı saat tekrar gelir, çünkü
            cevap depodan geliyor, sunucu yeniden üretmiyor.
          </p>
        </Story>
        <Try title="Kendi cache anahtarınla dene">
          <CacheLab />
        </Try>
        <Predict
          question="TTL 30 sn seçtin ve 5 saniye arayla 3 kez istek attın. Sunucu cevabı kaç kez ÜRETİR?"
          options={[
            { label: "3 kez" },
            { label: "1 kez (ilk istek), diğerleri depodan", right: true },
          ]}
          reveal={
            <p>
              İlk istek MISS: sunucu üretir ve depoya koyar. Sonraki ikisi HIT: aynı “üretildiği an” görünür, <code>age</code> artar.
              Deneyip kendi gözünle doğrula; “cache yok” seçince her seferinde yeni saat gelir.
            </p>
          }
        />
        <Econ>
          <p>
            Tazelik ↔ hız/maliyet takasının (DNS TTL’indekiyle aynı) HTTP versiyonu: TTL’i uzatırsan sunucu az çalışır, ucuz ve
            hızlı olur; kısaltırsan içerik taze olur ama sunucuya daha çok yük gelir.
          </p>
        </Econ>
        <TeachBack
          prompt="Müşteri ‘fiyatı güncelledim ama sitede eski fiyat görünüyor’ diyor. x-vercel-cache: HIT ve age: 3200. Ne olmuş?"
          hints={["depodaki kopya", "eski", "TTL", "purge / revalidate"]}
          model={
            <p>
              Cevap CDN deposundan geliyor (HIT) ve 3200 saniyedir orada duruyor; yani sunucuya hiç gitmedi, eski fiyatlı kopya
              veriliyor. Çözüm: TTL dolana kadar beklemek, depoyu boşaltmak (purge) ya da içeriği yeniden doğrulatmak
              (revalidate). Bir dahaki sefere fiyat gibi hassas veride TTL’i kısa tutmak.
            </p>
          }
          checklist={[
            "HIT = cevap sunucuya gitmeden depodan geldi",
            "age = kopya kaç saniyedir depoda",
            "Çözüm: bekle / purge / revalidate, TTL’i işe göre seç",
          ]}
        />
        <TermCard
          terms={[
            { term: "Cache-Control", plain: "Cevaba iliştirilen ‘nasıl saklansın’ notu", heard: "Cache-Control header’ını ayarla" },
            { term: "s-maxage / max-age", plain: "CDN için / tarayıcı için saklama süresi", heard: "s-maxage=60 koydum" },
            { term: "age", plain: "Kopyanın depodaki yaşı (sn)", heard: "age 3200 ne demek?" },
            { term: "stale / revalidate", plain: "Bayat kopya / yeniden doğrulama", heard: "stale-while-revalidate kullan" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="CORS" question="Konsolda ‘blocked by CORS policy’ yazıyor ama sunucu logunda istek 200. Kim neyi engelledi?">
        <Story>
          <p>
            Banka sitesinde oturumun açık. Başka bir sayfa (kötü niyetli olabilir) arka planda banka API’sine istek atıp cevabı
            okumaya çalışsa? Tarayıcı bunu engellemeli. Kural: <b>bir sayfa, başka sitenin cevabını sadece o site açıkça izin
            verirse okuyabilir</b>. İzin, sunucunun cevabına koyduğu <code>Access-Control-Allow-Origin</code> header’ı.
          </p>
          <p>
            Önemli: engelleyen <b>sunucu değil, tarayıcıdır</b>. Sunucu isteği çoğu zaman alıp işler; tarayıcı sadece cevabı
            JavaScript’ten saklar.
          </p>
        </Story>
        <Try title="Simülatör: sunucunun header’ını değiştir">
          <CorsSim />
        </Try>
        <Try title="Gerçek deneme: tarayıcında iki farklı siteye istek at">
          <CorsReal />
        </Try>
        <Econ>
          <p>
            <b>Mülkiyet hakkı:</b> veri sahibi izin vermedikçe başkası onu kullanamaz. CORS, “başka site” için bu izni tarayıcı
            seviyesinde uygulatır. Kural da ekonomideki gibi: izni <b>dar</b> ver. Herkese açık bir API için <code>*</code> sorun değil;
            ama oturumla çalışan bir API’de gelen adresi körü körüne geri yansıtma, izin verdiğin adresleri listele.
          </p>
        </Econ>
        <TeachBack
          prompt="‘CORS hatası aldım, sunucu bozuk’ diyen arkadaşa ne söylersin?"
          hints={["tarayıcı engeller", "sunucu çalıştı", "header eksik", "curl çalışır"]}
          model={
            <p>
              Sunucu bozuk olmayabilir: isteği alıp işlemiş olabilir. Engelleyen tarayıcı; sunucu “bu siteye izin veriyorum” diye
              Access-Control-Allow-Origin header’ı göndermediği için cevabı JavaScript’ten saklıyor. Aynı isteği curl ile atarsan
              çalışır, çünkü bu bir tarayıcı kuralı. Çözüm sunucuda doğru header’ı eklemek.
            </p>
          }
          checklist={[
            "Engelleyen tarayıcı, sunucu değil",
            "Sunucu isteği işlemiş olabilir (log’da 200)",
            "Çözüm: sunucu doğru Access-Control-Allow-Origin göndermeli",
          ]}
        />
        <TermCard
          terms={[
            { term: "Origin", plain: "Site kimliği: şema + alan adı + port", heard: "Origin uyuşmuyor" },
            { term: "CORS", plain: "Başka siteden okuma izni kuralı", heard: "CORS’u aç" },
            { term: "Preflight (OPTIONS)", plain: "Riskli istekten önce ‘izin var mı?’ sorusu", heard: "OPTIONS 404 dönüyor" },
          ]}
        />
        <Deeper title="Aynı origin nedir?">
          <p className="text-sm">
            Origin = <code>https</code> + <code>restolab-kappa.vercel.app</code> + <code>443</code>. Bu üçünden biri bile farklıysa “başka origin”dir:
            <code> http://…</code>, <code>…vercel.app:3000</code> ya da <code>api.restolab.com</code>. Kendi sayfandan kendi
            <code> /api/…</code> adresine istek atmak aynı origin’dir, bu yüzden Gün 3–4’teki lab isteklerinde CORS’a hiç takılmadın.
          </p>
        </Deeper>
      </Chapter>

      <Chapter n={5} title="Hata teşhisi" question="‘Site açılmıyor’ dendiğinde ilk soru ne olmalı?">
        <Story>
          <p>
            Son 3 günde bir isteğin yolundaki katmanları öğrendin: DNS → TCP → TLS → HTTP, yanında CORS ve cache. Her hatanın bir
            <b> mesajı</b> var ve mesaj hangi katmandan geldiğini fısıldar. Aşağıda 6 belirtiyi doğru katmana koy.
          </p>
        </Story>
        <Try title="Belirti → katman">
          <DebugGame />
        </Try>
        <TeachBack
          prompt="Müşteri ‘siteye giremiyorum’ dedi. Hangi sırayla, hangi komutlarla bakarsın? (3–4 adım)"
          hints={["DNS", "port", "sertifika", "status code", "curl"]}
          model={
            <p>
              Önce ismin adrese çözülüp çözülmediğine bakarım (Resolve-DnsName / curl “could not resolve”). Çözülüyorsa porta
              ulaşılıyor mu (Test-NetConnection / curl “refused” veya “timeout”). Sonra sertifika tamam mı (tarayıcı
              uyarısı, curl TLS hatası). En sonda HTTP status code ve cevaba bakarım (curl -i): 5xx ise uygulama logu, eski içerikse
              cache header’ları.
            </p>
          }
          checklist={[
            "Önce DNS (isim çözülüyor mu?)",
            "Sonra bağlantı (port / refused / timeout)",
            "Sonra TLS (sertifika)",
            "En sonda HTTP (status, log) ve cache",
          ]}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "Sayfanın CORS hatası verdi. Aynı URL’yi curl ile attığında çalışıyor. Bu ne gösterir?",
              options: ["Sunucu çökmüş", "Engelleyen tarayıcı kuralı; sunucuya header eklenmeli", "İnternetin yavaş"],
              answer: 1,
              explain: "CORS tarayıcıya özgü bir kuraldır. curl böyle bir kural uygulamaz.",
            },
            {
              q: "x-vercel-cache: HIT, age: 45. Bu cevabı kim üretti?",
              options: ["Şu an sunucu üretti", "45 saniye önce üretilip CDN deposuna konan kopya", "Tarayıcının kendi hafızası"],
              answer: 1,
              explain: "HIT = depodan geldi; age = kopyanın yaşı.",
            },
            {
              q: "Kafede kullanıcı http://siteadi yazdı. Siteye HSTS koymanın faydası?",
              options: ["Site daha hızlı açılır", "Tarayıcı baştan https kullanır, şifresiz ilk istek gitmez", "Sertifikaya gerek kalmaz"],
              answer: 1,
              explain: "HSTS, yönlendirmedeki açık pencereyi kapatır. Sertifika yine gerekir.",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Terminalde dene:{" "}
        <Link href="/tutorial/7/teknik" className="underline">
          Gün 7 — Teknik sayfa (curl görevleri, Cache-Control cheat sheet) →
        </Link>
      </p>
    </TutorialShell>
  );
}
