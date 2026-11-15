import type { Metadata } from "next";
import Link from "next/link";
import { Quiz } from "@/components/tutorial/Quiz";
import { Chapter, Econ, Predict, Story, TeachBack, TermCard, Try } from "@/components/tutorial/Feynman";
import { TutorialShell } from "@/components/tutorial/TutorialShell";
import { ApiLab, CashierGame, MasaForm } from "./Sims";

export const metadata: Metadata = { title: "Gün 9 — Form nereye gidiyor, kim reddediyor? | RestoLab" };

export default function Day9() {
  return (
    <TutorialShell day={9}>
      <Econ>
        <p>
          Bugünün fikri muhasebeden: <b>iç kontrol</b>. Bir fatura önce departmanda kontrol edilir (kolaylık için), ama ödeme yapılmadan
          önce <b>muhasebe tekrar kontrol eder</b> (güvenlik için). Departmanın kontrolüne güvenip ödeme yapan şirket dolandırılır. Web’de
          departman = tarayıcı, muhasebe = sunucu.
        </p>
      </Econ>

      <Chapter n={1} title="Masa aç" question="Garson ‘Masa aç’a basınca form verisi nereye gidiyor ve kim kontrol ediyor?">
        <Story>
          <p>
            Form doldurulup gönderilince veri sunucudaki bir fonksiyona gider. Next.js’te buna <b>Server Action</b> denir: tarayıcıda bir
            butona basarsın, sunucuda bir fonksiyon çalışır. Arada iki kontrol var: <b>tarayıcınınki</b> (kutuya harf yazamazsın, boş
            bırakamazsın) ve <b>sunucununki</b>. Hangisi gerçek kontrol? Kendin dene.
          </p>
        </Story>
        <Try title="Gerçek form: önce normal, sonra tarayıcı kontrolünü kapatıp masa 99 dene">
          <MasaForm />
        </Try>
        <Predict
          question="Tarayıcı kontrolünü kapatıp masa 99 gönderirsen ne olur?"
          options={[{ label: "Masa 99 açılır" }, { label: "Sunucu reddeder: ‘Bu restoranda 50 masa var’", right: true }]}
          reveal={
            <p>
              Tarayıcı kontrolü sadece <b>kolaylık</b>: kullanıcıya anında ipucu verir. Kapatmak ya da atlatmak çok kolay (DevTools, curl).
              Gerçek kural sunucuda, zod şemasında yazıyor. Bu yüzden sunucu “kendi kapısında” tekrar kontrol eder.
            </p>
          }
        />
        <TeachBack
          prompt="Tarayıcı zaten kontrol ediyorsa sunucu neden tekrar kontrol ediyor? Departman–muhasebe benzetmesiyle anlat."
          hints={["kolaylık", "güvenlik", "atlatılabilir", "son söz sunucuda"]}
          model={
            <p>
              Tarayıcıdaki kontrol kullanıcıya hızlı ipucu vermek için, ama kullanıcının elinde olduğu için kapatılabilir ya da atlatılabilir.
              Sunucudaki kontrol ise kimsenin değiştiremeyeceği yerde. Muhasebe departmanın onayına güvenmeden faturayı tekrar kontrol eder gibi,
              sunucu da her veriyi kendisi doğrular. Son söz her zaman sunucuda.
            </p>
          }
          checklist={["Tarayıcı kontrolü = kullanıcı kolaylığı", "Tarayıcı kontrolü atlatılabilir", "Gerçek kural sunucuda (son söz)"]}
        />
        <TermCard
          terms={[
            { term: "Server Action", plain: "Butona basınca sunucuda çalışan fonksiyon", heard: "Form’u server action’a bağladım" },
            { term: "Validation", plain: "Veri kurala uyuyor mu kontrolü", heard: "Server-side validation ekle" },
            { term: "zod (schema)", plain: "Kuralların yazıldığı tek liste", heard: "zod şemasına ekledim" },
          ]}
        />
      </Chapter>

      <Chapter n={2} title="Kasiyer: 400, 422, 409" question="Reddetmenin de türleri var mı?">
        <Story>
          <p>
            Kasiyer bir fişi üç farklı sebeple geri çevirebilir: <b>okunmuyor</b> (yırtık, bozuk biçim → 400), <b>okunuyor ama saçma</b>{" "}
            (masa 99 → 422), <b>doğru ama şu an olmaz</b> (masa 7 dolu → 409). Bu ayrım frontend için önemli: 400’de “uygulamada bug var”,
            422’de “kullanıcıya hangi alanın yanlış olduğunu göster”, 409’da “sayfayı yenile, durum değişmiş”.
          </p>
        </Story>
        <Try title="Kasiyer oyunu">
          <CashierGame />
        </Try>
        <Try title="Gerçek API: aynı işi Route Handler’a gönder">
          <ApiLab />
        </Try>
        <TeachBack
          prompt="400, 422 ve 409’u kasiyer benzetmesiyle ayır. Frontend her birinde ne yapmalı?"
          hints={["okunmuyor", "saçma", "dolu", "alanı göster", "yenile"]}
          model={
            <p>
              400: fiş okunmuyor, biçim bozuk; genelde bizim kodda bug vardır. 422: fiş okunuyor ama içerik kurala aykırı; kullanıcıya hangi
              alanın yanlış olduğunu gösteririm. 409: her şey doğru ama mevcut durumla çakışıyor (masa dolu); kullanıcıya durumu söyler,
              listeyi yenilerim.
            </p>
          }
          checklist={["400 = biçim bozuk (okunamıyor)", "422 = okunuyor ama kurala aykırı → alan hatası göster", "409 = durumla çakışma → yenile/bilgilendir"]}
        />
        <TermCard
          terms={[
            { term: "400 Bad Request", plain: "Okunamayan istek", heard: "Payload bozuk, 400 dönüyor" },
            { term: "422 Unprocessable", plain: "Okunuyor ama kurala aykırı", heard: "Validation error, 422" },
            { term: "409 Conflict", plain: "Mevcut durumla çakışma", heard: "Masa zaten açık, 409 dönüyoruz" },
          ]}
        />
      </Chapter>

      <Chapter n={3} title="İki kapı, tek kural" question="Server Action varken neden ayrıca API (Route Handler) yazıyoruz?">
        <Story>
          <p>
            Server Action, <b>kendi web formun</b> için kısa yol: başka kimse onu rahatça çağıramaz. Ama Clopos’u düşün: aynı “masa aç” işini
            terminal, garson mobil uygulaması ve kiosk da yapıyor. Onlar için herkese açık, adresi belli bir kapı lazım: <b>API</b> (Route
            Handler). Önemli olan: iki kapı da <b>aynı kural dosyasını</b> (zod şeması) kullanır. Kural tek yerde değişir.
          </p>
        </Story>
        <Predict
          question="Masa limiti 50’den 60’a çıktı. Kaç dosya değişmeli?"
          options={[{ label: "İki kapının ikisi de ayrı ayrı" }, { label: "Sadece ortak şema dosyası (lib/tutorial/masa.ts)", right: true }]}
          reveal={<p>Kural tek yerde olduğu için tek değişiklik yeter. Kural iki yerde kopyalanırsa bir gün biri unutulur ve kapılar farklı davranır.</p>}
        />
        <Econ>
          <p>
            <b>Ölçek ekonomisi:</b> aynı kural motoru birden fazla kanala (web, terminal, mobil) hizmet eder; her kanal için ayrı kural yazmak
            hem maliyet hem tutarsızlık riski.
          </p>
        </Econ>
        <TeachBack
          prompt="Server Action ile Route Handler ne zaman seçilir? Kural neden tek dosyada?"
          hints={["kendi formum", "başka uygulamalar", "aynı şema", "tek değişiklik"]}
          model={
            <p>
              Sadece kendi web formum çağıracaksa Server Action kısa ve pratik. Terminal, mobil gibi başka uygulamalar da çağıracaksa adresi
              belli bir API (Route Handler) yazarım. İki kapı da aynı şema dosyasını kullanır ki kural değişince tek yerden değişsin ve
              tutarsızlık olmasın.
            </p>
          }
          checklist={["Server Action: kendi formun için", "Route Handler/API: başka client’lar için", "Kural tek yerde (ortak şema)"]}
        />
      </Chapter>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/60 p-4 sm:p-6">
        <h2 className="text-2xl font-bold">🏁 Quiz</h2>
        <Quiz
          questions={[
            {
              q: "Bir geliştirici ‘formda zaten max=50 var, sunucuda kontrol gerek yok’ diyor. Doğru mu?",
              options: ["Doğru", "Yanlış: tarayıcı kontrolü atlatılabilir, sunucu tekrar kontrol etmeli"],
              answer: 1,
              explain: "Tarayıcı kullanıcının elinde. curl veya DevTools ile her şey gönderilebilir.",
            },
            {
              q: "API ‘qonaq: -3’ için hangi kodu dönmeli?",
              options: ["400", "422", "500"],
              answer: 1,
              explain: "JSON okunuyor, alan kurala aykırı → 422. 500 sunucunun kendi hatasıdır, kullanıcının değil.",
            },
            {
              q: "Mobil garson uygulaması da masa açacak. En doğru yol?",
              options: ["Server Action’ı mobilden çağırmak", "Aynı şemayı kullanan bir Route Handler (API)", "Kuralı mobil uygulamaya kopyalamak"],
              answer: 1,
              explain: "Başka client’lar için adresi belli bir API, kural tek yerde.",
            },
          ]}
        />
      </section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        curl ve DevTools görevleri:{" "}
        <Link href="/tutorial/9/teknik" className="underline">
          Gün 9 — Teknik sayfa →
        </Link>
      </p>
    </TutorialShell>
  );
}
