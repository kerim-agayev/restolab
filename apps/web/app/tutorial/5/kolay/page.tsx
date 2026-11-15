import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Deeper, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { Delivery, KargoBox, PlazaDoors, SameStreet, StreetShout, Switchboard } from "./Sims";

export const metadata: Metadata = { title: "Gün 5 (Sade Anlatım) — Paket nasıl yolculuk eder? | RestoLab" };

const toc = [
  "Mektup ve kutular",
  "Aynı sokak mı?",
  "Sokağa bağırmak",
  "Şirket santrali",
  "Plaza ve ofisler",
  "Taahhütlü mektup",
];

export default function Day5Easy() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-4 pb-24 sm:p-8">
      <header className="space-y-3">
        <Link href="/tutorial/5" className="text-sm underline">
          ← Teknik versiyon (Gün 5)
        </Link>
        <p className="text-sm text-zinc-500">Gün 5 · Sade Anlatım</p>
        <h1 className="text-3xl font-bold">Bir mesaj internette nasıl yolculuk eder?</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ezber yok. Her bölümde aynı 4 adım: <b>hikâye → dokun → kendi cümlenle anlat → en son teknik adı</b>. Bölümler
          tek tek açılır, acele etme.
        </p>
        <nav className="flex flex-wrap gap-2 text-sm">
          {toc.map((t, i) => (
            <a key={t} href={`#b${i + 1}`} className="rounded-full border border-zinc-300 px-3 py-1 dark:border-zinc-700">
              {i + 1}. {t}
            </a>
          ))}
        </nav>
        <Econ>
          <p>
            Ekonomide bir malın üreticiden tüketiciye gitmesini düşün: <b>tedarik zinciri</b>. Mal ambalajlanır, depodan
            depoya gider, her aktör sadece kendi etiketine bakar. İnternet de aynı: mal = senin mesajın, depolar = router’lar.
            Aşağıda sık sık bu zinciri hatırlatacağım.
          </p>
        </Econ>
      </header>

      <Chapter n={1} title="Mektup ve kutular" question="Bakü’deki laptopumdan Frankfurt’taki sunucuya bir sipariş nasıl gider?">
        <Story>
          <p>
            Garson “Masa 5: 2 çay, 1 dolma” yazdı. Bu bir <b>sipariş fişi</b>. Ama fiş tek başına Frankfurt’a gidemez; yolda
            birçok kişi taşıyacak ve herkes farklı bir şey bilir: biri şehri, biri sokağı, biri kapıyı.
          </p>
          <p>
            O yüzden fişi <b>kutuya</b>, kutuyu <b>daha büyük kutuya</b> koyarız. Her kutunun üstünde, onu taşıyacak kişinin
            okuyacağı bir etiket vardır.
          </p>
        </Story>
        <Try title="Kutuları sar, sonra karşıda aç">
          <KargoBox />
        </Try>
        <Predict
          question="Yoldaki bir postane (router) paketi taşırken içindeki sipariş fişini okur mu?"
          options={[
            { label: "Evet, her şeyi açar okur" },
            { label: "Hayır, sadece dıştaki şehir adresine bakar", right: true },
          ]}
          reveal={
            <p>
              Postane yalnızca <b>şehir adresi</b> katmanını okur ve paketi bir sonraki duraga yollar. Fiş içeride kapalı kalır.
              Bu yüzden herkes “kendi işine” bakar; tedarik zincirindeki gümrükçü sadece gümrük etiketine bakar gibi.
            </p>
          }
        />
        <TeachBack
          prompt="Neden mesajı tek bir yapıda göndermiyoruz da kutu içinde kutu yapıyoruz? Yeğenine anlat."
          hints={["fiş", "kutu", "etiket", "postane", "herkes kendi işine bakar"]}
          model={
            <p>
              Mesaj yolda birçok kişinin elinden geçiyor ve her birinin bilmesi gereken şey farklı. O yüzden fişi kutulara
              koyuyoruz, her kutunun etiketini sadece o etiketi okuması gereken kişi okuyor. Böylece postane fişi bilmek zorunda
              kalmıyor, mutfak da yolun nasıl gittiğini bilmek zorunda kalmıyor.
            </p>
          }
          checklist={[
            "Mesaj yolda birçok kişiden geçer",
            "Her kutunun etiketi farklı birine hitap eder",
            "Yoldaki kişiler içteki mesajı okumaz / bilmesi gerekmez",
          ]}
        />
        <TermCard
          terms={[
            { term: "Encapsulation", plain: "Mesajı katman katman kutulamak", heard: "Her katman kendi header’ını ekliyor" },
            { term: "Header", plain: "Kutunun üstündeki etiket", heard: "Header’a bakarsan hedef port yazıyor" },
            { term: "Router", plain: "Yoldaki postane", heard: "Paket şu router’da takılıyor" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Aynı sokak mı?" question="Laptop bir paketi kime direkt verir, kime postaneye bırakır?">
        <Story>
          <p>
            İnternet adresin (<b>IP</b>) iki parçadan oluşur: <b>sokak</b> ve <b>kapı numarası</b>. <b>192.168.0</b> sokağın adı,
            <b>.103</b> senin kapı numaran.
          </p>
          <p>
            Hedef aynı sokaktaysa elden götürürsün. Başka sokaktaysa postaneye (router) bırakırsın, o dağıtır.
          </p>
        </Story>
        <Try title="Her cihaz için karar ver">
          <SameStreet />
        </Try>
        <Econ>
          <p>
            Yerel pazar ile ihracat gibi: aynı şehirdeki müşteriye kendin teslim edersin, başka ülkeye ise <b>gümrük/kargo
            firması</b> üzerinden gidersin. Router bu “ihracat kapısı”dır.
          </p>
        </Econ>
        <TeachBack
          prompt="Laptopun, telefonuna ve Vercel sunucusuna giden paketleri neden farklı yoldan gönderdiğini anlat."
          hints={["sokak", "kapı numarası", "router", "aynı ağ"]}
          model={
            <p>
              Telefon ile laptop aynı sokakta (aynı ağda), o yüzden paketi direkt kapıya götürüyor. Vercel başka bir sokakta
              çok uzakta; laptop oraya kendisi gidemez, paketi evdeki postaneye (router) verir ve postane yönlendirir.
            </p>
          }
          checklist={[
            "IP’nin bir sokak (ağ) kısmı var",
            "Aynı sokaktakine direkt gidilir",
            "Başka sokağa giderken router’a verilir",
          ]}
        />
        <TermCard
          terms={[
            { term: "IP adresi", plain: "Cihazın adresi", heard: "Sunucunun IP’sini ver" },
            { term: "Subnet / CIDR (/24)", plain: "Sokağın büyüklüğü: ilk 3 sayı sokak", heard: "Bu servis 10.0.0.0/24 ağında" },
            { term: "Gateway", plain: "Sokaktan çıkış kapısı (router)", heard: "Default gateway yanlış girilmiş" },
          ]}
        />
        <Deeper title="/24 neden ‘ilk 3 sayı sokak’ demek?">
          <p className="text-sm">
            IP 4 sayıdan oluşur ve her sayı 8 bittir (toplam 32). /24 = ilk 24 bit (ilk 3 sayı) sokak, kalan 8 bit kapı
            numarası. Kalan 8 bit 256 kapı numarası verir (2 tanesi ayrılmış, 254 cihaz). Teknik sayfada bunu bit bit gösteren
            hesaplayıcı var.
          </p>
        </Deeper>
      </Chapter>

      <Chapter n={3} title="Sokağa bağırmak" question="Laptop, router’ın kapı etiketini nereden biliyor?">
        <Story>
          <p>
            Aynı sokakta kapıya götürmek için sadece IP yetmez; kapının fiziksel <b>etiketi</b> (<b>MAC</b>) lazım. Laptop bunu
            bilmiyorsa <b>sokağa bağırır</b>: “192.168.0.1 kimin?” Cevabı bir deftere yazar.
          </p>
          <p>Sorun: herkes duyar ve <b>herkes cevap verebilir</b>. Laptop kimin doğru söylediğini kontrol etmez.</p>
        </Story>
        <Try title="Bağır, sonra yalancı komşuyu aç">
          <StreetShout />
        </Try>
        <Predict
          question="Yalancı komşu aradaysa laptop internete hâlâ bağlanabilir mi?"
          options={[
            { label: "Hayır, bağlantı kopar" },
            { label: "Evet, hiçbir şey fark etmez — ama biri ortadan okur", right: true },
          ]}
          reveal={
            <p>
              Tehlike tam burada: bağlantı <b>çalışmaya devam eder</b>, o yüzden kimse fark etmez. Saldırgan trafiği kopyalayıp
              yoluna devam ettirir. Buna <b>ortadaki adam (MITM)</b> denir.
            </p>
          }
        />
        <TeachBack
          prompt="Sahte ‘benim’ cevabı neden sorun? Bağlantı koptuğu için mi, başka bir nedenle mi?"
          hints={["defter", "yalancı komşu", "ortadan okur", "fark etmez"]}
          model={
            <p>
              Laptop sokağa bağırıp ilk cevap vereni defterine yazıyor ve doğrulamıyor. Yalancı komşu “benim” derse laptop
              ona yolluyor, o da paketleri okuyup router’a iletiyor. İnternet çalıştığı için kimse fark etmiyor ama mesajlar
              ortadan okunuyor.
            </p>
          }
          checklist={[
            "Laptop cevabı doğrulamadan deftere yazıyor",
            "Bağlantı çalışmaya devam ediyor (fark edilmiyor)",
            "Komşu araya girip mesajı okuyor",
          ]}
        />
        <TermCard
          terms={[
            { term: "MAC adresi", plain: "Kapının fiziksel etiketi", heard: "MAC’i filtreledik" },
            { term: "ARP", plain: "“Bu IP kimin?” diye sokağa bağırma", heard: "ARP tablosuna bak" },
            { term: "ARP spoofing / MITM", plain: "Yalancı komşu, ortadaki adam", heard: "Public Wi‑Fi’da MITM riski var" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="Şirket santrali" question="Evdeki 5 cihaz tek internet numarasıyla nasıl çalışıyor?">
        <Story>
          <p>
            Şirketin dışarıya tek bir telefon numarası var. İçeride 50 kişi var. Dışarı arayan herkes <b>santral</b> üzerinden
            çıkar; santral deftere “dahili 40001 = Ahmet” yazar. Cevap gelince deftere bakıp Ahmet’e bağlar.
          </p>
          <p>Defterde karşılığı olmayan, kimseyi aramadan gelen çağrı → santral reddeder.</p>
        </Story>
        <Try title="Santrali çalıştır">
          <Switchboard />
        </Try>
        <Econ>
          <p>
            Bu, <b>kıt kaynağın paylaşımı</b>: dünyada az sayıda “dış numara” (public IPv4) var. Bir hanenin tek numarayı
            herkesle paylaşması, ortak kullanım (shared resource) gibi. Bedava yan fayda: dışarıdan gelen isteksiz çağrılar
            otomatik engelleniyor.
          </p>
        </Econ>
        <TeachBack
          prompt="ipconfig’te 192.168.0.103 görüyorum ama ifconfig.me başka bir IP gösteriyor. Neden?"
          hints={["santral", "dış numara", "dahili numara", "defter"]}
          model={
            <p>
              192.168.0.103 benim evin içindeki dahili numaram. İnternet beni evin tek dış numarasıyla görüyor, o numara
              router’ın (santralin). Router içerideki cihazları defterle eşleştirip cevabı doğru cihaza veriyor.
            </p>
          }
          checklist={[
            "İçerideki IP (private) ile dışarıdaki IP (public) farklı",
            "Dış IP router’ın",
            "Router bir defterle cevabı doğru cihaza veriyor",
          ]}
        />
        <TermCard
          terms={[
            { term: "Private IP", plain: "Evin içindeki dahili numara", heard: "Servis private IP’den erişiyor" },
            { term: "Public IP", plain: "Dışarıdan görünen tek numara", heard: "Public IP’yi whitelist’e ekle" },
            { term: "NAT", plain: "Santralin dahili ↔ dış çevirisi", heard: "NAT’in arkasındayız" },
          ]}
        />
      </Chapter>

      <Chapter n={5} title="Plaza ve ofisler" question="Aynı sunucuda web sitesi de veritabanı da nasıl yan yana çalışıyor?">
        <Story>
          <p>
            Sunucu bir <b>plaza</b>: tek adres (IP), içinde numaralı ofisler (<b>port</b>). 443 numaralı ofis web sitesi, 5432
            veritabanı. Paket adresin yanında hangi ofise gideceğini de taşır.
          </p>
          <p>Bir kapıyı çaldığında 3 şey olabilir: biri açar, “burada kimse yok” der, ya da hiç ses çıkmaz.</p>
        </Story>
        <Try title="Kapıları çal ve süreyi izle">
          <PlazaDoors />
        </Try>
        <Predict
          question="‘Kimse yok’ cevabı mı yoksa ‘hiç ses yok’ mu bir güvenlik görevlisinin varlığını gösterir?"
          options={[
            { label: "‘Kimse yok’ hızlı cevabı" },
            { label: "‘Hiç ses yok’ sessizliği", right: true },
          ]}
          reveal={
            <p>
              Sessizlik: bir güvenlik duvarı (firewall) soruyu yutuyor. Hızlı “yok” cevabı ise binanın açık olduğunu ve ofisin
              sadece boş olduğunu gösterir. Pentest’te port tarayıcısı (nmap) tam bu farkı okur: <b>closed</b> hızlı ret,{" "}
              <b>filtered</b> sessizlik.
            </p>
          }
        />
        <TeachBack
          prompt="curl’de ‘Connection refused’ ile ‘timed out’ arasındaki farkı plaza hikâyesiyle anlat."
          hints={["ofis", "hızlı ret", "sessizlik", "güvenlik görevlisi"]}
          model={
            <p>
              Refused: kapıyı çaldım, hemen “burada kimse yok” dediler. Sunucu ayakta, o program çalışmıyor. Timeout: hiç ses
              çıkmadı, bekleyip vazgeçtim; arada soruyu yutan bir güvenlik görevlisi (firewall) ya da ulaşılamayan bir adres
              olabilir.
            </p>
          }
          checklist={[
            "Refused = hızlı ve net ret, sunucu ayakta ama o port dinlenmiyor",
            "Timeout = sessizlik, cevap hiç gelmiyor",
            "Timeout’ta firewall veya erişilemeyen adres akla gelir",
          ]}
        />
        <TermCard
          terms={[
            { term: "Port", plain: "Plazadaki ofis numarası", heard: "Servis 3000 portunda dinliyor" },
            { term: "Connection refused (exit 7)", plain: "Hızlı ret: kimse dinlemiyor", heard: "Servis ayakta değil, port kapalı" },
            { term: "Timeout (exit 28)", plain: "Sessizlik: cevap yok", heard: "Security group portu kapatmış olabilir" },
          ]}
        />
        <Deeper title="EADDRINUSE nedir?">
          <p className="text-sm">
            Bir ofisi iki kişiye veremezsin. Aynı portta ikinci bir program dinlemeye çalışırsa işletim sistemi{" "}
            <span className="font-mono">EADDRINUSE</span> (adres zaten kullanımda) verir. “dev sunucu açılmıyor” hatasının
            en yaygın sebebi: önceki sunucu hâlâ açık. Teknik sayfada bunu terminalde kendin kırıyorsun.
          </p>
        </Deeper>
      </Chapter>

      <Chapter n={6} title="Taahhütlü mektup mu, canlı yayın mı?" question="İnternet her mesajı neden aynı güvenle taşımıyor?">
        <Story>
          <p>
            <b>Taahhütlü mektup</b> (TCP): önce “hazır mısın?” diye sorarsın, her parçaya imza alırsın, kayıp olursa tekrar
            gönderirsin. Yavaş ama eksiksiz.
          </p>
          <p>
            <b>Canlı yayın</b> (UDP): hızlı akıtırsın, kayıp parça beklemezsin. Hızlı ama bazı parçalar eksik olabilir.
          </p>
        </Story>
        <Try title="İkisini kayıpla dene">
          <Delivery />
        </Try>
        <Econ>
          <p>
            Bu bir <b>güvenilirlik ↔ hız takası</b> (trade-off). Sipariş ve ödeme eksik gelirse yıkım olur → mektup (TCP).
            Video görüşmede bir karenin kaybolması önemsiz, gecikme can sıkar → yayın (UDP).
          </p>
        </Econ>
        <TeachBack
          prompt="Ödeme için hangisini, video görüşme için hangisini seçersin ve neden?"
          hints={["eksiksiz", "hız", "tekrar gönderme", "bir kare kaybolsa"]}
          model={
            <p>
              Ödeme/sipariş eksik gelirse para ve sipariş karışır, bu yüzden her parça imzalanan, kaybolanın tekrar
              gönderildiği taahhütlü mektup (TCP) seçilir. Video görüşmede bir karenin kaybolması önemsiz, bekleme ise
              konuşmayı bozar; o yüzden hızlı yayın (UDP) tercih edilir.
            </p>
          }
          checklist={[
            "Ödeme/sipariş: eksiksiz olması şart → TCP",
            "Canlı video/ses: hız önemli, kayıp tolere edilir → UDP",
            "TCP kayıp parçayı tekrar gönderir, UDP göndermez",
          ]}
        />
        <TermCard
          terms={[
            { term: "TCP", plain: "Taahhütlü mektup: sıralı, eksiksiz", heard: "HTTP, veritabanı TCP üstünde" },
            { term: "UDP", plain: "Canlı yayın: hızlı, garantisiz", heard: "DNS ve video UDP kullanır" },
            { term: "Retransmission", plain: "Kayıp parçayı tekrar yollamak", heard: "Ağda çok retransmission var" },
          ]}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Final: hepsini bir cümlede anlat</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Garson “Mətbəxə göndər”e bastı. Bu mesajın Frankfurt’a gidip dönmesini, bu sayfadaki 6 fikri kullanarak anlat.
        </p>
        <TeachBack
          prompt="Garson butona bastığında paketin yolculuğunu baştan sona anlat."
          hints={["kutular", "sokak", "router", "sokağa bağırma", "santral", "port", "taahhütlü mektup"]}
          model={
            <p>
              Sipariş fişi kutulara sarılıyor. Laptop hedefin başka sokakta olduğunu görüp paketi router’a (postane) bırakıyor;
              kapı etiketini sokağa bağırarak öğrenmişti. Router santral gibi paketi kendi dış numarasıyla internete çıkarıyor
              ve deftere yazıyor. Frankfurt’taki sunucuda 443 numaralı ofis paketi alıyor; kutular dıştan içe açılıyor. Her
              parça taahhütlü mektup gibi imzalanıyor, kayıp olursa tekrar gönderiliyor. Cevap deftere bakılarak laptopa dönüyor.
            </p>
          }
          checklist={[
            "Mesaj kutulanıyor (encapsulation)",
            "Router’a bırakılıyor, NAT ile dışarı çıkıyor",
            "Sunucuda doğru port/program mesajı alıyor",
            "TCP eksiksiz teslimi sağlıyor",
            "Cevap NAT defteriyle doğru cihaza dönüyor",
          ]}
        />
        <Quiz
          questions={[
            {
              q: "Yeni bir sunucuya curl atıyorsun ve 2 saniyede ‘Connection refused’ alıyorsun. En olası durum?",
              options: [
                "Sunucu kapalı veya firewall her şeyi yutuyor",
                "Sunucu ayakta ama o portta kimse dinlemiyor",
                "İnternetin yok",
              ],
              answer: 1,
              explain: "Hızlı ret = ‘burada kimse yok’. Firewall olsaydı sessizlik (timeout) olurdu.",
            },
            {
              q: "Aynı evdeki laptop ve telefon neden internette aynı public IP’yle görünür?",
              options: ["Aynı cihaz oldukları için", "Router (NAT) hepsini tek dış numarayla çıkarıyor", "Aynı MAC’i paylaştıkları için"],
              answer: 1,
              explain: "Santral hikâyesi: tek dış numara, içeride dahili numaralar.",
            },
            {
              q: "Ödeme isteği için hangi taşıma tercih edilir?",
              options: ["UDP, çünkü hızlı", "TCP, çünkü eksiksiz ve sıralı", "Fark etmez"],
              answer: 1,
              explain: "Para söz konusuysa eksik parça kabul edilemez.",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Terminal görevleri (<span className="font-mono">ipconfig</span>, <span className="font-mono">arp -a</span>, EADDRINUSE,
        exit 7/28) ve simülatörler (subnet bit hesabı, nmap) için{" "}
        <Link href="/tutorial/5" className="underline">
          teknik Gün 5 sayfasına
        </Link>{" "}
        geç.
      </p>
    </main>
  );
}
