import type { Metadata } from "next";
import { FlowPlayer } from "@/components/tutorial/FlowPlayer";
import { Quiz } from "@/components/tutorial/Quiz";
import { SortGame } from "@/components/tutorial/SortGame";
import { Note, Section, TutorialShell } from "@/components/tutorial/TutorialShell";
import { ConflictLab } from "./ConflictLab";
import { MergeVsRebase } from "./MergeVsRebase";

export const metadata: Metadata = { title: "Gün 2 — Git derin: merge conflict | RestoLab" };

const stations = [
  { title: "Çalışma klasörü", detail: "Dosyayı VS Code'da değiştirdin. Git bunu 'modified' olarak görür ama henüz hiçbir şey kaydedilmedi. (Yemeği hazırladın.)" },
  { title: "Staging", detail: "git add dosya → bu değişikliği bir sonraki fotoğrafa dahil et. İstemediğin dosyaları dışarıda bırakabilirsin. (Tabağa koydun.)" },
  { title: "Commit", detail: "git commit -m \"feat: ...\" → fotoğraf çekildi, AMA sadece senin bilgisayarında. (Fotoğrafını çektin.)" },
  { title: "Push", detail: "git push → commit'ler GitHub'a gitti. Artık ekip görebilir, Vercel preview build eder. (Menüye gönderdin.)" },
  { title: "Pull", detail: "git pull → arkadaşın da kendi bilgisayarına en son kodu çeker. Senin değişikliğin artık onda da var." },
];

export default function Day2() {
  return (
    <TutorialShell day={2}>
      <Section n={1} title="Git'in 4 durağı (+ pull)">
        <FlowPlayer steps={stations} />
        <Note icon="⌨️">
          <p>
            Her an nerede olduğunu görmek için: <code>git status</code>. Geçmişi görmek için: <code>git log --oneline --graph</code>.
          </p>
        </Note>
      </Section>

      <Section n={2} title="Merge mi, rebase mi?">
        <p>Sen çalışırken arkadaşın main’e kod merge etti. Senin branch’in geride kaldı. İki yol var:</p>
        <MergeVsRebase />
        <Note icon="🏢">
          <p>
            <b>Şirkette duyacağın cümle:</b> &quot;Branch’in main’in gerisinde, rebase et&quot; veya &quot;main’i branch’ine merge et&quot;.
            GitHub PR sayfasındaki <b>Update branch</b> butonu da aynı işi yapar.
          </p>
        </Note>
      </Section>

      <Section n={3} title="Kır & düzelt: Conflict Lab">
        <p>
          Sen başlığı <b>&quot;RestoLab — Admin Panel&quot;</b> yaptın, arkadaşın <b>&quot;RestoLab — Restoran Paneli&quot;</b> yaptı ve önce o merge
          etti. Git hangisinin doğru olduğunu bilemez — <b>karar senin</b>. Aşağıda VS Code’da göreceğin ekranın aynısı var:
        </p>
        <ConflictLab />
        <Note icon="🔍">
          <p>
            <b>Current</b> = senin branch’in (HEAD). <b>Incoming</b> = içeri gelen (main’deki arkadaşının kodu).
            İşaretleri (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> <code>=======</code> <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) dosyada bırakırsan build patlar.
          </p>
        </Note>
      </Section>

      <Section n={4} title="Alıştırma: çakışma çözme adımlarını sırala">
        <SortGame
          items={[
            "git switch kendi-branch'in",
            "git pull origin main",
            "VS Code'da çakışmayı çöz",
            "git add .",
            "git commit",
            "git push",
            "Preview'da kontrol et",
            "Squash and merge",
          ]}
        />
      </Section>

      <Section n={5} title="Code review">
        <table className="w-full text-left text-sm">
          <tbody className="[&_td]:border-b [&_td]:border-zinc-300 [&_td]:py-1 dark:[&_td]:border-zinc-700">
            <tr><td className="font-semibold">Comment</td><td>Sadece yorum/soru. Onay veya ret değil.</td></tr>
            <tr><td className="font-semibold">Approve</td><td>&quot;Kod iyi, merge edilebilir.&quot;</td></tr>
            <tr><td className="font-semibold">Request changes</td><td>&quot;Şunları düzeltmeden merge etme.&quot; PR bloklanır.</td></tr>
            <tr><td className="font-semibold">Resolve conversation</td><td>Yorumdaki istek yapıldı, konu kapandı.</td></tr>
          </tbody>
        </table>
        <Note icon="🧑‍💻">
          <p>Review kişiyi değil kodu eleştirir. İyi review: <i>&quot;Bu başlık mobilde taşabilir, kısaltalım mı?&quot;</i> — neden + öneri.</p>
        </Note>
      </Section>

      <Section n={6} title="Conventional Commits">
        <table className="w-full text-left font-mono text-sm">
          <tbody className="[&_td]:border-b [&_td]:border-zinc-300 [&_td]:py-1 dark:[&_td]:border-zinc-700">
            <tr><td>feat:</td><td className="font-sans">yeni özellik (feat: add tutorial page)</td></tr>
            <tr><td>fix:</td><td className="font-sans">hata düzeltme (fix: env var missing in build)</td></tr>
            <tr><td>docs:</td><td className="font-sans">sadece doküman</td></tr>
            <tr><td>chore:</td><td className="font-sans">ayar, bağımlılık, temizlik</td></tr>
            <tr><td>refactor:</td><td className="font-sans">davranışı değiştirmeden kodu düzenleme</td></tr>
          </tbody>
        </table>
      </Section>

      <Section n={7} title="Quiz">
        <Quiz
          questions={[
            {
              q: "git commit yaptın ama git push yapmadın. Arkadaşın kodunu görebilir mi?",
              options: ["Evet, commit yeterli", "Hayır, commit sadece senin bilgisayarında", "Sadece Vercel görebilir"],
              answer: 1,
              explain: "Commit yerel bir fotoğraftır. GitHub'a gitmesi için push gerekir.",
            },
            {
              q: "VS Code'da 'Incoming Change' neyi ifade eder?",
              options: ["Senin branch'indeki değişiklik", "İçeri çektiğin (main'deki) değişiklik", "Silinecek kod"],
              answer: 1,
              explain: "Current = senin (HEAD), Incoming = içeri gelen. Clopos'ta genelde Incoming = başka bir developer'ın merge ettiği kod.",
            },
            {
              q: "Hangi commit mesajı Conventional Commits'e uygun?",
              options: ["düzelttim", "fix: prevent double order on kitchen send", "UPDATE FILES"],
              answer: 1,
              explain: "tip: kısa açıklama. Bu sayede changelog otomatik üretilebilir ve geçmiş okunur olur.",
            },
          ]}
        />
      </Section>
    </TutorialShell>
  );
}
