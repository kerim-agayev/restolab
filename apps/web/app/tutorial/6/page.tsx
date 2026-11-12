import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Deeper, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { DhcpDora, DnsChain, DnsRecords, EnterJourney, FirewallGame, PingTrace, Sniffer, TlsCheck } from "./Sims";

export const metadata: Metadata = { title: "Gün 6 — Network 2: İsim, yol ve güven | RestoLab" };

const toc = ["İsim → adres (DNS)", "Kayıt türleri ve TTL", "Oda anahtarı (DHCP)", "Yolun haritası", "Güven (TLS)", "Dinleme", "Kapılar (firewall)", "Hepsi bir arada"];

export default function Day6() {
  return (
    <TutorialShell day={6}>
      <nav className="flex flex-wrap gap-2 text-sm">
        {toc.map((t, i) => (
          <a key={t} href={`#b${i + 1}`} className="rounded-full border border-zinc-300 px-3 py-1 dark:border-zinc-700">
            {i + 1}. {t}
          </a>
        ))}
      </nav>
      <Econ>
        <p>
          Dünkü ders “paket nasıl taşınır” idi. Bugün 3 soru: <b>kime gidiyorum</b> (isim → adres), <b>hangi yoldan</b> (router
          zinciri), <b>karşıdaki gerçekten o mu ve kimse dinliyor mu</b> (güven). Bu üçü de ekonomiden bildiğin şeyler:
          bilgi arama maliyeti, taşıma zinciri, asimetrik bilgi.
        </p>
      </Econ>

      <Chapter n={1} title="İsim → adres (DNS)" question="Ben ‘restolab-kappa.vercel.app’ yazıyorum ama bilgisayarlar isim bilmez, sayı bilir. Çeviriyi kim yapıyor?">
        <Story>
          <p>
            Telefonda “Ahmet’i ara” dersin ama telefon numarayı bilmek zorunda. Rehber bunu yapar. İnternetin rehberine{" "}
            <b>DNS</b> denir. Ama tek bir dev rehber yok: milyarlarca isim var. O yüzden rehberler <b>zincir</b> hâlinde:
            “bilmiyorum ama şu rehber bilir”.
          </p>
          <p>Ve herkes öğrendiğini defterine yazar, ikinci seferde zincire gitmez.</p>
        </Story>
        <Try title="Zinciri çalıştır, sonra ikinci kez sor">
          <DnsChain />
        </Try>
        <Predict
          question="Aynı ismi ikinci kez çözdüğünde ne olur?"
          options={[
            { label: "Yine tüm zinciri baştan dolaşır" },
            { label: "Defterde var, 1 halkada biter", right: true },
          ]}
          reveal={
            <p>
              Defter (cache) sayesinde. Ama defterdeki bilgi sonsuza dek kalmaz; ona bir <b>raf ömrü</b> verilir (TTL). Bir
              sonraki bölümde bunun maliyetini göreceksin.
            </p>
          }
        />
        <Econ>
          <p>
            <b>Arama maliyeti (search costs):</b> bilgiyi bulmanın bir bedeli var (zaman, çaba). Önbellek, aynı aramayı iki kez
            ödememek demek. Fiyat karşılaştırma sitelerinin yaptığı da bu.
          </p>
        </Econ>
        <TeachBack
          prompt="İsim yazdım, adres nasıl buldu ve ikinci seferde neden daha hızlı? Yeğenine anlat."
          hints={["rehber", "zincir", "defter", "bilmiyorum ama şuna sor"]}
          model={
            <p>
              Bilgisayarlar isim yerine sayı (adres) kullanır. Adresi bulmak için rehberlere sorulur: biri bilmiyorsa
              “şuna sor” der, zincir asıl bilen rehbere (sahibine) kadar gider. Cevap geri dönerken herkes defterine yazar. İkinci
              seferde defterde olduğu için zincir hiç dolaşılmaz, bu yüzden hızlıdır.
            </p>
          }
          checklist={[
            "Bilgisayarlar isim değil sayı (adres) ile çalışır",
            "Rehberler zincir hâlinde: ‘bilmiyorum, şuna sor’",
            "Cevap defterde (cache) saklanır, ikinci seferde hızlıdır",
          ]}
        />
        <TermCard
          terms={[
            { term: "DNS", plain: "İnternetin telefon rehberi", heard: "Bu bir DNS sorunu olabilir" },
            { term: "Resolver", plain: "Senin adına zinciri dolaşan görevli", heard: "Resolver 1.1.1.1’e bak" },
            { term: "Authoritative", plain: "Bilginin GERÇEK sahibi rehber", heard: "Authoritative sunucuda kayıt yok" },
            { term: "Cache", plain: "Öğrendiğini deftere yazmak", heard: "DNS cache’i temizle" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Kayıt türleri ve TTL" question="Rehberde sadece ‘isim → adres’ mi yazıyor? Ya e-postalar? Ya taşınma günü?">
        <Story>
          <p>
            Rehberde farklı türde satırlar var: adres (A), takma ad (CNAME), e-postalar nereye gidecek (MX), not/kanıt (TXT),
            asıl rehber kim (NS). Her satırın bir <b>TTL</b>’si var: “bu bilgiyi şu kadar süre doğru kabul et”.
          </p>
        </Story>
        <Try title="Satırlara tıkla, TTL’yi oynat">
          <DnsRecords />
        </Try>
        <Predict
          question="Sunucunu başka yere taşıyacaksın. TTL’yi taşımadan ÖNCE ne yapmak mantıklı?"
          options={[
            { label: "Çok uzun yap (ucuz olsun)" },
            { label: "Kısa yap, taşıdıktan sonra tekrar uzat", right: true },
          ]}
          reveal={
            <p>
              Kısa TTL ile taşındıktan sonra eski adresi hatırlayan defterler çabuk yenilenir. İş bitince tekrar uzatırsın
              (daha az sorgu = daha ucuz). Bu, DevOps’un klasik taşınma hilesi.
            </p>
          }
        />
        <TeachBack
          prompt="TTL kısa olursa ve uzun olursa ne kazanıp ne kaybederim?"
          hints={["taze", "bayat", "çok soru", "ucuz"]}
          model={
            <p>
              Kısa TTL: bilgi taze kalır, değişiklik hızlı yayılır ama herkes sık sık yeniden sorar, bu da maliyet. Uzun TTL:
              sorgu az, ucuz ama değişiklik geç yayılır, bir süre bayat adrese gidilir. Yani tazelik ile maliyet arasında takas var.
            </p>
          }
          checklist={[
            "Kısa TTL = taze ama çok sorgu",
            "Uzun TTL = ucuz ama bayat bilgi riski",
            "Bu bir takas: ikisi birden olmaz",
          ]}
        />
        <TermCard
          terms={[
            { term: "A / AAAA", plain: "İsim → adres (eski / yeni tür)", heard: "A kaydını yeni IP’ye çevir" },
            { term: "CNAME", plain: "Takma ad, başkasına yönlendir", heard: "www bir CNAME" },
            { term: "MX / TXT", plain: "E-posta yönlendirme / yetki notu", heard: "SPF için TXT ekle" },
            { term: "TTL", plain: "Bilginin raf ömrü", heard: "TTL’yi 60’a düşür" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="Oda anahtarı (DHCP)" question="Wi‑Fi’ya bağlandım. 192.168.0.103 adresini bana kim verdi?">
        <Story>
          <p>
            Otele girdin. Resepsiyona “boş oda var mı?” diye sorarsın. 4 mesajlık bir konuşma: <b>D</b>iscover, <b>O</b>ffer,
            <b>R</b>equest, <b>A</b>cknowledge (DORA). Sonunda oda anahtarı elinde: bir IP, süreli.
          </p>
        </Story>
        <Try title="Otele gir">
          <DhcpDora />
        </Try>
        <TeachBack
          prompt="Neden adresi kendim seçmiyorum da biri bana veriyor? Otel benzetmesiyle anlat."
          hints={["resepsiyon", "boş oda", "çakışma", "süreli"]}
          model={
            <p>
              Herkes kendi adresini seçse iki kişi aynı adresi seçip çakışırdı, tıpkı iki misafire aynı oda anahtarını vermek
              gibi. Bu yüzden ağda bir “resepsiyon” (router) boş adresleri takip edip bana süreli bir tanesini verir; süre dolunca
              yenilerim.
            </p>
          }
          checklist={[
            "Herkes kendi seçerse çakışma olur",
            "Bir merkez (router) boş adresleri takip edip dağıtır",
            "Adres süreli verilir (lease), yenilenir",
          ]}
        />
        <TermCard
          terms={[
            { term: "DHCP", plain: "Otomatik adres dağıtan resepsiyon", heard: "DHCP’den IP alamıyor" },
            { term: "Lease", plain: "Adresin kira süresi", heard: "Lease süresi dolmuş" },
            { term: "IP conflict", plain: "İki cihaza aynı adres verilmiş", heard: "IP çakışması var" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="Yolun haritası" question="Paket hedefe giderken hangi duraklardan geçiyor? Yavaşlama nerede?">
        <Story>
          <p>
            Her paketin üstünde bir <b>ömür sayacı</b> var (TTL). Her router sayacı 1 azaltır; sıfır olunca paketi atar ve
            göndericiye “zamanın doldu” der. Bunu kasten kullanırsan yolun haritasını çıkarırsın: önce ömrü 1 ver (ilk router
            cevap verir), sonra 2 (ikincisi)… Buna <b>traceroute</b> denir. Ping ise tek bir “orada mısın?” sorusu.
          </p>
        </Story>
        <Try title="Ömrü ayarla ya da otomatik çalıştır">
          <PingTrace />
        </Try>
        <Predict
          question="Ömrü 3 olan paket nerede ölür?"
          options={[
            { label: "Hedef sunucuda" },
            { label: "3. router’da, ‘zamanın doldu’ cevabı gelir", right: true },
          ]}
          reveal={<p>Her durak sayacı 1 azaltır; 3. durakta sıfır olur. Cevap veren o router’ın adresi haritanın 3. noktası olur.</p>}
        />
        <Econ>
          <p>
            Bu bir <b>tedarik zinciri</b>: ürün (paket) birçok aktörün elinden geçer ve her halka gecikme ekler. Yavaşlığı
            bulmak için zincirin hangi halkasında süre sıçradığına bakarsın, toplam süreye değil.
          </p>
        </Econ>
        <TeachBack
          prompt="traceroute yolu nasıl çıkarıyor? Ömür sayacıyla anlat."
          hints={["ömür sayacı", "sıfır olunca", "zamanın doldu", "1, 2, 3 diye"]}
          model={
            <p>
              Her paketin bir ömür sayacı var ve her router onu 1 azaltıyor; sıfır olunca router paketi atıp “zamanın doldu”
              diye haber veriyor. Önce ömrü 1, sonra 2, sonra 3 vererek gönderiyorum; her seferinde bir sonraki router cevap
              veriyor ve böylece yolun duraklarını sırayla öğreniyorum.
            </p>
          }
          checklist={[
            "Paketin ömür sayacı var, her router azaltır",
            "Sıfır olunca router ‘zamanın doldu’ der",
            "Ömrü 1, 2, 3… artırarak duraklar sırayla ortaya çıkar",
          ]}
        />
        <TermCard
          terms={[
            { term: "ICMP", plain: "Ağın ‘durum bildirim’ mesajları", heard: "ICMP’yi firewall engelliyor" },
            { term: "TTL (paket)", plain: "Paketin ömür sayacı", heard: "TTL doldu" },
            { term: "Hop", plain: "Bir router durağı", heard: "7 hop uzaklıkta" },
            { term: "Latency / RTT", plain: "Gidiş-dönüş süresi", heard: "Latency yüksek" },
          ]}
        />
      </Chapter>

      <Chapter n={5} title="Güven (TLS)" question="Karşıdaki sunucunun gerçekten o site olduğunu nereden biliyorum?">
        <Story>
          <p>
            Banka sitesine girdin. Ama araya biri girip “ben bankayım” dese? Çözüm: site sana bir <b>kimlik kartı</b> (sertifika)
            gösterir ve o kartı güvendiğin bir <b>noter</b> (CA) onaylamıştır. Tarayıcı 3 şeyi kontrol eder: isim, tarih, imza.
            Sonra iki taraf kimsenin duymadığı bir gizli anahtar üretir ve bundan sonrası <b>mühürlü zarf</b>.
          </p>
        </Story>
        <Try title="Bozuk sertifika senaryolarını dene">
          <TlsCheck />
        </Try>
        <Econ>
          <p>
            <b>Asimetrik bilgi (Akerlof, “limon pazarı”):</b> satıcı malı bilir, alıcı bilmez; güven olmazsa pazar çöker.
            Çözüm: <b>güvenilir üçüncü taraf</b>. Sertifika otoritesi (CA) tam bu rolde: iki yabancıya “bu satıcı gerçek” diye
            kefil olur. Kefilin itibarı bozulursa tüm sistem çöker, o yüzden tarayıcılar hangi CA’ya güveneceğini sıkı seçer.
          </p>
        </Econ>
        <TeachBack
          prompt="Sertifika neden var? Tanımadığın bir satıcıdan alışveriş yaparken kefilin rolüyle anlat."
          hints={["kimlik kartı", "noter", "sahte", "mühürlü zarf"]}
          model={
            <p>
              Karşımdaki gerçekten iddia ettiği site mi bilmek istiyorum. Site bana kimlik kartı gösteriyor ve o kartı
              güvendiğim bir noter onaylamış; isim, tarih ve imzayı kontrol ediyorum. Uyuyorsa gizli bir anahtar üretip bundan
              sonra her şeyi mühürlü zarfla konuşuyoruz. Böylece ne taklitçi araya girebilir ne de dinleyen içeriği okuyabilir.
            </p>
          }
          checklist={[
            "Amaç: karşıdaki gerçekten o mu?",
            "Kimlik kartı + güvenilir noter (CA) onayı",
            "Sonrasında şifreli (mühürlü) konuşma",
          ]}
        />
        <TermCard
          terms={[
            { term: "TLS / HTTPS", plain: "Doğrulama + mühürlü zarf", heard: "HTTPS zorunlu olsun" },
            { term: "Sertifika", plain: "Sitenin kimlik kartı", heard: "Sertifika süresi dolmuş" },
            { term: "CA", plain: "Kimliği onaylayan noter", heard: "Let’s Encrypt’ten aldık" },
          ]}
        />
        <Deeper title="Gizli anahtarı kimse duymadan nasıl üretiyorlar?">
          <p className="text-sm">
            Boya karıştırma benzetmesi: ikiniz de herkesin bildiği bir sarı boyayla başlarsınız. Her biri kendi gizli rengini ekler,
            karışımı karşıya yollar (yolda görünen karışım hangi gizli renkten geldiği çıkarılamaz). Sonra her biri aldığı karışıma
            KENDİ gizli rengini ekler: ikiniz de aynı final rengi elde edersiniz, dinleyen edemez. Gerçekte renk yerine matematik
            (Diffie‑Hellman) kullanılır.
          </p>
        </Deeper>
      </Chapter>

      <Chapter n={6} title="Dinleme" question="Kafedeki Wi‑Fi’da biri benim ne yaptığımı görebilir mi?">
        <Story>
          <p>
            Aynı Wi‑Fi’daki herkes aynı “havayı” paylaşır. Şifresiz (http) mektuplar <b>açık kartpostal</b> gibidir: yoldaki
            herkes okur. Şifreli (https) mektup <b>mühürlü zarf</b>: dışında sadece kime gittiği yazar.
          </p>
        </Story>
        <Try title="Sahte veriyle farkı gör (simülasyon)">
          <Sniffer />
        </Try>
        <Predict
          question="HTTPS ile dinleyen ne göremez?"
          options={[
            { label: "Hangi sunucuyla konuştuğunu" },
            { label: "Şifreyi ve mesaj içeriğini", right: true },
          ]}
          reveal={<p>İçerik şifreli. Dinleyen çoğunlukla sadece ‘kiminle konuşuyor’ ve ‘ne kadar veri’ bilgisini görür.</p>}
        />
        <TeachBack
          prompt="Kafede neden ‘https’ gördüğüne bakmalısın? Kartpostal ve zarf ile anlat."
          hints={["kartpostal", "zarf", "aynı Wi‑Fi", "şifre"]}
          model={
            <p>
              Kafede herkes aynı ağda olduğu için şifresiz trafik açık kartpostal gibi: şifreni ve oturumunu yoldaki biri
              okuyabilir. https ise mühürlü zarf; dinleyen sadece zarfın dışını görür, içindekini okuyamaz.
            </p>
          }
          checklist={[
            "Aynı ağdaki biri trafiği görebilir",
            "http açık kartpostal, içerik okunur",
            "https mühürlü zarf, içerik okunamaz",
          ]}
        />
        <TermCard
          terms={[
            { term: "Sniffing", plain: "Ağdaki trafiği dinlemek", heard: "Wireshark ile paketlere baktım" },
            { term: "Plaintext", plain: "Şifresiz düz metin", heard: "Şifre plaintext gidiyor!" },
            { term: "MITM", plain: "Ortadaki adam", heard: "Public Wi‑Fi’da MITM riski" },
          ]}
        />
      </Chapter>

      <Chapter n={7} title="Kapılar (firewall)" question="Yeni bir sunucuyu internete açtım. Hangi kapılar kime açık olmalı?">
        <Story>
          <p>
            Sunucuda numaralı kapılar (port) var. <b>Firewall</b> kapıdaki güvenlik görevlisi: “bu kapıdan kim girebilir?” listesi.
            İlk akla gelen “hepsi herkese açık olsun”, çünkü kolay. Ama internette otomatik botlar yeni açılan sunucuları dakikalar
            içinde tarar.
          </p>
        </Story>
        <Try title="Kuralları sen yaz">
          <FirewallGame />
        </Try>
        <Predict
          question="Veritabanı portunu (5432) 0.0.0.0/0’a (herkese) açmak ne demek?"
          options={[
            { label: "Sadece uygulamam erişir" },
            { label: "İnternetteki HERKES bağlanmayı deneyebilir", right: true },
          ]}
          reveal={<p>0.0.0.0/0 = “tüm internet”. Şifre zayıfsa veya açık varsa veritabanın dışarıdadır. Bu, gerçek hayatta çok sık görülen bir hata.</p>}
        />
        <TeachBack
          prompt="‘En az yetki’ ilkesini ve neden 443’ü kapatmadığımızı anlat."
          hints={["en dar yetki", "saldırı yüzeyi", "müşteri girebilmeli"]}
          model={
            <p>
              Her açık kapı olası bir riski büyütür, bu yüzden her kapıyı sadece ihtiyacı olana açarım: veritabanını sadece
              uygulamaya, SSH’ı sadece yöneticiye. Ama 443’ü kapatamam çünkü müşteriler siteye girebilmeli; güvenlik ile
              erişilebilirlik arasında denge kuruyorum.
            </p>
          }
          checklist={[
            "Her açık kapı saldırı yüzeyini büyütür",
            "Kapıyı sadece ihtiyacı olana aç (en az yetki)",
            "Web portu herkese açık olmalı: güvenlik ↔ erişilebilirlik dengesi",
          ]}
        />
        <TermCard
          terms={[
            { term: "Firewall", plain: "Kapıdaki güvenlik görevlisi listesi", heard: "Security group’u kontrol et" },
            { term: "0.0.0.0/0", plain: "Tüm internet", heard: "Neden 0.0.0.0/0’a açık?" },
            { term: "Least privilege", plain: "En dar yetki", heard: "Least privilege’a uymuyor" },
          ]}
        />
      </Chapter>

      <Chapter n={8} title="Hepsi bir arada" question="Garson Enter’a bastığı an, yukarıdakilerin hepsi hangi sırayla ve ne kadar sürede gerçekleşiyor?">
        <Story>
          <p>
            Bugüne kadar öğrendiğin her şey tek bir sırada: <b>IP al → router’ı bul → ismi çöz → el sıkış → kimliği doğrula → iste → indir</b>.
            Aşağıda bu sırayı oynat; her adımın süresi renkli bir çubuk. Gün 4’te DevTools’taki Timing çubuğunu hatırla.
          </p>
        </Story>
        <Try title="Enter’a bas">
          <EnterJourney />
        </Try>
        <TeachBack
          prompt="‘Garson Enter’a bastı’ dan ‘sayfa geldi’ye kadar olan her adımı kendi sözlerinle sırala."
          hints={["adres al", "rehber", "el sıkışma", "kimlik kartı", "mutfak", "cevap"]}
          model={
            <p>
              Önce Wi‑Fi’dan bir adres aldım ve router’ın kapısını öğrendim. Sonra rehberlere sorup sitenin adresini buldum.
              Taahhütlü mektup el sıkışmasıyla bağlantı kurdum, sertifikayı doğrulayıp mühürlü konuşmaya geçtim. İsteği
              yolladım, sunucu mutfakta hazırladı (bekleme), cevap geri aktı. Hepsi yüzlerce milisaniyede oldu.
            </p>
          }
          checklist={[
            "Adres + router (DHCP/ARP)",
            "İsim → adres (DNS)",
            "Bağlantı + güven (TCP + TLS)",
            "İstek → bekleme → cevap (HTTP)",
          ]}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "Müşteri ‘siteye girilmiyor’ diyor. curl “Could not resolve host” diyor (exit 6). Önce nereye bakarsın?",
              options: ["Sunucunun CPU’suna", "DNS kaydına (isim çözülemiyor)", "Veritabanına"],
              answer: 1,
              explain: "İsim adrese çevrilemediği için daha bağlanmaya bile gelinmedi: rehber (DNS) sorunu.",
            },
            {
              q: "Tarayıcı ‘Bağlantınız gizli değil’ diyor ve sertifika tarihi geçmiş. Hangi kontrol kaldı?",
              options: ["İsim kontrolü", "Tarih kontrolü", "Port kontrolü"],
              answer: 1,
              explain: "Kimlik kartının süresi bitmiş. Sertifikayı yenilemek gerekir (Let’s Encrypt’te otomatik).",
            },
            {
              q: "Redis sunucusu 6379 portunda 0.0.0.0/0’a açık. En doğru düzeltme?",
              options: ["Portu değiştir", "Sadece uygulama sunucusunun IP’sine izin ver", "Şifreyi uzat ve açık bırak"],
              answer: 1,
              explain: "En az yetki: iş yapması gereken tek kaynağa izin ver. Şifre ikinci savunma hattıdır, birincisi değil.",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Kendi bilgisayarında dene:{" "}
        <Link href="/tutorial/6/teknik" className="underline">
          Gün 6 — Teknik sayfa (terminal görevleri, “kır” görevleri, cheat sheet) →
        </Link>
      </p>
    </TutorialShell>
  );
}
