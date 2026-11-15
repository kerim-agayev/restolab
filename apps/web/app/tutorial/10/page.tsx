import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Deeper, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { BillSplit, FloatTrap, MidnightShift, VatRounding } from "./Sims";

export const metadata: Metadata = { title: "Gün 10 — Para neden float olmaz, gece yarısı neden kayar? | RestoLab" };

export default function Day10() {
  return (
    <TutorialShell day={10}>
      <Econ>
        <p>
          Bugün senin sahan: <b>muhasebe</b>. Bir restoranın sistemi “yaklaşık” hesaplayamaz: Z raporu kasadaki parayla, fiş vergi
          bildirimiyle qəpiği qəpiğine tutmalı. Ama bilgisayarın en sık kullandığı sayı türü (float) qəpikleri <b>yaklaşık</b> tutar.
          Bugün bunun neden olduğunu ve şirketlerin nasıl çözdüğünü göreceksin.
        </p>
      </Econ>

      <Chapter n={1} title="Kasiyerin hesap makinesi yalan söylüyor" question="0.1 + 0.2 neden 0.3 değil?">
        <Story>
          <p>
            Ondalık sistemde <b>1/3</b>’ü tam yazamazsın: 0.3333… sonsuza gider, bir yerde kesersin. Bilgisayar sayıları <b>ikilik</b> (0 ve 1)
            sistemde tutar ve orada da <b>1/10</b> (0.1) tam yazılamaz. Bilgisayar 0.1’i “çok yakın ama tam değil” bir sayıyla saklar. Tek
            seferde fark görünmez, ama binlerce işlemde küsuratlar <b>birikir</b>.
          </p>
        </Story>
        <Try title="Gün boyu çay sat, iki kasiyeri karşılaştır">
          <FloatTrap />
        </Try>
        <Predict
          question="Çözüm ne olabilir?"
          options={[{ label: "Daha hassas float kullanmak" }, { label: "Parayı en küçük birimde (qəpik) tam sayı olarak saymak", right: true }]}
          reveal={
            <p>
              Tam sayılar bilgisayarda <b>kesin</b> tutulur. 1 AZN yerine 100 qəpik saklarsın: toplama, çıkarma hep kesin. Sadece ekranda
              gösterirken 100’e bölüp “1.00 ₼” yazarsın. Kodda bunu <code>price_minor</code> (en küçük birim) adıyla görürsün. Veritabanında
              alternatif: <code>numeric/decimal</code> tipi (MSSQL’deki <code>decimal(18,2)</code> gibi).
            </p>
          }
        />
        <TeachBack
          prompt="Bir junior’a ‘para neden float’ta tutulmaz’ı anlat. 1/3 örneğini kullan."
          hints={["1/3", "tam yazılamaz", "küsurat birikir", "qəpik", "tam sayı"]}
          model={
            <p>
              Ondalıkta 1/3’ü tam yazamadığımız gibi bilgisayar da 0.1’i tam yazamaz, çok yakın bir sayı saklar. Tek işlemde fark görünmez ama
              binlerce işlemde küsuratlar birikip raporu bozar. Bu yüzden parayı en küçük birimde, qəpik olarak tam sayıyla tutarız; sadece
              gösterirken AZN’e çeviririz.
            </p>
          }
          checklist={["0.1 ikilik sistemde tam yazılamaz (1/3 gibi)", "Hatalar birikir (çok işlemde büyür)", "Çözüm: qəpik/tam sayı (veya decimal)"]}
        />
        <TermCard
          terms={[
            { term: "Floating point (float/double)", plain: "Yaklaşık ondalık sayı", heard: "Para float’ta tutulmuş, yuvarlama hatası var" },
            { term: "Minor units (price_minor)", plain: "En küçük birimde tam sayı (qəpik)", heard: "Fiyatları minor unit’e çevirdim" },
            { term: "Decimal / numeric", plain: "Veritabanının kesin ondalık tipi", heard: "Kolon tipi numeric(12,2)" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Hesabı bölmek ve kayıp qəpik" question="100 AZN’lik hesabı 3 arkadaş bölünce 1 qəpik nereye gidiyor?">
        <Story>
          <p>
            100 / 3 = 33.333… Herkese 33.33 yazarsan toplam 99.99 olur: <b>1 qəpik kayıp</b>. Restoran bunu ya cebinden öder ya da kasa açık
            verir. Doğru yöntem: önce herkese eşit tam payı ver (33.33), artan qəpikleri sırayla dağıt (biri 33.34 öder). Toplam her zaman
            kuruşu kuruşuna tutar.
          </p>
        </Story>
        <Try title="Kendi hesabını böl">
          <BillSplit />
        </Try>
        <Try title="ƏDV: satır satır mı, toplamda mı yuvarlanır?">
          <VatRounding />
        </Try>
        <Econ>
          <p>
            Muhasebede bu “yuvarlama farkı” hesabına benzer. Kural: <b>yuvarlamayı en sona bırak, tek bir yöntem seç ve her yerde onu uygula</b>.
            Fişte bir yöntem, raporda başka yöntem kullanılırsa denetimde (audit) qəpik farkları çıkar ve “sistem yanlış hesaplıyor” şikâyeti
            gelir.
          </p>
        </Econ>
        <TeachBack
          prompt="Hesap bölünürken kaybolan qəpiği ve ƏDV yuvarlama farkını kendi cümlenle açıkla. Şirket ne yapmalı?"
          hints={["artan qəpik", "dağıt", "tek kural", "her yerde aynı"]}
          model={
            <p>
              Bölme tam çıkmayınca herkesin payını yuvarlarsak toplam tutmaz. Doğrusu herkese eşit tam payı verip artan qəpikleri birer birer
              dağıtmak. Vergi yuvarlamasında da satır satır ya da toplamda yuvarlamak farklı sonuç verebilir; şirket bir kural seçip fiş, rapor ve
              muhasebede hep aynısını uygulamalı.
            </p>
          }
          checklist={["Yuvarlanmış paylar toplamı tutmayabilir", "Artan qəpikler dağıtılır (toplam korunur)", "Tek yuvarlama kuralı, her yerde aynı"]}
        />
        <TermCard
          terms={[
            { term: "Rounding mode", plain: "Nasıl yuvarlanacağı kuralı", heard: "Hangi rounding mode’u kullanıyoruz?" },
            { term: "Allocation (remainder)", plain: "Artan qəpikleri dağıtmak", heard: "Split’te remainder’ı dağıt" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="Gece yarısı tuzağı" question="Gece 01:30’da verilen sipariş hangi günün cirosuna yazılır?">
        <Story>
          <p>
            Sunucular zamanı <b>UTC</b> ile tutar (dünyanın ortak saati, Londra kışın). Bakı UTC’den <b>4 saat ileride</b>. Bakı’da gece 01:30
            iken sunucunun saatinde hâlâ <b>önceki günün</b> 21:30’u. Üstelik restoranlar gece yarısından sonra da açık: gece 02:00’deki satış
            muhasebede genelde “dünkü” iş gününe yazılır. Yani tek bir sipariş için üç farklı “gün” cevabı var.
          </p>
        </Story>
        <Try title="Sipariş anını kaydır, üç günü karşılaştır">
          <MidnightShift />
        </Try>
        <Predict
          question="Doğru kural hangisi?"
          options={[
            { label: "Her şeyi restoranın saatinde kaydet" },
            { label: "UTC kaydet, gösterirken ve raporlarken restoranın saat dilimine çevir", right: true },
          ]}
          reveal={
            <p>
              Kayıt <b>tek ortak dilde</b> (UTC) tutulur; böylece Bakı’daki ve İstanbul’daki restoranların verisi karşılaştırılabilir. Ekranda ve
              raporda restoranın saat dilimine (<code>Asia/Baku</code>) ve iş günü kuralına çevrilir.
            </p>
          }
        />
        <Econ>
          <p>
            Bu, farklı para birimlerindeki şubelerin muhasebesine benzer: her şube kendi parasıyla çalışır ama konsolide raporda hepsi{" "}
            <b>tek raporlama para birimine</b> çevrilir. Zamanda raporlama birimi UTC, gösterim birimi restoranın saati.
          </p>
        </Econ>
        <TeachBack
          prompt="Neden sunucu UTC kullanıyor ve rapor gününü nasıl doğru bulursun?"
          hints={["ortak saat", "Bakı +4", "gece yarısı", "iş günü", "çevir"]}
          model={
            <p>
              Sunucu herkes için aynı olan UTC’yi kullanır ki farklı yerlerdeki veriler karışmasın. Bakı UTC’den 4 saat ileride olduğu için gece
              yarısından sonraki siparişlerde tarihler farklı çıkar. Raporda UTC’yi restoranın saat dilimine çevirir, sonra iş günü kuralını
              (ör. gece 05:00’e kadar önceki gün) uygularım.
            </p>
          }
          checklist={["Kayıt UTC’de (ortak dil)", "Gösterim/rapor restoranın saat diliminde", "Gece yarısı sonrası için iş günü kuralı"]}
        />
        <TermCard
          terms={[
            { term: "UTC", plain: "Dünyanın ortak saati", heard: "DB’de her şey UTC" },
            { term: "Timezone (Asia/Baku)", plain: "Bir yerin yerel saat kuralı", heard: "Tenant timezone’una çevir" },
            { term: "Business day", plain: "Muhasebenin gün tanımı (gece kapanışı)", heard: "Z raporu business day’e göre" },
          ]}
        />
        <Deeper title="Neden ‘restoranın saatini’ sabit +4 olarak kodlamıyoruz?">
          <p className="text-sm">
            Saat dilimleri siyasi kararlarla değişir (Azərbaycan 2016’da yaz saatini kaldırdı; Türkiye 2016’da kalıcı +3’e geçti). Bu yüzden kodda
            “+4” değil, <code>Asia/Baku</code> gibi bir saat dilimi adı tutulur ve dünya çapında güncellenen saat dilimi veritabanı (IANA tz) kullanılır.
            Bu sayfadaki simülasyon basitlik için +4 kullanıyor.
          </p>
        </Deeper>
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "Veritabanında fiyat kolonu FLOAT. Gün sonu raporunda 0.01 AZN fark çıkıyor. İlk şüphe?",
              options: ["Kasiyer hata yaptı", "Float yuvarlama hatası birikiyor", "Sunucu yavaş"],
              answer: 1,
              explain: "Para için integer (qəpik) ya da decimal/numeric kullanılmalı.",
            },
            {
              q: "50 AZN’lik hesap 3 kişiye bölünecek. Doğru paylar?",
              options: ["16.67 + 16.67 + 16.67", "16.67 + 16.67 + 16.66", "16.66 + 16.66 + 16.66"],
              answer: 1,
              explain: "Toplam 50.00 olmalı: 5000 qəpik / 3 = 1666, artan 2 qəpik iki kişiye.",
            },
            {
              q: "Sipariş DB’de 2026-11-15T21:30:00Z. Bakı’daki restoranın takvim günü?",
              options: ["15 Kasım", "16 Kasım"],
              answer: 1,
              explain: "21:30 UTC + 4 saat = Bakı’da 16 Kasım 01:30. (İş günü kuralı 05:00 ise rapor 15 Kasım’a yazılır.)",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        node ile kendin kır:{" "}
        <Link href="/tutorial/10/teknik" className="underline">
          Gün 10 — Teknik sayfa →
        </Link>
      </p>
    </TutorialShell>
  );
}
