import type { Metadata } from "next";
import { Quiz } from "@/components/tutorial/Quiz";
import { SortGame } from "@/components/tutorial/SortGame";
import { Note, Section, TutorialShell } from "@/components/tutorial/TutorialShell";
import { CurlBuilder } from "./CurlBuilder";
import { NetworkPanel } from "./NetworkPanel";
import { TimeoutRace } from "./TimeoutRace";

export const metadata: Metadata = { title: "Gün 4 — DevTools Network ve curl | RestoLab" };

const API = "https://restolab-kappa.vercel.app/api/tutorial/http";

const tasks: { title: string; cmd: string; expect: string; why: string }[] = [
  {
    title: "Header’larıyla birlikte bir cevap al",
    cmd: `curl.exe -i "${API}?status=404"`,
    expect: "HTTP/1.1 404 Not Found … x-request-id: … {\"status\":404,…}",
    why: "-i olmadan sadece body’yi görürsün; status ve header’lar QA için en önemli kısım.",
  },
  {
    title: "Gün 3 tekrarı: PATCH → 405",
    cmd: `curl.exe -i -X PATCH "${API}"`,
    expect: "HTTP/1.1 405 Method Not Allowed  ·  Content-Length: 0",
    why: "Kapı açık (adres var), ama bu kapıdan PATCH ile girilmez. Body bile yok.",
  },
  {
    title: "Gün 3 tekrarı: client timeout",
    cmd: `curl.exe -s --max-time 2 "${API}?delay=5000"; echo "exit=$LASTEXITCODE"`,
    expect: "exit=28   (curl: Operation timed out)",
    why: "Sunucu 5 sn çalışacaktı, curl 2 sn’de vazgeçti. Sunucu yine 200 yazacak — Vercel Logs’ta kontrol et!",
  },
  {
    title: "JSON gönder (POST)",
    cmd: `curl.exe -s -X POST -H "content-type: application/json" -d '{\\"masa\\":5,\\"urun\\":\\"Burger\\"}' "${API}?status=201"`,
    expect: "{\"requestId\":\"…\",\"status\":201,…,\"receivedBody\":{\"masa\":5,\"urun\":\"Burger\"}}",
    why: "PowerShell’de body’deki her \" işaretini \\\" yazman gerekir — Windows’un meşhur tuzağı.",
  },
  {
    title: "Kır: content-type’ı unut → 415",
    cmd: `curl.exe -i -X POST -d '{\\"masa\\":5}' "${API}"`,
    expect: "HTTP/1.1 415 Unsupported Media Type",
    why: "-d tek başına content-type’ı application/x-www-form-urlencoded yapar; sunucu JSON bekliyordu.",
  },
  {
    title: "Perde arkası: -v",
    cmd: `curl.exe -v -o NUL "${API}"`,
    expect: "* Trying 76.76.21.21:443…  * TLS handshake…  > GET /api/tutorial/http  < HTTP/1.1 200 OK",
    why: "* = curl’ün kendi notu (bağlantı, TLS), > = giden, < = gelen. IP, port ve TLS’i Gün 5–6’da açacağız.",
  },
];

export default function Day4() {
  return (
    <TutorialShell day={4}>
      <Section n={1} title="Gün 3 tekrarı: TIMEOUT ama sunucuda 200?">
        <p className="text-sm">Kaydırıcıları oynat, yarışı başlat. Hangi durumda garson “olmadı” der ama mutfak yine de yemeği yapar?</p>
        <TimeoutRace />
        <Note icon="🚪">
          <p>
            <b>405 Method Not Allowed:</b> Mutfağın kapısında “GET, POST, PUT, DELETE kabul edilir” yazıyor. Sen PATCH ile geldin →
            kapı seni hiç içeri almadı. Adres doğru (404 değil), ama <b>yöntem</b> yanlış. Aşağıdaki terminal görevi #2’de kendin gör.
          </p>
        </Note>
      </Section>

      <Section n={2} title="DevTools Network paneli">
        <p className="text-sm">
          Gerçek tarayıcıda <kbd>F12</kbd> (veya <kbd>Ctrl+Shift+I</kbd>) → <b>Network</b> sekmesi. Aşağıdaki simülatör aynı görünüyor;
          bir satıra tıkla, sekmeleri gez. Her sekmede “bu ne işe yarar” açıklaması var. Sonra <b>🔴 Gerçek istek at</b>’a bas ve
          <b> Timing</b>’de gerçek ölçümleri gör.
        </p>
        <NetworkPanel />
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li><b>Kırmızı satır</b> = 4xx/5xx. QA’nin gözü önce kırmızıya gider.</li>
          <li><b>Preserve log</b> kapalıyken 🔄 Yenile → eski istekler silinir. Login sonrası yönlendirme gibi bug’larda mutlaka aç.</li>
          <li><b>Disable cache</b> kapalıyken ikinci yenilemede JS/CSS “(disk cache)” olur — sunucuya hiç gitmez.</li>
          <li><b>Slow 4G</b> seç → süreler uzar. Gerçek DevTools’ta da aynı menü var: “Benim internetim hızlı, müşterininki değil.”</li>
        </ul>
      </Section>

      <Section n={3} title="Gerçek DevTools görevleri (5 dk)">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li><a className="underline" href="/tutorial/3">/tutorial/3</a>’ü aç → <kbd>F12</kbd> → Network → <b>Fetch/XHR</b> filtresini seç.</li>
          <li>HTTP Lab’dan POST + 201 gönder → satıra tıkla → <b>Payload</b>’da body’ni, <b>Response</b>’ta cevabı bul.</li>
          <li><b>Initiator</b> sekmesi → isteği hangi dosyanın hangi satırı atmış?</li>
          <li><b>Timing</b> → en uzun çubuk hangisi? (Genelde “Waiting (TTFB)” = sunucunun düşünme süresi.)</li>
          <li>Throttling’i <b>Slow 4G</b> yap, aynı isteği tekrar at → Timing nasıl değişti? (İşin bitince “No throttling”e geri al!)</li>
        </ol>
      </Section>

      <Section n={4} title="curl: tarayıcısız HTTP">
        <p className="text-sm">
          curl, terminalden HTTP isteği atan bir araç. QA ve backend onu sever çünkü: <b>tekrar üretilebilir</b> (aynı komut = aynı istek),
          <b> paylaşılabilir</b> (bug report’a yapıştırılır), <b>tarayıcı karışmaz</b> (cache, cookie, eklenti yok) ve <b>script’e konabilir</b>.
        </p>
        <Note icon="⚠️">
          <p>
            <b>Windows tuzağı:</b> Eski PowerShell’de <code>curl</code> yazınca aslında <code>Invoke-WebRequest</code> çalışır (takma ad)
            ve flag’ler tutmaz. Gerçek curl için <b><code>curl.exe</code></b> yaz. Git Bash’te düz <code>curl</code> yeterli.
          </p>
        </Note>
        <CurlBuilder />
      </Section>

      <Section n={5} title="Kır & düzelt: terminal görevleri">
        <p className="text-sm">VS Code terminalinde (PowerShell) sırayla çalıştır. Her birinde beklenen çıktıyla karşılaştır.</p>
        <ol className="space-y-3">
          {tasks.map((t, i) => (
            <li key={t.title} className="space-y-1 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
              <p className="font-semibold">{i + 1}. {t.title}</p>
              <pre className="overflow-x-auto rounded bg-zinc-950 p-2 text-xs text-emerald-300">{t.cmd}</pre>
              <p className="text-xs"><b>Beklenen:</b> <code>{t.expect}</code></p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{t.why}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section n={6} title="Copy as cURL: tarayıcıdan terminale">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>DevTools → Network → bir isteğe <b>sağ tıkla</b> → <b>Copy</b> → <b>Copy as cURL (bash)</b>.</li>
          <li>VS Code’da yeni terminal aç: terminal panelindeki <b>+</b> yanındaki oka tıkla → <b>Git Bash</b>.</li>
          <li>Yapıştır → Enter. Tarayıcının attığı isteğin <b>birebir aynısı</b> (tüm header ve cookie’lerle) terminalden gitti.</li>
        </ol>
        <Note icon="🔐">
          <p>
            Dikkat: kopyalanan komutta <b>cookie ve token’lar</b> da var. Bug report’a eklemeden önce <code>cookie:</code> ve
            <code> authorization:</code> satırlarını sil — yoksa oturumunu paylaşmış olursun.
          </p>
        </Note>
      </Section>

      <Section n={7} title="QA bug report şablonu">
        <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs whitespace-pre-wrap text-zinc-100">{`Başlık: [Terminal] "Mətbəxə göndər" 500 dönüyor — masa 5

Ortam: preview (pr-5545) · Chrome 142 · restoran: demo-kafe
Adımlar:
  1. Masa 5'i aç
  2. 2x Burger ekle
  3. "Mətbəxə göndər"e bas
Beklenen: 201 Created, mutfak ekranında sipariş görünür
Gerçekleşen: 500 Internal Server Error, ekranda "Xəta baş verdi"

requestId: 558c782e-16c3-430a-8325-27bce94c5963
Zaman: 2026-11-11 21:14 (Bakı)

Tekrar üretmek için:
curl -i -X POST -H "content-type: application/json" \\
  -d '{"masa":5,"urun":"Burger","adet":2}' \\
  "https://…/api/orders"

Ek: ekran görüntüsü + HAR dosyası (Network → ⬇ Export HAR)`}</pre>
        <Note icon="🏢">
          <p>
            Backend’ci bu raporu görünce: requestId ile logu bulur, curl ile hatayı kendi bilgisayarında tekrar üretir. “Bende çalışıyor”
            tartışması biter. İyi bir QA’yi kötüsünden ayıran şey budur.
          </p>
        </Note>
      </Section>

      <Section n={8} title="Alıştırma: bir bug’ı araştırma sırası">
        <SortGame
          items={[
            "Hatayı tarayıcıda tekrar üret",
            "F12 → Network → kırmızı isteği bul",
            "Status + Response’a bak",
            "x-request-id’yi kopyala",
            "Copy as cURL ile terminalde tekrar et",
            "Bug report yaz (adımlar + requestId + curl)",
            "Backend requestId ile logları inceler",
          ]}
        />
      </Section>

      <Section n={9} title="Claude Code bunu söylerse ne demek?">
        <Note icon="🤖">
          <p>
            <i>“Endpoint’i curl ile test ettim, 201 dönüyor.”</i> → Claude Code tarayıcı açmadan terminalden istek attı ve status’a baktı.
            Sen de aynı komutu çalıştırıp doğrulayabilirsin.
          </p>
          <p>
            <i>“Network tab’da TTFB yüksek görünüyor.”</i> → Timing’de <b>Waiting</b> çubuğu uzun = sunucu yavaş düşünüyor (DB sorgusu,
            dış servis…). Ağ değil, backend tarafına bakılmalı.
          </p>
        </Note>
      </Section>

      <Section n={10} title="Quiz">
        <Quiz
          questions={[
            {
              q: "Bir isteğin hangi kod satırından atıldığını görmek için hangi sekmeye bakarsın?",
              options: ["Headers", "Initiator", "Cookies"],
              answer: 1,
              explain: "Initiator: isteği kimin başlattığını (dosya, satır, tıklama) gösterir.",
            },
            {
              q: "Timing’de en uzun çubuk ‘Waiting (TTFB)’. Bu ne anlama gelir?",
              options: ["Kullanıcının interneti yavaş", "Sunucu cevabı hazırlarken uzun süre düşündü", "DNS bozuk"],
              answer: 1,
              explain: "TTFB = ilk byte’a kadar geçen süre. Uzunsa genellikle backend (DB sorgusu, dış servis) yavaştır.",
            },
            {
              q: "PowerShell’de “curl -i …” yazdın ama flag’ler çalışmadı. Neden?",
              options: ["curl Windows’ta yok", "PowerShell’de curl, Invoke-WebRequest’in takma adı; curl.exe yazmalısın", "-i flag’i kaldırıldı"],
              answer: 1,
              explain: "Windows PowerShell 5.1’de curl bir alias. Gerçek curl için curl.exe kullan (veya Git Bash).",
            },
          ]}
        />
        <Note icon="📖">
          <p>Okumak istersen: MDN Web Docs → “HTTP overview” ve Chrome DevTools dokümanı → “Network features reference”.</p>
        </Note>
      </Section>
    </TutorialShell>
  );
}
