import type { Metadata } from "next";
import { FlowPlayer } from "@/components/tutorial/FlowPlayer";
import { Quiz } from "@/components/tutorial/Quiz";
import { SortGame } from "@/components/tutorial/SortGame";
import { Note, Section, TutorialShell } from "@/components/tutorial/TutorialShell";
import { EnvLab } from "./EnvLab";

export const metadata: Metadata = { title: "Gün 1 — Kod nasıl internete çıkar? | RestoLab" };

const deploySteps = [
  { title: "Branch aç", detail: "main'e dokunmadan ayrı bir tezgâh aç: git switch -c day-01/... (Gerçek menüye dokunmuyoruz.)" },
  { title: "Commit", detail: "Değişikliğin fotoğrafını çek: git commit. Bir kayıt noktası oluştu." },
  { title: "Push", detail: "Fotoğrafı GitHub'a gönder: git push. Artık ekip de görebilir." },
  { title: "PR aç", detail: "'Bunu main'e alalım mı?' talebi. Şefe giden yeni yemek önerisi." },
  { title: "Vercel build", detail: "Vercel kodu alır, build eder (tarifi pişirir). Hata varsa build log'unda görünür." },
  { title: "Preview", detail: "Sadece bu PR'ın kodu ayrı bir URL'de çalışır. Clopos'taki pr-5545.client.clopos.menu." },
  { title: "QA test", detail: "QA deneme tabağının tadına bakar: checklist'i preview'da kontrol eder." },
  { title: "Merge", detail: "Onaylanan kod main'e girer (Squash and merge)." },
  { title: "Prod deploy", detail: "main değişti → Vercel production'ı otomatik yeniden deploy eder. Müşteri artık yeni hâli görür." },
];

export default function Day1() {
  return (
    <TutorialShell day={1}>
      <Section n={1} title="Büyük resim: kodun yolculuğu">
        <p>Senin bilgisayarından müşterinin ekranına giden yol. ▶ Oynat’a bas ve her kutunun açıklamasını oku.</p>
        <FlowPlayer steps={deploySteps} />
        <Note icon="🍽️">
          <p>
            <b>Restoran benzetmesi:</b> main = gerçek menü · branch = deneme tezgâhı · PR = &quot;menüye ekleyelim mi?&quot; ·
            preview = deneme tabağı · QA = tadına bakan · merge = menüye eklemek.
          </p>
        </Note>
      </Section>

      <Section n={2} title="Alıştırma: adımları doğru sıraya diz">
        <SortGame
          hint="Kartları ⠿ tutup sürükle (veya ▲▼ kullan), sonra 'Kontrol et'e bas."
          items={["Branch aç", "Commit", "Push", "PR aç", "Preview oluşur", "QA test eder", "Merge", "Prod deploy"]}
        />
      </Section>

      <Section n={3} title='Kır & düzelt: "Ortam: unknown" laboratuvarı'>
        <p>Dün yaşadığımız gerçek bug’ı burada kendin yeniden üret. Her ayarın sonucu nasıl değiştirdiğini gör.</p>
        <EnvLab />
        <Note icon="🏢">
          <p>
            <b>Şirkette duyacağın cümle:</b> &quot;Env’i değiştirdim ama yansımadı, redeploy lazım.&quot; — Değişkenler <b>build anında</b>{" "}
            gömülür; değiştirince yeniden build gerekir.
          </p>
        </Note>
      </Section>

      <Section n={4} title="Terimler">
        <table className="w-full text-left text-sm">
          <tbody className="[&_td]:border-b [&_td]:border-zinc-300 [&_td]:py-1 dark:[&_td]:border-zinc-700">
            <tr><td className="font-semibold">Commit</td><td>Projenin o anki fotoğrafı (kayıt noktası)</td></tr>
            <tr><td className="font-semibold">Push</td><td>Commit’leri GitHub’a göndermek</td></tr>
            <tr><td className="font-semibold">Build</td><td>Kodu çalıştırılabilir hâle getirmek (pişirmek)</td></tr>
            <tr><td className="font-semibold">Deploy</td><td>Build edilen siteyi internete çıkarmak</td></tr>
            <tr><td className="font-semibold">Preview</td><td>PR’a özel, sadece ekibin gördüğü test sitesi</td></tr>
            <tr><td className="font-semibold">Branch protection</td><td>main’e direkt push’u yasaklayan kural</td></tr>
            <tr><td className="font-semibold">Env variable</td><td>Ortama göre değişen ayar (mutfağın duvarındaki not)</td></tr>
          </tbody>
        </table>
      </Section>

      <Section n={5} title="Quiz">
        <Quiz
          questions={[
            {
              q: "pr-5545.client.clopos.menu adresi ne işe yarar?",
              options: ["Müşterilerin kullandığı ana site", "5545 numaralı PR'ın kodunu ayrı test eden preview ortamı", "Veritabanı yönetim paneli"],
              answer: 1,
              explain: "Her PR kendi izole preview ortamını alır; QA orada test eder, onaylarsa main'e merge edilir.",
            },
            {
              q: "Vercel'de env değiştirdin ama site eski değeri gösteriyor. Ne yapmalısın?",
              options: ["Tarayıcı cache'ini temizle", "Redeploy (yeniden build)", "GitHub'da repo'yu sil"],
              answer: 1,
              explain: "Env build anında koda gömülür. Değeri değiştirmek, pişmiş yemeği değiştirmez — yeniden pişirmek gerekir.",
            },
            {
              q: "Boş commit gönderdin, Vercel 'Skipped - Not affected' dedi. Neden?",
              options: ["Vercel bozuldu", "apps/web klasöründe değişiklik yoktu, boşuna build etmedi", "Branch protection engelledi"],
              answer: 1,
              explain: "Monorepo'da sadece değişen uygulama build edilir (affected builds). Büyük şirketlerde dakikalar kazandırır.",
            },
          ]}
        />
      </Section>
    </TutorialShell>
  );
}
