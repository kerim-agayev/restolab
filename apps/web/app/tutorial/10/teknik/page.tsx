import type { Metadata } from "next";
import Link from "next/link";
import { TaskList, type Task } from "@/components/tutorial/TaskList";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 10 (Teknik) — Para ve zaman node ile | RestoLab" };

const tasks: Task[] = [
  {
    title: "Float’ı kendin kır",
    cmd: `node -e "console.log(0.1+0.2)"`,
    expect: "0.30000000000000004",
    why: "JavaScript, Python, Java, C#, SQL’deki float: hepsi aynı standardı (IEEE 754) kullanır. Sorun dilde değil, sayı türünde.",
  },
  {
    title: "Biriken hata",
    cmd: `node -e "let s=0;for(let i=0;i<1000;i++)s+=0.1;console.log(s)"`,
    expect: "99.9999999999986",
    why: "1000 çay = 100 AZN olmalıydı.",
  },
  {
    title: "toFixed bile kurtarmaz",
    cmd: `node -e "console.log((1.005).toFixed(2), Math.round(1.005*100)/100)"`,
    expect: "1.00 1",
    why: "1.005 aslında 1.00499999… olarak saklanıyor; yuvarlama aşağı gidiyor. ‘Sonunda toFixed(2) yaparım’ çözüm değil.",
  },
  {
    title: "Qəpik ile kesin hesap",
    cmd: `node -e "let s=0;for(let i=0;i<1000;i++)s+=10;console.log(s, (s/100).toFixed(2)+' AZN')"`,
    expect: "10000 100.00 AZN",
    why: "Tam sayılarla toplam kesin. Sadece gösterirken 100’e bölünür.",
  },
  {
    title: "UTC → Bakı saati",
    cmd: `node -e "console.log(new Date('2026-11-15T21:30:00Z').toLocaleString('az-AZ',{timeZone:'Asia/Baku'}))"`,
    expect: "16.11.2026, 01:30:00",
    why: "Aynı an, iki gösterim. timeZone adı (+4 değil) kullanılıyor.",
  },
  {
    title: "Saf ‘gün’ hesabının tuzağı",
    cmd: `node -e "console.log(new Date('2026-11-15T21:30:00Z').toISOString().slice(0,10))"`,
    expect: "2026-11-15",
    why: "toISOString her zaman UTC günü verir. Rapor günü bununla hesaplanırsa Bakı’nın 16’sı, 15’e yazılır.",
  },
  {
    title: "Para birimini göster (sadece ekranda)",
    cmd: `node -e "console.log(new Intl.NumberFormat('az-AZ',{style:'currency',currency:'AZN'}).format(1234.5))"`,
    expect: "1.234,50 ₼",
    why: "Binlik/ondalık ayırıcı ülkeye göre değişir (az-AZ’de nokta ve virgül yer değiştirir). Biçimlendirme gösterimdir, hesap değil.",
  },
];

export default function Day10Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/10" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 10 · Teknik</p>
        <h1 className="text-3xl font-bold">Para ve zaman: node ile kendin kır</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Bu komutların çıktıları senin bilgisayarında doğrulandı (Node 24).</p>
      </header>
      <Section n={1} title="Görevler (PowerShell)">
        <TaskList items={tasks} />
      </Section>
      <Section n={2} title="Kurallar (RestoLab’da ve çoğu şirkette)">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            Para: <code>price_minor</code> (integer, qəpik) ya da DB’de <code>numeric(12,2)</code>. <b>Asla float/double/real.</b>
          </li>
          <li>Yuvarlama: en sonda, tek kural, her yerde aynı. Bölmede artan qəpikler dağıtılır.</li>
          <li>
            Zaman: DB’de UTC (<code>timestamptz</code>), gösterimde tenant’ın <code>timezone</code>’u (<code>Asia/Baku</code>), raporda iş günü kuralı.
          </li>
        </ul>
        <Note icon="🗄️">
          <p>
            <b>MSSQL köprüsü (sen biliyorsun):</b> <code>float</code>/<code>real</code> yaklaşık; <code>decimal(18,2)</code> ve <code>money</code>{" "}
            kesin. Zamanda <code>datetime</code> saat dilimi bilgisi taşımaz, <code>datetimeoffset</code> taşır. Postgres’te karşılıkları{" "}
            <code>numeric</code> ve <code>timestamptz</code> (Gün 13’te).
          </p>
        </Note>
        <Note icon="🤖">
          <p>
            <i>“Para alanlarını integer’a (minor units) çevirdim.”</i> → Float hatası biter, gösterimde /100. <i>“Tarihi UTC’ye
            normalize ettim.”</i> → Kayıt ortak dilde. <i>“Tenant timezone’una göre gruplandım.”</i> → Rapor restoranın gününe göre. <i>“Banker’s
            rounding kullanıyoruz.”</i> → Yarımları en yakın çift sayıya yuvarlama kuralı (istatistiksel sapmayı azaltır).
          </p>
        </Note>
        <Note icon="🏢">
          <p>
            <b>Clopos köprüsü:</b> şirket reposunda fiyat kolonlarının tipine (<code>decimal</code>, <code>int</code>, <code>float</code>) ve tarih
            alanlarına (<code>timezone</code>, <code>utc</code>, <code>dayjs</code>/<code>moment</code>/<code>date-fns-tz</code>) bak. Z raporunun gün
            kesim saatini (business day) nerede tanımladıklarını bulmak iyi bir soru.
          </p>
        </Note>
      </Section>
    </main>
  );
}
