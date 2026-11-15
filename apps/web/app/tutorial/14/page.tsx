import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Deeper, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { Note, TutorialShell } from "@/components/tutorial/TutorialShell";
import { ErdDiagram, ErdLab, OneBigSheet, RelationPicker, SchemaToBoth } from "./Sims";

export const metadata: Metadata = { title: "Gün 14 — Veriyi hangi tablolara bölmeliyim? | RestoLab" };

export default function Day14() {
  return (
    <TutorialShell day={14}>
      <Econ>
        <p>
          Dün defterin <b>nerede</b> durduğunu gördük (Neon, control_db). Bugün defterin <b>içini</b> düzenliyoruz. Muhasebede ilk iş{" "}
          <b>hesap planı</b> çıkarmaktır: hangi bilgi hangi hesapta durur, fişlerde hesabın adı değil <b>kodu</b> yazılır (100 Kasa, 320 Satıcılar).
          Veritabanında bunun adı tablo tasarımı. Bugün control_db’nin ilk üç tablosunu kurduk: kişiler, restoranlar ve aralarındaki iş sözleşmeleri.
        </p>
      </Econ>

      <Chapter n={1} title="Tek büyük Excel neden yetmez?" question="Her şeyi tek bir tabloya yazsak ne kaybederiz?">
        <Story>
          <p>
            Küçük bir restoranda müdür her şeyi tek bir Excel sayfasına yazar: kim, hangi restoranda, restoranın telefonu, rolü. İlk ay harika çalışır.
            Sonra restoranın telefonu değişir. Restoranın adı ve telefonu her çalışan satırında <b>tekrar</b> yazıldığı için hepsini tek tek
            güncellemek gerekir. Biri unutulur ve tabloda artık iki farklı “gerçek” vardır.
          </p>
        </Story>
        <Try title="Telefonu tek satırda güncelle, sonra bölünmüş hâlini dene">
          <OneBigSheet />
        </Try>
        <Predict
          question="Tek büyük tabloda yeni bir restoran açıldı, ama henüz hiç çalışanı yok. Restoranı nereye yazarsın?"
          options={[
            { label: "Sorun değil, yeni satır eklerim" },
            { label: "Yazamam: her satır bir çalışan; çalışansız restoran için ‘Kişi’ sütunu boş kalır, tuhaf bir satır olur", right: true },
          ]}
          reveal={
            <p>
              Tek tabloda bir bilgiyi (restoran) kaydetmek için ilgisiz başka bir bilgiye (kişi) muhtaç olursun. Tersi de var: son garson işten ayrılınca
              satırını silersen restoranın telefonu da kaybolur. Çözüm hep aynı: <b>her bilgi kendi tablosunda, tek bir yerde</b>. Buna{" "}
              <b>normalization</b> denir.
            </p>
          }
        />
        <TeachBack
          prompt="Restoranın telefonunu neden çalışan satırlarına yazmamalıyız? Hesap planı benzetmesiyle anlat."
          hints={["tekrar", "tek yer", "unutulan satır", "hangisi doğru"]}
          model={
            <p>
              Aynı bilgi birçok yerde yazılırsa değiştiğinde hepsini güncellemen gerekir; biri unutulursa hangisinin doğru olduğu bilinmez. Muhasebede bir
              hesabın bilgisi hesap planında bir kez durur, fişler onu koduyla anar. Tabloda da restoranın telefonu sadece restoranlar tablosunda olur,
              çalışan satırı restoranı numarasıyla gösterir.
            </p>
          }
          checklist={["Tekrar = tutarsızlık riski", "Bilgi tek yerde durur", "Diğer tablolar ona numarayla bakar"]}
        />
        <TermCard
          terms={[
            { term: "Table (tablo)", plain: "Tek bir tür şeyin listesi: kişiler, restoranlar", heard: "users tablosuna bir kolon ekledim" },
            { term: "Redundancy / anomaly", plain: "Aynı bilginin tekrarı ve bunun yol açtığı tutarsızlık", heard: "Bu veri duplicate, anomaly çıkar" },
            { term: "Normalization", plain: "Her bilgiyi tek bir yerde tutacak şekilde tablolara bölmek", heard: "Şemayı normalize edelim" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Kimin kimle ilişkisi var?" question="Kişiler ve restoranlar nasıl birbirine bağlanır?">
        <Story>
          <p>
            Tabloları böldük, şimdi aralarındaki bağı tarif etmemiz gerek. Üç tür bağ var. <b>Bir–bir</b>: her restoranın tek vergi numarası.{" "}
            <b>Bir–çok</b>: bir restoranın çok masası, ama her masa tek bir restoranın. <b>Çok–çok</b>: Leyla iki restoranda çalışıyor ve bir restoranda
            çok kişi çalışıyor.
          </p>
        </Story>
        <Try title="Her çift için ilişki türünü seç">
          <RelationPicker />
        </Try>
        <Econ>
          <p>
            Çoka-çok ilişki tek başına bir tabloya sığmaz. Arada bir <b>sözleşme</b> gerekir. Emek piyasasını düşün: işçi ile firma arasında{" "}
            <b>iş sözleşmesi</b> vardır. Maaş ve pozisyon işçinin de firmanın da değil, <b>sözleşmenin</b> özelliğidir: Leyla Dolma Evi’nde sahip,
            Çay Bağı’nda müdür. Bizim <code>memberships</code> tablomuz tam olarak bu sözleşmeler defteri.
          </p>
        </Econ>
        <Predict
          question="Leyla’nın rolünü (OWNER) nereye yazmalıyız?"
          options={[
            { label: "users tablosuna, Leyla’nın satırına" },
            { label: "memberships tablosuna, Leyla–Dolma Evi sözleşmesine", right: true },
            { label: "restaurants tablosuna" },
          ]}
          reveal={
            <p>
              Leyla’nın satırına yazsaydık “sahip” mi “müdür” mü, ikisini aynı anda yazamazdık. Rol bir kişiye değil, bir <b>kişi + restoran</b> çiftine
              aittir. Gün 18’de “garson Z raporunu göremez” kuralı bu sütundan okunacak.
            </p>
          }
        />
        <TermCard
          terms={[
            { term: "One-to-many (1–N)", plain: "Bir tarafın çok, öbür tarafın tek karşılığı var", heard: "Restaurant has many tables" },
            { term: "Many-to-many (N–N)", plain: "İki yönde de ‘çok’", heard: "User–Restaurant many-to-many" },
            { term: "Join table", plain: "İki tabloyu bağlayan sözleşme tablosu", heard: "Araya bir join table koydum (memberships)" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="Çapraz referans: numarayla anmak" question="Bir tablo diğerindeki satırı nasıl gösterir ve bunu kim denetler?">
        <Story>
          <p>
            Muhasebe fişinde “Kasa hesabı” yazmazsın, <b>100</b> yazarsın. Kod sabittir, isim değişse bile fiş doğru kalır. Ve yazılım şunu denetler:{" "}
            <b>hesap planında olmayan bir kodla fiş kesilemez</b>. Veritabanında her satırın değişmeyen numarası <b>primary key</b>, başka tablodaki
            numarayı gösteren sütun <b>foreign key</b>. Bu kutulu çizimin adı da <b>ERD</b>.
          </p>
        </Story>
        <Try title="Bir alana tıkla, neyi gösterdiğini gör">
          <ErdDiagram />
        </Try>
        <Predict
          question="memberships’e restaurant_id = 999 olan bir satır eklemeye çalışırsak (böyle bir restoran yok) ne olur?"
          options={[
            { label: "Satır eklenir, ekranda boş restoran adı görünür" },
            { label: "Veritabanının kendisi reddeder: ‘foreign key constraint’ hatası", right: true },
            { label: "Uygulama çöker, site kapanır" },
          ]}
          reveal={
            <p>
              Kuralı biz kodda kontrol etmeyi unutsak bile <b>veritabanı</b> reddeder. Bu son savunma hattıdır: Gün 9’daki “sunucu ikinci kez kontrol eder”
              fikrinin bir kat daha derini. Hemen aşağıda gerçek veritabanında deneyeceksin.
            </p>
          }
        />
        <TermCard
          terms={[
            { term: "Primary key (PK)", plain: "Satırın değişmeyen kimlik numarası", heard: "id primary key, autoincrement" },
            { term: "Foreign key (FK)", plain: "Başka tablodaki bir satırın numarası + ‘gerçekten var olmalı’ kuralı", heard: "restaurant_id FK, restaurants.id’ye bakıyor" },
            { term: "ERD", plain: "Tabloları ve aralarındaki bağları gösteren kutulu çizim", heard: "Önce ERD’yi çizelim" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="Gerçek veritabanında kır" question="Kuralı çiğnemeye çalışınca veritabanı tam olarak ne der?">
        <Story>
          <p>
            Bu düğmeler Neon’daki gerçek <code>control_db</code>’ye gider. İçinde sahte iki restoran ve dört kişi var. Önce listeyi getir, sonra kuralları
            çiğnemeyi dene. Hiçbir şey bozulmaz: her deneme bitince bilerek geri alınıyor.
          </p>
        </Story>
        <Try title="Listele, sonra 5 denemeyi tek tek yap">
          <ErdLab />
        </Try>
        <Note icon="🔎">
          <p>
            Her kırmızı sonuçta “Ham cevabı göster”i aç ve <code>postgresCode</code> satırını bul. Üç kod var: <b>23503</b> (olmayan şeyi gösterdin),{" "}
            <b>23505</b> (bu zaten var), <b>23001</b> (bağlı satırlar varken silinmez). Developer loglarda bu sayıları görür.
          </p>
        </Note>
        <Deeper title="‘Geçerli’ denemede neden numara 11 çıktı? Tabloda sadece 5 satır var">
          <p>
            Numara sayacı (sequence) <b>geri alınmaz</b>. Geri alınan denemeler de numara “yakar”. Bu yüzden id’lerde boşluk olması normaldir. Muhasebe için
            önemli sonuç: <b>fiş/fatura numarasını id’den üretme</b>. Vergi kuralları boşluksuz ardışık numara ister; onun için ayrı, transaction içinde
            artan bir sayaç kullanılır (Gün 20+’da sipariş fişlerinde göreceğiz).
          </p>
        </Deeper>
        <TeachBack
          prompt="Foreign key ne işe yarar? ‘999 numaralı restoran’ denemesini anlatarak açıkla."
          hints={["numara", "gerçekten var mı", "veritabanı reddetti", "son savunma"]}
          model={
            <p>
              Foreign key bir sütunun başka tablodaki bir satırın numarası olduğunu ve o satırın gerçekten var olması gerektiğini söyler. 999 numaralı restoran
              olmadığı için veritabanı sözleşmeyi kaydetmedi ve 23503 hatası verdi. Kodda kontrol unutulsa bile veri tutarlı kalır.
            </p>
          }
          checklist={["FK = başka tablodaki numara", "Hedef satır var olmalı", "Kuralı veritabanı kendisi uygular (23503)"]}
        />
        <TermCard
          terms={[
            { term: "Constraint", plain: "Veritabanının kendisinin uyguladığı kural (FK, unique, not null)", heard: "Constraint’e takıldı" },
            { term: "FK violation (P2003 / 23503)", plain: "Var olmayan bir satırı gösterme denemesi", heard: "Foreign key constraint failed" },
            { term: "onDelete: Restrict / Cascade", plain: "Bağlı satır varken silmeyi engelle / bağlıları da sil", heard: "Cascade delete açık mı?" },
          ]}
        />
      </Chapter>

      <Chapter n={5} title="Prisma: tarifi bir kez yaz" question="Bu tabloları SQL ile mi yazdık, yoksa başka bir yolla mı?">
        <Story>
          <p>
            Dün SQL’i elle yazıp ham sürücüyle (<code>pg</code>) gönderdik. Bugün <b>Prisma</b> kullandık. Tabloları bir kez,{" "}
            <code>schema.prisma</code> dosyasında tarif ediyorsun. Prisma bu tariften iki şey üretiyor: veritabanı için <b>SQL</b> (tabloları kuran
            dosya) ve kod için <b>TypeScript</b> (editörün otomatik tamamladığı, yanlış alan adında kırmızı çizen client). Muhasebe yazılımı gibi:
            hesap planını bir kez tanımlarsın, defter de raporlar da ondan çıkar.
          </p>
        </Story>
        <Try title="Aynı tarifin üç yüzü">
          <SchemaToBoth />
        </Try>
        <Predict
          question="Prisma geldi. Dün kullandığımız pg sürücüsü ne oldu?"
          options={[{ label: "Silindi, artık gerek yok" }, { label: "Hâlâ altta çalışıyor: Prisma sorguyu SQL’e çevirip pg ile gönderiyor", right: true }]}
          reveal={
            <p>
              Prisma bir <b>tercüman</b>: senin yazdığın <code>prisma.restaurant.findMany()</code>’yi SQL’e çevirir, sonra Gün 13’teki aynı santralli
              bağlantıdan gönderir. Bağlantı adresi, havuz ve cold start dersleri aynen geçerli. Bu katmana <b>ORM</b> denir.
            </p>
          }
        />
        <TermCard
          terms={[
            { term: "ORM", plain: "Kodla veritabanı arasındaki tercüman", heard: "ORM olarak Prisma kullanıyoruz" },
            { term: "schema.prisma", plain: "Tabloların tek tarif dosyası", heard: "Schema’ya relation ekledim" },
            { term: "Prisma Client", plain: "Şemadan üretilen, tipli sorgu kodu", heard: "prisma generate çalıştır, client güncellensin" },
          ]}
        />
        <Note icon="🤖">
          <p>
            <i>“Schema’ya relation ekledim”</i> → schema.prisma’ya iki model arasında <code>@relation</code> yazdı (FK). <i>“Foreign key constraint
            failed”</i> → var olmayan bir id’yi gösterdi. <i>“prisma generate çalıştır”</i> → şema değişti, TypeScript client yeniden üretilsin.{" "}
            <i>“Migration oluşturdum”</i> → şemadan SQL dosyası üretti. Bunu yarın (Gün 15) açacağız.
          </p>
        </Note>
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🗣️ Final: bütün günü anlat</h2>
        <TeachBack
          prompt="Bir arkadaşın ‘kişileri ve restoranları tek Excel’de tutsak olmaz mı?’ diye soruyor. Bugünkü üç tabloyu ve foreign key’i kullanarak ikna et."
          hints={["tek yer", "sözleşme tablosu", "rol sözleşmede", "numarayla anmak", "veritabanı reddeder"]}
          model={
            <p>
              Tek tabloda restoranın bilgileri her çalışan satırında tekrar eder; biri değişince hepsini güncellemek gerekir, unutulan satır tutarsızlık
              yaratır. Bu yüzden kişiler ve restoranlar ayrı tablolarda, her bilgi bir kez durur. Bir kişi çok restoranda, bir restoranda çok kişi olduğu için
              arada iş sözleşmesi tablosu (memberships) var; rol de orada. Sözleşme kişiyi ve restoranı numarasıyla (foreign key) anar. Olmayan bir numara
              yazılmaya çalışılırsa veritabanı kendisi reddeder.
            </p>
          }
          checklist={["Tekrar → anomali", "Üç tablo: users, restaurants, memberships", "Rol sözleşmede", "FK = numarayla anmak + var olmalı"]}
        />
      </section>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "Restoranın adı 5 çalışan satırında tekrar yazılıyor. Ad değişti, 4 satır güncellendi. Bu sorunun adı?",
              options: ["Cold start", "Güncelleme anomalisi (normalization eksik)", "CORS"],
              answer: 1,
              explain: "Aynı bilgi birçok yerde → biri unutulunca tutarsızlık. Çözüm: bilgi tek tabloda, diğerleri numarayla anar.",
            },
            {
              q: "Sipariş ↔ Menü kalemi ilişkisi nasıl kurulur?",
              options: ["orders tablosuna menu_item_id sütunu", "Arada order_items tablosu (çoka-çok)", "Hiç ilişki gerekmez"],
              answer: 1,
              explain: "Bir siparişte çok yemek, bir yemek çok siparişte. Adet ve o anki fiyat arada, fiş satırında durur.",
            },
            {
              q: "Logda ‘P2003 Foreign key constraint violated … memberships_restaurant_id_fkey’ var. Ne oldu?",
              options: ["Veritabanına bağlanılamadı", "Var olmayan bir restorana üyelik yazılmaya çalışıldı", "Aynı e-posta iki kez kaydedildi"],
              answer: 1,
              explain: "P2003 / 23503 = FK ihlali. Constraint adı hangi sütun olduğunu söylüyor: restaurant_id. Aynı e-posta olsaydı P2002 / 23505 olurdu.",
            },
          ]}
        />
      </section>

      <section className="space-y-2 rounded-2xl border border-zinc-300 p-4 text-sm dark:border-zinc-700">
        <h2 className="text-lg font-bold">👀 UI’da ne görmelisin?</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Bölüm 4 → “Restoranları getir”: <b>Dolma Evi</b> (3 kişi) ve <b>Çay Bağı</b> (2 kişi), Leyla iki kutuda sarı.
          </li>
          <li>“999 numaralı restorana ekle” → kırmızı kutu, ham cevapta <code>&quot;postgresCode&quot;: &quot;23503&quot;</code>, HTTP 422.</li>
          <li>“İkinci kez ekle” → HTTP 409, <code>23505</code>. “Dolma Evi’ni sil” → <code>23001</code>.</li>
          <li>Neon → SQL Editor → <code>select * from memberships;</code> → hâlâ 5 satır (denemeler geri alındı).</li>
        </ul>
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Prisma dosyaları, komutlar, SQL Editor’de JOIN ve hata kodu tablosu:{" "}
        <Link href="/tutorial/14/teknik" className="underline">
          Gün 14 — Teknik sayfa →
        </Link>
      </p>
    </TutorialShell>
  );
}
