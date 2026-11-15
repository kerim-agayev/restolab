import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Deeper, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { Note, TutorialShell } from "@/components/tutorial/TutorialShell";
import { BranchSim, DeployOrder, LedgerSim, MigrationLab, SafeOrDangerous } from "./Sims";

export const metadata: Metadata = { title: "Gün 15 — Tabloyu canlıdayken nasıl değiştiririz? | RestoLab" };

export default function Day15() {
  return (
    <TutorialShell day={15}>
      <Econ>
        <p>
          Dün defterin <b>hesap planını</b> kurduk: üç tablo. Ama işletme büyür: restorana telefon, sonra vergi numarası, sonra kampanya bilgisi
          lazım olur. Restoran açıkken, içeride müşteri varken binayı yıkıp yeniden yapamazsın. Bugünün sorusu: <b>çalışan bir sistemin tablolarını
          bozmadan nasıl değiştiririz?</b> Bugün control_db’ye gerçek bir değişiklik yapacaksın, hem de kendi elinle.
        </p>
      </Econ>

      <Chapter n={1} title="Dünden 3 soru" question="Gün 14’ten aklında ne kaldı?">
        <Quiz
          questions={[
            {
              q: "Rol (OWNER / WAITER) neden users tablosunda değil de memberships’te duruyor?",
              options: ["Daha hızlı olsun diye", "Rol kişiye değil kişi + restoran çiftine ait: Leyla bir yerde sahip, diğerinde müdür", "Prisma öyle istediği için"],
              answer: 1,
              explain: "İş sözleşmesi benzetmesi: pozisyon işçinin değil sözleşmenin özelliği.",
            },
            {
              q: "Çalışanı olan restoranı silmek istedik (onDelete: Restrict). Ne olur?",
              options: ["Restoran ve çalışanların sözleşmeleri silinir", "Veritabanı reddeder (23001): önce sözleşmeler kapatılmalı", "Restoran silinir, sözleşmeler sahipsiz kalır"],
              answer: 1,
              explain: "Restrict = bağlı satır varken silme. Cascade olsaydı sözleşmeler de silinirdi.",
            },
            {
              q: "memberships’teki @@unique([userId, restaurantId]) neyi engelliyor?",
              options: ["Bir kişinin iki restoranda çalışmasını", "Aynı kişinin aynı restoranda iki sözleşmesi olmasını", "Bir restoranda iki kişi olmasını"],
              answer: 1,
              explain: "Leyla iki restoranda olabilir; ama Dolma Evi’nde iki kez olamaz (23505).",
            },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Binanın tadilat defteri" question="Bir veritabanının yapısı adım adım nasıl değişir, ve kim takip eder?">
        <Story>
          <p>
            Restoranın binası açık. Mutfağa bir kapı açmak istiyorsun. Mimar her değişikliği <b>numaralı bir tadilat projesine</b> yazar: 001 temeli at,
            002 mutfağa kapı aç, 003 teras ekle. Projeler <b>sırayla</b> uygulanır. Binanın girişinde bir <b>defter</b> durur: “001 ✅, 002 ✅”. Yeni bir
            bina (yeni bir restoranın veritabanı) kurulacaksa aynı projeler aynı sırayla uygulanır ve aynı bina çıkar.
          </p>
        </Story>
        <Try title="Projeleri uygula, sırayı bozmayı dene, sonra ustayı serbest bırak">
          <LedgerSim />
        </Try>
        <Predict
          question="Gün 14’ün proje klasörünün adı 20261115100250_init_users_restaurants. Baştaki uzun sayı ne?"
          options={[
            { label: "Rastgele bir kimlik numarası" },
            { label: "Oluşturulduğu an (2026-11-15 10:02:50 UTC): adlar alfabetik sıralanınca projeler tarih sırasına girer", right: true },
            { label: "Dosyanın boyutu" },
          ]}
          reveal={
            <p>
              Yıl-ay-gün-saat-dakika-saniye. Sayı başta olduğu için klasörler alfabetik sıralandığında <b>uygulanma sırası</b> da kendiliğinden doğru olur.
              Bugünkü projenin adı da aynı kalıpta: <code>20261115115828_add_restaurant_phone</code>.
            </p>
          }
        />
        <Predict
          question="Gün 14’ün migration.sql dosyasında FOREIGN KEY’ler en sonda, ayrı ALTER TABLE komutlarıyla eklenmiş. Neden?"
          options={[
            { label: "Prisma’nın alışkanlığı, fark etmez" },
            { label: "memberships, users’ı gösteriyor: gösterilen tablo henüz yoksa kural kurulamaz. Önce bütün tablolar, sonra aralarındaki bağlar", right: true },
          ]}
          reveal={
            <p>
              Hesap planı benzetmesi: “bu fiş 100 numaralı hesabı gösterir” kuralını, 100 numaralı hesap açılmadan koyamazsın. Önce odalar, sonra aralarındaki
              kapılar.
            </p>
          }
        />
        <TeachBack
          prompt="Migration nedir ve veritabanındaki ‘defter’ neden var? Tadilat benzetmesiyle anlat."
          hints={["numaralı proje", "sırayla", "defter", "yeni bina aynı çıkar"]}
          model={
            <p>
              Migration, veritabanının yapısını değiştiren numaralı bir tadilat projesi. Projeler git’te durur ve sırayla uygulanır. Veritabanının içinde hangi
              projelerin uygulandığını yazan bir defter (_prisma_migrations) var; böylece hangi projenin eksik olduğu bilinir ve yeni bir veritabanı aynı
              projelerle aynı hâle getirilebilir.
            </p>
          }
          checklist={["Migration = numaralı değişiklik dosyası", "Sırayla uygulanır", "Defter: hangisi uygulandı", "Her yerde aynı sonuç"]}
        />
        <TermCard
          terms={[
            { term: "Migration", plain: "Veritabanı yapısını değiştiren numaralı SQL dosyası", heard: "Migration oluşturdum, PR’da" },
            { term: "Migration history (_prisma_migrations)", plain: "Veritabanının içindeki tadilat defteri", heard: "Migration tablosuna bak, uygulanmış mı" },
            { term: "Schema as code", plain: "Tablo yapısının da kod gibi git’te tutulması", heard: "Şema değişikliği de review’dan geçer" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="Kendi elinle: mutfağa kapı aç" question="Bekleyen bir tadilat projesini gerçek veritabanına nasıl uygularız?">
        <Story>
          <p>
            Claude 002 numaralı projeyi <b>yazdı ama uygulamadı</b>: restoranlara <code>phone</code> sütunu. Önce defteri oku. Bekleyen bir proje
            görmelisin. Sonra projeyi sen uygulayacaksın ve defteri tekrar okuyacaksın.
          </p>
        </Story>
        <Try title="1) Defteri oku → 2) terminalde uygula → 3) defteri tekrar oku">
          <ol className="mb-3 list-decimal space-y-2 pl-5 text-sm">
            <li>
              Aşağıdaki <b>“Defteri ve klasörü karşılaştır”</b> butonuna bas. 🟡 sarı kutu ve <code>20261115115828_add_restaurant_phone</code> yanında 🟡 görmelisin.
            </li>
            <li>
              VS Code → <b>Terminal → New Terminal</b>. Şunu yaz (sadece okur, değiştirmez):
              <pre className="mt-1 overflow-x-auto rounded bg-zinc-950 p-2 text-xs text-emerald-300">pnpm --filter web exec prisma migrate status</pre>
              Beklenen: <code>Following migration have not yet been applied: 20261115115828_add_restaurant_phone</code>
            </li>
            <li>
              Şimdi uygula (bu control_db’yi <b>değiştirir</b>; sadece boş bir sütun ekler, hiçbir veri silinmez):
              <pre className="mt-1 overflow-x-auto rounded bg-zinc-950 p-2 text-xs text-emerald-300">pnpm --filter web exec prisma migrate deploy</pre>
              Beklenen: <code>Applying migration `20261115115828_add_restaurant_phone`</code> ve <code>All migrations have been successfully applied.</code>
            </li>
            <li>Butona tekrar bas: iki proje de ✅, yeşil kutu “Çizim ile bina aynı”.</li>
          </ol>
          <MigrationLab />
        </Try>
        <Note icon="🔎">
          <p>
            Uygulamadan önce Gün 14 sayfasında “Dolma Evi’ni sil” butonunu denersen, beklenen 23001 yerine <b>P2022 · restaurants.phone does not exist</b>{" "}
            görürsün. Bu branch’in kodu yeni sütunu tanıyor, veritabanında ise sütun henüz yok. Bölüm 4’ün konusu tam olarak bu. Uyguladıktan sonra tekrar dene:
            23001 geri gelir.
          </p>
        </Note>
        <TermCard
          terms={[
            { term: "Pending migration", plain: "Klasörde var, veritabanında uygulanmamış proje", heard: "Bekleyen migration var, deploy etmedik" },
            { term: "prisma migrate dev", plain: "Geliştirici bilgisayarında: şemadan yeni proje üret (+ uygula)", heard: "migrate dev ile migration üret" },
            { term: "prisma migrate deploy", plain: "Gerçek ortamda: sadece bekleyen projeleri sırayla uygula", heard: "CI’da migrate deploy çalışıyor" },
          ]}
        />
      </Chapter>

      <Chapter n={4} title="Güvenli tadilat, tehlikeli tadilat" question="Hangi değişiklik çalışan sistemi bozar?">
        <Story>
          <p>
            Tadilat sırasında restoran <b>açık</b>: eski kod hâlâ çalışıyor, garsonlar sipariş giriyor. İyi bir tadilat, eski kod hâlâ çalışırken yapılabilen
            tadilattır. Ekonomideki <b>geçiş dönemi</b> gibi: yeni vergi kuralı gelir ama bir süre eski formlar da kabul edilir, herkes alışınca eski form
            kaldırılır.
          </p>
        </Story>
        <Try title="Her değişiklik için: güvenli mi, tehlikeli mi?">
          <SafeOrDangerous />
        </Try>
        <Try title="Önce kod mu, önce veritabanı mı? Adım adım ilerlet">
          <DeployOrder />
        </Try>
        <Predict
          question="Yukarıdaki gerçek lab’da “Sütun adını değiştir (name → title)” butonuna basarsan ne olur?"
          options={[
            { label: "Sorun olmaz, Prisma otomatik uyum sağlar" },
            { label: "Çalışan kod hâlâ ‘name’ diye sorar → anında hata (42703)", right: true },
          ]}
          reveal={
            <p>
              Bölüm 3’teki lab’da dene: P2022 / 42703 göreceksin, sonra her şey geri alınır. Gerçekte isim değişikliği <b>iki adımda</b> yapılır: önce yeni sütunu
              ekle ve kodu iki yere birden yazdır (expand), herkes yeni sütuna geçince eskisini sil (contract).
            </p>
          }
        />
        <TeachBack
          prompt="Neden önce veritabanını, sonra kodu değiştiriyoruz? phone örneğiyle anlat."
          hints={["eski kod", "boş sütun", "yeni kod sorar", "hata"]}
          model={
            <p>
              Önce sütunu boş bırakılabilir olarak eklersek eski kod onu bilmez ve çalışmaya devam eder. Sonra yeni kod yayınlanır ve sütunu kullanır. Tersini
              yaparsak yeni kod var olmayan sütunu sorar ve her istek hata verir. Güvenli değişiklik, eski kod çalışırken yapılabilen değişikliktir.
            </p>
          }
          checklist={["Eski kod yeni sütunu umursamaz", "Yeni kod eksik sütunda çöker", "Sıra: veritabanı → kod", "Rename/drop iki adımda (expand → contract)"]}
        />
        <TermCard
          terms={[
            { term: "Backward compatible", plain: "Eski kod hâlâ çalışırken yapılabilen değişiklik", heard: "Bu migration backward compatible mı?" },
            { term: "Expand / contract", plain: "Önce yeniyi ekle, herkes geçince eskiyi kaldır", heard: "Rename’i expand-contract ile yapalım" },
            { term: "Zero-downtime migration", plain: "Sistemi durdurmadan yapılan tadilat", heard: "Downtime olmadan migrate etmemiz lazım" },
          ]}
        />
        <Deeper title="Gerçek sistemlerde bir tuzak daha: kilit (lock)">
          <p>
            Tablo değiştirilirken Postgres o tabloyu kısa bir süre <b>kilitler</b>. Okumalar ve yazmalar bekler. Bizim tablomuz 2 satır, kilit milisaniyeler sürüyor.
            Milyonlarca satırlık bir sipariş tablosunda bazı değişiklikler dakikalar sürebilir ve bütün restoranlar o sırada bekler. Bu yüzden lab’da{" "}
            <code>lock_timeout = 2s</code> var: “kilidi 2 saniyede alamazsan vazgeç”. Büyük şirketler migration’ları gece ve küçük adımlarla yapar.
          </p>
        </Deeper>
      </Chapter>

      <Chapter n={5} title="Plansız usta: drift" question="Biri veritabanında elle değişiklik yaparsa ne olur?">
        <Story>
          <p>
            Acil bir gece, biri SQL Editor’e girip elle bir sütun ekliyor: “sonra migration’ını yazarım”. Yazmıyor. Artık çizimler (git’teki projeler) ile bina
            (veritabanı) <b>farklı</b>. Yeni bir restoranın veritabanı projelerle kurulduğunda o sütun olmayacak; bir restoranda çalışan kod diğerinde çökecek.
            Clopos gibi her restoranın ayrı veritabanı olan bir sistemde bu çok tehlikeli: <b>yüzlerce bina, her biri biraz farklı</b>.
          </p>
        </Story>
        <Try title="Bölüm 3’teki lab’a dön: “😈 Plansız sütun ekle (wifi_password)” butonuna bas">
          <p className="text-sm">
            Sonuçta <code>extraInDb: restaurants.wifi_password</code> göreceksin: veritabanında var, şemada yok. Endpoint bunu deneme içinde tespit edip geri
            alıyor. Gerçekte bu sütun orada kalırdı ve bir sonraki <code>prisma migrate dev</code> “drift detected” diyerek durur ve veritabanını sıfırlamayı
            teklif ederdi.
          </p>
        </Try>
        <Predict
          question="Drift’i önlemenin en iyi yolu hangisi?"
          options={[
            { label: "Herkes dikkatli olsun" },
            { label: "Şema değişiklikleri SADECE migration dosyasıyla ve PR’dan geçerek yapılır; canlı veritabanına elle şema değişikliği yasak", right: true },
            { label: "Her gece veritabanını silip baştan kurmak" },
          ]}
          reveal={
            <p>
              Muhasebedeki kural gibi: kayıt sadece fişle girilir, deftere elle düzeltme yapılmaz. Hata varsa <b>ters kayıt</b> fişi kesilir. Veritabanında da
              düzeltme yeni bir migration’dır.
            </p>
          }
        />
        <TermCard
          terms={[
            { term: "Schema drift", plain: "Veritabanının gerçek hâli ile migration’ların tarif ettiği hâlin farklı olması", heard: "Prod’da drift var, biri elle alter yapmış" },
            { term: "prisma db push", plain: "Şemayı defter tutmadan doğrudan veritabanına basmak (sadece deneme için)", heard: "db push yapma, migrate kullan" },
            { term: "migrate reset", plain: "Veritabanını silip bütün projeleri baştan uygulamak (veri gider!)", heard: "Local’de reset at, temiz başla" },
          ]}
        />
      </Chapter>

      <Chapter n={6} title="Kopya bina: Neon branch" question="Tehlikeli bir tadilatı gerçek restoranları riske atmadan nasıl deneriz?">
        <Story>
          <p>
            Clopos’ta her PR’ın kendi <b>preview ortamı</b> var: kod önce orada denenir. Ama bütün preview’lar <b>aynı</b> veritabanına bağlıysa, bir PR’ın
            tadilatı herkesi etkiler. Bugün bunu yaşadık: bu branch’in kodu <code>phone</code>’u istiyordu, production veritabanında yoktu. Çözüm:
            veritabanının da kopyası. Neon buna <b>branch</b> diyor, git branch’i gibi: production’dan saniyeler içinde bir kopya.
          </p>
        </Story>
        <Try title="Kopya aç, kopyayı kır, gerçeğe bak">
          <BranchSim />
        </Try>
        <Note icon="🧪">
          <p>
            Bunu Neon konsolunda gerçekten yapacaksın (silme dahil, tamamen güvenli):{" "}
            <Link href="/tutorial/15/teknik" className="underline">
              Teknik sayfa → Bölüm 3
            </Link>
            . İleride (Gün 71) her PR için kopya otomatik açılacak.
          </p>
        </Note>
        <TermCard
          terms={[
            { term: "Database branch (Neon)", plain: "Veritabanının anında açılan kopyası", heard: "PR için Neon branch açtım" },
            { term: "Copy-on-write", plain: "Değişene kadar aynı veriyi paylaş, değişince ayır", heard: "Branch copy-on-write, yer kaplamaz" },
            { term: "Preview database", plain: "PR’a özel veritabanı", heard: "Preview DB’de migration’ı test et" },
          ]}
        />
        <Note icon="🤖">
          <p>
            <i>“Migration oluşturdum”</i> → <code>prisma/migrations/</code> altına yeni bir SQL dosyası yazdı. <i>“Migrate deploy çalıştır”</i> → bekleyen dosyaları
            veritabanına uygula. <i>“Drift detected, reset?”</i> → veritabanı ile dosyalar uyuşmuyor; <b>production’da asla ‘evet’ deme</b> (veri silinir).{" "}
            <i>“Bu migration backward compatible değil”</i> → çalışan kodu bozar, iki adıma böl.
          </p>
        </Note>
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🗣️ Final: bütün günü anlat</h2>
        <TeachBack
          prompt="Yeni bir developer canlı veritabanına SQL Editor’den elle sütun eklemek istiyor. Ona migration, sıra, güvenli değişiklik, drift ve Neon branch’i anlatarak doğru yolu göster."
          hints={["numaralı dosya", "PR", "önce veritabanı", "boş bırakılabilir", "defter", "kopyada dene"]}
          model={
            <p>
              Elle değişiklik yaparsan veritabanı git’teki migration’lardan sapar (drift) ve başka bir ortamda aynı sonuç çıkmaz. Doğrusu: değişikliği schema.prisma’ya
              yaz, migration dosyası üret, PR’da incelensin. Önce bir Neon branch’inde dene. Değişiklik eski kodu bozmamalı (örneğin boş bırakılabilir sütun); önce
              veritabanına <code>migrate deploy</code> ile uygulanır, sonra kod yayınlanır. Veritabanındaki defter hangi projelerin uygulandığını tutar.
            </p>
          }
          checklist={["Elle değişiklik → drift", "Migration dosyası + PR", "Önce kopyada dene", "Güvenli değişiklik, önce DB sonra kod", "Defter (_prisma_migrations)"]}
        />
      </section>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "prisma migrate status “1 migration have not yet been applied” diyor. Bu ne demek?",
              options: ["Veritabanı bozuk", "Klasörde var ama veritabanında henüz uygulanmamış bir proje var", "Migration dosyası silinmiş"],
              answer: 1,
              explain: "Pending migration. Gerçek ortamda migrate deploy ile uygulanır.",
            },
            {
              q: "Yeni kod yayınlandı, her istek “column restaurants.phone does not exist” veriyor. En olası sebep?",
              options: ["Neon çöktü", "Kod yayınlandı ama migration veritabanına uygulanmadı (sıra yanlış)", "CORS"],
              answer: 1,
              explain: "Kod veritabanından önde. Sıra: önce migrate deploy, sonra kod.",
            },
            {
              q: "Sütunun adını name’den title’a değiştirmenin güvenli yolu?",
              options: ["Tek migration’da RENAME", "Yeni sütunu ekle, iki yere yaz, kodu taşı, en son eskiyi sil", "Gece kimse yokken RENAME"],
              answer: 1,
              explain: "Expand → contract. Her adımda çalışan kod bozulmaz.",
            },
          ]}
        />
      </section>

      <section className="space-y-2 rounded-2xl border border-zinc-300 p-4 text-sm dark:border-zinc-700">
        <h2 className="text-lg font-bold">👀 UI’da ne görmelisin?</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Bölüm 3 → “Defteri karşılaştır” (deploy’dan ÖNCE): 🟡 sarı kutu, <code>add_restaurant_phone</code> yanında 🟡.</li>
          <li>Terminal → <code>prisma migrate deploy</code> → “All migrations have been successfully applied.”</li>
          <li>Tekrar karşılaştır: iki proje ✅, yeşil kutu “Çizim ile bina aynı”.</li>
          <li>“Plansız sütun” → <code>extraInDb: restaurants.wifi_password</code>. “Sütun adını değiştir” → <code>42703</code>. “NOT NULL” → <code>23502</code>.</li>
          <li>Neon → Branches → <code>day-15-deneme</code> açıp sildikten sonra production’da hâlâ 3 tablo + 5 üyelik.</li>
        </ul>
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Terminal komutları, Neon branch adımları, migration dosyası okuma ve cheat sheet:{" "}
        <Link href="/tutorial/15/teknik" className="underline">
          Gün 15 — Teknik sayfa →
        </Link>
      </p>
    </TutorialShell>
  );
}
