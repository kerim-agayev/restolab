import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { ConnectionAnatomy, ControlPlane, DbLab, DialectGame, PoolSim } from "./Sims";

export const metadata: Metadata = { title: "Gün 13 — Veri nerede yaşıyor? PostgreSQL ve Neon | RestoLab" };

export default function Day13() {
  return (
    <TutorialShell day={13}>
      <Econ>
        <p>
          Modül 2 başlıyor: yolun sonundaki <b>kasa ve arşiv</b>. Bir işletmede satış ekranı değişebilir, ama defterler (muhasebe kayıtları) kalıcıdır
          ve en sıkı korunan yerdir. Veritabanı uygulamanın defteridir. Bugün: defter nerede, nasıl kapısını çalarız, kapıda kalabalık olursa ne olur ve
          çok şubeli bir holding defterlerini nasıl düzenler.
        </p>
      </Econ>

      <Chapter n={1} title="Aynı dil, farklı lehçe" question="MSSQL biliyorum. PostgreSQL bambaşka bir şey mi?">
        <Story>
          <p>
            SQL bir dil, MSSQL ve PostgreSQL onun iki <b>lehçesi</b>: İstanbul Türkçesi ile Bakı Türkçesi gibi. %90’ı aynı (<code>SELECT</code>,{" "}
            <code>JOIN</code>, <code>GROUP BY</code>, window function), birkaç kelime farklı. Biz Postgres seçtik çünkü ücretsiz, açık kaynak ve bulutta
            çok yaygın. <b>Neon</b> ise Postgres’i bulutta “serverless” çalıştıran bir şirket: boşta uyutur, kullanınca uyandırır, saniyede kopyasını
            (branch) çıkarır.
          </p>
        </Story>
        <Try title="MSSQL hâlini oku, Postgres hâlini tahmin et">
          <DialectGame />
        </Try>
        <TermCard
          terms={[
            { term: "PostgreSQL (Postgres)", plain: "Açık kaynak ilişkisel veritabanı", heard: "Postgres’te LIMIT kullan" },
            { term: "SQL dialect", plain: "SQL’in veritabanına göre lehçesi", heard: "Bu T-SQL syntax’ı, Postgres’te çalışmaz" },
            { term: "Serverless DB (Neon)", plain: "Boşta uyuyan, kullanınca uyanan veritabanı", heard: "Neon compute uyuyordu, cold start" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Arşivin adresi ve anahtarı" question="Uygulama veritabanını nereden buluyor ve neden bu bilgi bir sır?">
        <Story>
          <p>
            Uygulamanın veritabanına ulaşması için tek bir satır yeter: <b>bağlantı adresi</b> (connection string). İçinde hem <b>adres</b> (hangi
            sunucu, hangi port, hangi defter) hem <b>anahtar</b> (kullanıcı + şifre) var. Anahtar içerdiği için bütün satır bir <b>sır</b>tır: git’e
            girmez, sadece senin bilgisayarında (<code>.env.local</code>) ve sunucunun panelinde (Vercel → Environment Variables) durur.
          </p>
        </Story>
        <Try title="Adresin parçalarına tıkla">
          <ConnectionAnatomy />
        </Try>
        <Predict
          question="Gerçek bağlantı adresini .env.example dosyasına yazıp push etseydik ne olurdu?"
          options={[{ label: "Sorun olmaz, sadece bir örnek dosya" }, { label: "Repo herkese açık: herkes veritabanına girebilir, şifre hemen değiştirilmeli", right: true }]}
          reveal={
            <p>
              <code>.env.example</code> git’e giren bir <b>şablon</b>: içinde sadece değişken adları ve sahte değerler olur. Gerçek değerler{" "}
              <code>.env.local</code>’e (git görmezden gelir) yazılır. Botlar GitHub’daki sızmış şifreleri dakikalar içinde bulur. Sızarsa tek doğru
              hareket: şifreyi hemen <b>değiştirmek</b> (rotate), commit’i silmek yetmez. (Bugün tam bu durumu yakaladık: dosya commit’lenmeden düzeltildi.)
            </p>
          }
        />
        <TeachBack
          prompt="Bağlantı adresinde hangi bilgiler var ve neden .env.example’a değil .env.local’e yazılır?"
          hints={["adres", "port", "defter adı", "şifre", "şablon", "git"]}
          model={
            <p>
              Bağlantı adresi veritabanının yerini (host, port, veritabanı adı) ve giriş anahtarını (kullanıcı, şifre) içerir; ayrıca TLS ayarını. Şifre
              içerdiği için gizlidir. .env.example herkesin göreceği bir şablondur, gerçek değer içermez; gerçek değer sadece git’in görmediği
              .env.local’de ve sunucunun panelinde durur.
            </p>
          }
          checklist={["Adres + anahtar (kullanıcı/şifre) birlikte", "Şifre içerdiği için tüm satır gizli", ".env.example = şablon (git’te), .env.local = gerçek (git’te değil)"]}
        />
        <TermCard
          terms={[
            { term: "Connection string", plain: "Veritabanının adresi + anahtarı", heard: "Connection string’i env’e koy" },
            { term: ".env.local / secret", plain: "Git’e girmeyen gerçek değerler", heard: "Secret’ı repoya pushlama!" },
            { term: "Rotate", plain: "Sızan şifreyi değiştirmek", heard: "Key sızdı, rotate et" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="Kapıyı çal" question="Gerçekten bağlanınca ne oluyor ve hata mesajları ne anlatıyor?">
        <Story>
          <p>
            Bu sitenin <code>/api/tutorial/db</code> adresi Neon’daki <code>control_db</code>’ye bağlanıp birkaç şey soruyor: Postgres sürümü, hangi
            veritabanı, saat. Sonra üç “kır” butonu: yanlış şifre, olmayan veritabanı, olmayan host. Her hata farklı bir katmandan geliyor; Gün 12’deki
            teşhis sorusu yine geçerli: <b>hangi katmanda?</b>
          </p>
        </Story>
        <Try title="Gerçek veritabanı (Neon, Frankfurt)">
          <DbLab />
        </Try>
        <Predict
          question="‘Olmayan host’ hatası (ENOTFOUND) hangi günün konusu?"
          options={[{ label: "Gün 6: DNS (isim adrese çevrilemedi)", right: true }, { label: "Gün 16: şifreler" }]}
          reveal={
            <p>
              <code>ENOTFOUND</code> = isim çözülemedi, daha veritabanına gitmedik bile. <code>28P01</code> = kapıya vardık, anahtar yanlış.{" "}
              <code>3D000</code> = içeri girdik, istediğimiz defter yok. Üç hata, üç farklı katman.
            </p>
          }
        />
        <TeachBack
          prompt="ENOTFOUND, 28P01 ve 3D000’u bir arşiv binasına gitme hikâyesiyle sırala."
          hints={["adres bulunamadı", "anahtar yanlış", "defter yok"]}
          model={
            <p>
              ENOTFOUND: binanın adresini bulamadım, yola bile çıkamadım (DNS). 28P01: binaya vardım ama anahtarım uymadı (şifre). 3D000: içeri girdim ama
              istediğim defter arşivde yok (veritabanı adı). Hata kodu, yolun neresinde takıldığımı söyler.
            </p>
          }
          checklist={["ENOTFOUND = adres/DNS", "28P01 = şifre/kimlik", "3D000 = veritabanı yok"]}
        />
        <TermCard
          terms={[
            { term: "SQLSTATE (28P01, 3D000)", plain: "Postgres’in standart hata kodları", heard: "28P01 alıyorum, şifre yanlış" },
            { term: "Cold start", plain: "Uyuyan servisin uyanma gecikmesi", heard: "İlk istek cold start’tan yavaş" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="Kapıda kalabalık" question="Kampanya akşamı 80 istek aynı anda gelirse veritabanı ne yapar?">
        <Story>
          <p>
            Veritabanının aynı anda açık tutabileceği <b>hat</b> (bağlantı) sayısı sınırlı. Vercel gibi serverless ortamlarda her istek ayrı bir
            fonksiyon olabilir ve her biri kendi hattını açmaya çalışır. Çözüm: araya bir <b>santral</b> koymak (connection pooler, Neon’da{" "}
            <b>PgBouncer</b>). Santral az sayıda gerçek hattı sırayla paylaştırır. Neon’un adresindeki <code>-pooler</code> kelimesi tam bu.
          </p>
        </Story>
        <Try title="İstek sayısını artır, santrali aç/kapat">
          <PoolSim />
        </Try>
        <Econ>
          <p>
            <b>Kıt kaynağın paylaşımı</b> (Gün 5’teki NAT gibi): hat pahalı ve sınırlı; her müşteriye ayrı hat tahsis etmek yerine ortak havuzdan dönüşümlü
            kullanım. Bir bankada her müşteriye ayrı gişe açmak yerine sıra numaralı birkaç gişe.
          </p>
        </Econ>
        <TeachBack
          prompt="Neden iki adresimiz var: DATABASE_URL (pooled) ve DATABASE_URL_UNPOOLED (direkt)?"
          hints={["santral", "çok istek", "hat sınırı", "migration"]}
          model={
            <p>
              Uygulamanın normal istekleri çok ve kısa; santralli (pooled) adresle gider ki veritabanının hat sınırı dolmasın. Direkt adres ise veritabanıyla
              uzun ve özel konuşmalar için (ör. tabloyu değiştiren migration’lar, Gün 15); santral bazı özel komutları taşıyamaz.
            </p>
          }
          checklist={["Hat (bağlantı) sayısı sınırlı", "Pooled: çok sayıda kısa istek için santral", "Direkt: migration gibi özel işler için"]}
        />
        <TermCard
          terms={[
            { term: "Connection pool / pooler", plain: "Hatları paylaştıran santral", heard: "Pooled URL kullan, connection limit doluyor" },
            { term: "PgBouncer", plain: "Postgres’in yaygın santral yazılımı", heard: "PgBouncer transaction mode’da" },
            { term: "max_connections", plain: "Veritabanının hat sınırı", heard: "too many connections hatası" },
          ]}
        />
      </Chapter>

      <Chapter n={5} title="Holdingin merkez sicili" question="Her restoranın ayrı veritabanı varsa, hangisinin nerede olduğunu kim biliyor?">
        <Story>
          <p>
            Clopos her restoran için ayrı bir veritabanı (defter) açıyor. Peki bir istek geldiğinde doğru deftere nasıl gidilir? Bir <b>merkez sicil</b>{" "}
            lazım: “hangi restoran → hangi defter, hangi release kanalı”. Buna <b>control plane</b> denir; bizimkinin adı <code>control_db</code>. Restoranların
            kendi verileri (siparişler, menü) ise <b>data plane</b>: kendi defterlerinde.
          </p>
        </Story>
        <Try title="Bir restoran seç, isteğin yolunu gör">
          <ControlPlane />
        </Try>
        <TeachBack
          prompt="Control plane ile data plane farkını holding ve şube defterleri ile anlat."
          hints={["merkez sicil", "hangi defter", "şube defteri", "karışmaz"]}
          model={
            <p>
              Control plane holdingin merkez sicili: hangi şubenin defteri nerede, hangi kanalda. Data plane ise her şubenin kendi defteri, asıl işlemler orada.
              İstek önce merkez sicile sorar, sonra doğru şubenin defterine gider; böylece şubelerin verisi birbirine karışmaz.
            </p>
          }
          checklist={["Control plane = merkez sicil (hangi tenant nerede)", "Data plane = tenant’ın kendi verisi", "İstek önce sicile, sonra doğru deftere"]}
        />
        <TermCard
          terms={[
            { term: "Control plane / data plane", plain: "Merkez sicil / şube defterleri", heard: "Tenant mapping control plane’de" },
            { term: "Tenant", plain: "Sistemi kullanan müşteri (restoran)", heard: "Tenant başına ayrı DB" },
          ]}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "MSSQL’deki ‘SELECT TOP 5 * FROM Orders’ Postgres’te nasıl yazılır?",
              options: ["SELECT TOP 5 * FROM orders", "SELECT * FROM orders LIMIT 5", "SELECT FIRST 5 FROM orders"],
              answer: 1,
              explain: "Postgres’te LIMIT sonda.",
            },
            {
              q: "Preview’da /api/tutorial/db ‘DATABASE_URL tanımlı değil’ diyor, local’de çalışıyor. Sebep?",
              options: ["Neon çöktü", "Değişken Vercel paneline eklenmedi (ya da eklendi ama redeploy edilmedi)", "Kod yanlış"],
              answer: 1,
              explain: ".env.local sadece senin bilgisayarında. Vercel’in kendi panelinde ayrıca tanımlanmalı (Gün 1’deki RELEASE_CHANNEL dersi).",
            },
            {
              q: "Kampanya akşamı ‘too many connections’ hatası. İlk bakılacak yer?",
              options: ["Pooled (santralli) adres mi kullanılıyor?", "Ekran kartı", "CORS ayarı"],
              answer: 0,
              explain: "Serverless’ta her fonksiyon hat açar; pooler hatları paylaştırır.",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Neon konsolu, SQL Editor ve Vercel’e değişken ekleme adımları:{" "}
        <Link href="/tutorial/13/teknik" className="underline">
          Gün 13 — Teknik sayfa →
        </Link>
      </p>
    </TutorialShell>
  );
}
