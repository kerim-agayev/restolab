import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { SortGame } from "@/components/tutorial/SortGame";
import { Chapter, Econ, Story, TeachBack, Try } from "@/components/tutorial/Feynman";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { ModuleMap, SelfCheck } from "./Sims";

export const metadata: Metadata = { title: "Gün 12 — Modül 1 tekrarı: tek butonun tüm yolculuğu | RestoLab" };

const journey = [
  "Garson sepete ürün ekler (tarayıcı bloknotu)",
  "“Sipariş ver”e basar, form verisi hazırlanır",
  "Tarayıcı ismi adrese çevirir (DNS)",
  "TCP el sıkışması ile bağlantı kurulur",
  "TLS ile kimlik doğrulanır, zarf mühürlenir",
  "İstek CDN/edge’e ulaşır, sunucuya iletilir",
  "Sunucu veriyi doğrular ve fiyatı kendisi hesaplar",
  "Cevap status code ile döner, log’a requestId yazılır",
  "Tarayıcı ekranı günceller",
];

export default function Day12() {
  return (
    <TutorialShell day={12}>
      <Econ>
        <p>
          Bugün yeni bir şey yok. Feynman tekniğinin son adımı: <b>basitleştir ve bağla</b>. 11 günde öğrendiğin parçaları tek bir hikâyeye
          dizeceksin. Ekonomide bir dönem sonu “bilanço” gibi düşün: neyi gerçekten biliyorsun (aktif), nerede boşluk var (pasif).
        </p>
      </Econ>

      <Chapter n={1} title="Harita" question="Bir butona basıştan cevaba kadar her durak hangi günde öğrenildi?">
        <Story>
          <p>
            Aşağıdaki 12 durak, bu modülün tamamı. Her birine tıkla, tek cümlelik özetini oku. Bir durak sana yabancı geliyorsa yanındaki
            <b> “Gün X’e git”</b> linkiyle o güne dön.
          </p>
        </Story>
        <Try title="Modül 1 haritası">
          <ModuleMap />
        </Try>
      </Chapter>

      <Chapter n={2} title="Sıraya diz" question="Uçtan uca yolculuğun sırasını ezberlemeden kurabilir misin?">
        <Story>
          <p>Kartları sürükle (ya da ▲▼ ile taşı) ve doğru sıraya koy. Takılırsan kendine sor: “bu adım olmadan bir sonraki olabilir mi?”</p>
        </Story>
        <Try title="Garson ‘Sipariş ver’e bastı">
          <SortGame items={journey} hint="İpucu: ismi bilmeden bağlanamazsın; bağlanmadan şifreleyemezsin." />
        </Try>
      </Chapter>

      <Chapter n={3} title="Açık kalan sorular" question="Daha önce cevaplamadığın soruları şimdi anlatabilir misin?">
        <TeachBack
          prompt="(Gün 4) Tarayıcıda TIMEOUT görünürken sunucu logunda aynı istek 200 nasıl olabilir? Garson ve mutfak ile anlat."
          hints={["garson beklemedi", "mutfak bitirdi", "sabır süresi", "requestId"]}
          model={
            <p>
              Garson (tarayıcı) mutfağa sipariş verdi ve 3 saniye bekleyeceğini söyledi. Mutfak (sunucu) yemeği 5 saniyede bitirip hazırladı ve logda
              ‘200, 5001 ms’ yazdı. Ama garson 3. saniyede vazgeçip gitmişti, bu yüzden tarayıcıda TIMEOUT görünüyor. Sunucu hatası yok, sabır süresi
              (client timeout) kısa. requestId ile iki tarafın kaydı eşleştirilir.
            </p>
          }
          checklist={["Sunucu işi bitirdi (200)", "Tarayıcı daha önce beklemeyi bıraktı (client timeout)", "requestId ile iki taraf eşleştirilir"]}
        />
        <TeachBack
          prompt="(Gün 5) ipconfig’teki IP’n ile ifconfig.me’nin gösterdiği IP neden farklı?"
          hints={["santral", "dahili numara", "dış numara", "NAT"]}
          model={
            <p>
              ipconfig evin içindeki dahili numaramı (private IP) gösterir. İnternet beni evin tek dış numarasıyla (router’ın public IP’si) görür.
              Router santral gibi içerdeki cihazları defterle eşleştirir (NAT).
            </p>
          }
          checklist={["İçerideki adres private", "Dışarıda görünen router’ın public adresi", "Router NAT ile eşleştirir"]}
        />
        <TeachBack
          prompt="(Gün 5) curl exit 7 (refused) ile exit 28 (timeout) farkı nedir? Plaza benzetmesiyle."
          hints={["hızlı ret", "kimse yok", "sessizlik", "güvenlik görevlisi"]}
          model={
            <p>
              Refused: kapıyı çaldım, hemen “burada kimse yok” dediler. Makine ayakta ama o portta program dinlemiyor. Timeout: hiç ses çıkmadı,
              bekleyip vazgeçtim; arada soruyu yutan bir firewall ya da ulaşılamayan bir adres olabilir.
            </p>
          }
          checklist={["Refused = hızlı ret, port kapalı", "Timeout = cevap yok", "Timeout’ta firewall/erişilemeyen adres şüphelenilir"]}
        />
        <TeachBack
          prompt="(Gün 7) CORS hatasında sunucu mu engelliyor, tarayıcı mı? Nasıl ispatlarsın?"
          hints={["tarayıcı", "sunucu logu 200", "curl çalışır", "header"]}
          model={
            <p>
              Tarayıcı engelliyor. Sunucu isteği alıp işlemiş olabilir, logda 200 görünür; aynı isteği curl ile atınca çalışır. Tarayıcı, sunucu
              Access-Control-Allow-Origin header’ı ile izin vermediği için cevabı JavaScript’ten saklar.
            </p>
          }
          checklist={["Engelleyen tarayıcı", "Sunucu logu / curl ile ispat", "Çözüm sunucudaki header"]}
        />
      </Chapter>

      <Chapter n={4} title="Büyük final" question="Hepsini tek bir anlatımda birleştirebilir misin?">
        <TeachBack
          prompt="Garson ‘Sipariş ver’e bastı. Ekranda ‘Sipariş alındı’ yazana kadar olan her şeyi kendi cümlelerinle, en az 6 durakla anlat."
          hints={["bloknot", "rehber", "el sıkışma", "mühür", "depo", "kasiyer kontrolü", "qəpik", "status code", "requestId"]}
          model={
            <p>
              Sepet tarayıcının bloknotunda duruyordu. Butona basınca form verisi hazırlandı. Tarayıcı ismi rehberden adrese çevirdi, sunucuyla el
              sıkışıp bağlantı kurdu, sertifikayı kontrol edip konuşmayı mühürledi. İstek CDN’den geçip sunucuya ulaştı. Sunucu veriyi kendi kuralıyla
              doğruladı, fiyatı kendi listesinden qəpik olarak hesapladı, 201 ile cevap verdi ve logu requestId ile yazdı. Tarayıcı cevabı alıp ekranı
              güncelledi.
            </p>
          }
          checklist={["İsim → adres (DNS)", "Bağlantı + güven (TCP + TLS)", "CDN / sunucu", "Sunucuda doğrulama + fiyat hesabı", "Status code + requestId’li log", "Ekran güncellenir"]}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Modül 1 sınavı</h2>
        <Quiz
          questions={[
            {
              q: "QA preview’da bir bug buldu. Bug report’a en faydalı iki şey?",
              options: ["Ekran rengi ve tarayıcı adı", "Copy as cURL (cookie’siz) + requestId", "Sadece ‘çalışmıyor’"],
              answer: 1,
              explain: "Gün 4: backend’ci isteği tekrar üretir ve logda requestId ile bulur.",
            },
            {
              q: "‘Could not resolve host’ hangi katmanın hatası?",
              options: ["DNS", "TLS", "HTTP"],
              answer: 0,
              explain: "Gün 6: isim adrese çevrilemedi.",
            },
            {
              q: "Sunucu loglarında istek 200, tarayıcı konsolunda ‘blocked by CORS policy’. Çözüm nerede?",
              options: ["Tarayıcı ayarında", "Sunucunun cevap header’ında", "DNS’te"],
              answer: 1,
              explain: "Gün 7: Access-Control-Allow-Origin sunucudan gelir.",
            },
            {
              q: "Fiyat değişti ama müşteri eskisini görüyor; x-vercel-cache: HIT. Ne yaparsın?",
              options: ["Sunucuyu yeniden başlat", "TTL bekle / purge / revalidate", "DNS’i değiştir"],
              answer: 1,
              explain: "Gün 7: CDN deposundaki eski kopya.",
            },
            {
              q: "Konsolda ‘Minified React error #418’. Ne aramalısın?",
              options: ["Sunucu ve tarayıcıda farklı üretilen içerik (saat, random, localStorage)", "Veritabanı şifresi", "CORS header’ı"],
              answer: 0,
              explain: "Gün 8: hydration mismatch.",
            },
            {
              q: "API ‘qonaq: 0’ için ne dönmeli?",
              options: ["200", "422", "500"],
              answer: 1,
              explain: "Gün 9: okunuyor ama kurala aykırı.",
            },
            {
              q: "Rapor 0.01 AZN tutmuyor, kolon tipi FLOAT. Çözüm?",
              options: ["toFixed(2) her yerde", "qəpik/integer veya numeric", "Daha hızlı sunucu"],
              answer: 1,
              explain: "Gün 10: float yaklaşık, para kesin olmalı.",
            },
            {
              q: "Sepet toplamını kim hesaplamalı?",
              options: ["Tarayıcı", "Sunucu", "CDN"],
              answer: 1,
              explain: "Gün 11: tarayıcı kullanıcının elinde.",
            },
          ]}
        />
      </section>

      <Chapter n={5} title="Bilanço" question="Neyi gerçekten biliyorsun?">
        <Try title="Dürüstçe işaretle">
          <SelfCheck />
        </Try>
      </Chapter>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        Terminal sınavı:{" "}
        <Link href="/tutorial/12/teknik" className="underline">
          Gün 12 — Teknik sayfa (cevaplar gizli) →
        </Link>
      </p>
    </TutorialShell>
  );
}
