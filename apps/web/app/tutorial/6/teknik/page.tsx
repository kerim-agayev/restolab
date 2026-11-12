import type { Metadata } from "next";
import Link from "next/link";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 6 (Teknik) — Terminal görevleri ve cheat sheet | RestoLab" };

type Task = { title: string; cmd: string; expect: string; why: string };

const tasks: Task[] = [
  {
    title: "DNS: sitenin A kaydı ve TTL’i",
    cmd: "Resolve-DnsName restolab-kappa.vercel.app -Type A",
    expect: "restolab-kappa.vercel.app  A  300  216.198.79.195 (ve ikinci bir IP)",
    why: "Üçüncü sütun TTL (saniye). İki IP görmen normal: sunucu yedekli. Bölüm 2’deki TTL slider’ıyla aynı kavram.",
  },
  {
    title: "nslookup: aynı soru, eski araç",
    cmd: "nslookup restolab-kappa.vercel.app",
    expect: "Server: <senin resolver’ın>  ·  Non-authoritative answer:  ·  Addresses: …",
    why: "“Non-authoritative” = cevabı asıl sahibinden değil, resolver’ın defterinden aldın. Bölüm 1’deki zincirin sonucu.",
  },
  {
    title: "NS ve MX kayıtları",
    cmd: "Resolve-DnsName example.com -Type NS\nResolve-DnsName example.com -Type MX",
    expect: "NS: …ns.cloudflare.com  ·  MX: NameExchange “.” Preference 0",
    why: "NS = asıl rehber kim. MX’te “.” (null MX) şu demek: bu alan adı e-posta ALMAZ. Kendi alan adını aldığında MX’i buradan kontrol edersin.",
  },
  {
    title: "Kendi bilgisayarının DNS defteri",
    cmd: "ipconfig /displaydns | findstr /i restolab",
    expect: "restolab-kappa.vercel.app  (Windows’un cache’inde duran kayıt)",
    why: "Bölüm 1’deki “Windows’un defteri” işte bu. Kayıt görünmezse önce yukarıdaki görevi çalıştır.",
  },
  {
    title: "ping: tek bir ‘orada mısın?’",
    cmd: "ping -n 2 example.com",
    expect: "Reply from 104.x.x.x: bytes=32 time=13ms TTL=57  ·  0% loss",
    why: "time = gidiş-dönüş süresi. Cevaptaki TTL=57: paket 64 ile yola çıktı, 7 router geçti. Bölüm 4’ün hop sayısıyla uyuşur.",
  },
  {
    title: "tracert: yolun haritası",
    cmd: "tracert -d -h 8 example.com",
    expect: "1  192.168.0.1  ·  …  ·  son satır hedef IP  ·  Trace complete.",
    why: "-d = isim çözme (hızlı), -h 8 = en fazla 8 durak. İlk satır senin router’ın (Gün 5’te bulduğun gateway). Süresi sıçrayan satır = yavaşlayan halka. ‘* * *’ = o router ICMP’ye cevap vermiyor, yol bozuk demek değil.",
  },
  {
    title: "TLS: sitenin kimlik kartını oku",
    cmd:
      "$tcp = New-Object Net.Sockets.TcpClient('example.com',443)\n$ssl = New-Object Net.Security.SslStream($tcp.GetStream())\n$ssl.AuthenticateAsClient('example.com')\n$c = New-Object Security.Cryptography.X509Certificates.X509Certificate2($ssl.RemoteCertificate)\n$c.Subject; $c.Issuer; $c.NotAfter; $ssl.SslProtocol\n$tcp.Close()",
    expect: "CN=example.com  ·  Issuer: … (bir CA)  ·  NotAfter: bir tarih  ·  Tls12 veya Tls13",
    why: "Bölüm 5’teki 3 kontrol: Subject = isim, NotAfter = tarih, Issuer = noter (CA). Tarayıcı bunu her HTTPS’te senin yerine yapar.",
  },
  {
    title: "HTTPS’i zorlayan header (HSTS) ve http → https yönlendirmesi",
    cmd: "curl.exe -sI https://restolab-kappa.vercel.app/tutorial | findstr /i \"strict-transport\"\ncurl.exe -sI http://restolab-kappa.vercel.app",
    expect: "Strict-Transport-Security: max-age=63072000; …  ·  HTTP/1.0 308 Permanent Redirect + Location: https://…",
    why: "http ile gelenler otomatik https’e yönlendirilir; HSTS ise tarayıcıya “bu siteye bir daha http ile gelme” der. Gün 7’de derinleşeceğiz.",
  },
];

const breakTasks: Task[] = [
  {
    title: "Çözülemeyen isim",
    cmd: "curl.exe -sS --max-time 8 http://restolab-yok.invalid\nResolve-DnsName restolab-yok.invalid",
    expect: "curl: (6) Could not resolve host  ·  exit 6  ·  DNS name does not exist",
    why: "İsim adrese çevrilemedi: bağlanmaya bile gelinmedi. Tarayıcıda karşılığı ERR_NAME_NOT_RESOLVED. (.invalid uzantısı bilerek hiçbir zaman çözülmeyecek şekilde ayrılmış.)",
  },
  {
    title: "‘DNS çözüldü’ ≠ ‘site var’",
    cmd: "curl.exe -s https://restolab-yok-123.vercel.app",
    expect: "The deployment could not be found on Vercel.  DEPLOYMENT_NOT_FOUND  (exit 0!)",
    why: "Vercel’de her *.vercel.app ismi çözülür (joker kayıt). İsim çözüldü, TLS bile tamam, ama uygulama yok. Hatanın HANGİ katmanda olduğunu ayırt etmek debugging’in yarısı: DNS ✅ → TLS ✅ → HTTP ❌.",
  },
  {
    title: "Süresi dolmuş sertifika",
    cmd: "curl.exe -sS --max-time 10 https://expired.badssl.com/ -o NUL",
    expect: "SEC_E_CERT_EXPIRED  ·  exit 35 (bazı sistemlerde 60)",
    why: "badssl.com, tam bu hataları denemek için yapılmış herkese açık bir test sitesidir. Tarayıcıda aynı site ‘Bağlantınız gizli değil’ verir.",
  },
  {
    title: "Yanlış isimli sertifika",
    cmd: "curl.exe -sS --max-time 10 https://wrong.host.badssl.com/ -o NUL",
    expect: "SEC_E_WRONG_PRINCIPAL  ·  exit 60",
    why: "Sertifika başka bir isim için verilmiş. Bölüm 5’teki ‘isim’ kontrolü başarısız.",
  },
  {
    title: "Kontrolü kapatmanın bedeli (-k)",
    cmd: "curl.exe -sS -k --max-time 10 https://expired.badssl.com/ -o NUL -w \"exit ok, http=%{http_code}\\n\"",
    expect: "exit ok, http=200",
    why: "-k sertifika kontrolünü kapatır ve ‘çalışır’. Ama artık karşındakinin kim olduğunu bilmiyorsun. ‘Geçici’ -k kullanımı üretimde güvenlik açığına dönüşür. Claude Code ‘-k ekledim’ derse dur ve nedenini sor.",
  },
];

function TaskList({ items }: { items: Task[] }) {
  return (
    <ol className="space-y-3">
      {items.map((t, i) => (
        <li key={t.title} className="space-y-1 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
          <p className="font-semibold">
            {i + 1}. {t.title}
          </p>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-2 text-xs text-emerald-300">{t.cmd}</pre>
          <p className="text-xs">
            <b>Beklenen:</b> <code>{t.expect}</code>
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{t.why}</p>
        </li>
      ))}
    </ol>
  );
}

const cheat: [string, string, string][] = [
  ["İsim çözülmüyor mu?", "Resolve-DnsName <isim>  /  nslookup <isim>", "DNS keşfi (kendi alan adın için kayıtları görmek)"],
  ["Hedefe ulaşılıyor mu, ne kadar yavaş?", "ping <host>", "Hedef canlı mı kontrolü"],
  ["Yolun neresinde yavaşlıyor?", "tracert -d <host>", "Ağ topolojisini anlamak"],
  ["Port açık mı?", "Test-NetConnection <host> -Port 443", "Port tarama mantığı (nmap)"],
  ["Hangi program hangi portta?", "netstat -ano | findstr LISTENING", "Kendi makinende açık servis envanteri"],
  ["HTTP başlıkları, yönlendirme, HSTS?", "curl.exe -sI <url>   (ayrıntı için -v)", "Header’lardan sunucu/güvenlik ipuçları"],
  ["Sertifika sorunu mu?", "Tarayıcıda 🔒 → Sertifika  /  yukarıdaki PowerShell parçası", "TLS yapılandırma kontrolü (kendi sunucunda)"],
  ["Trafiğe paket paket bakmak", "Wireshark (kendi ağında, kendi trafiğin)", "Ağ trafiği analizi: HTTP’de düz metin, HTTPS’te şifreli görürsün"],
];

export default function Day6Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/6" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 6 · Teknik</p>
        <h1 className="text-3xl font-bold">Network 2: terminal görevleri ve cheat sheet</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Sade sayfadaki kavramları bu kez kendi bilgisayarında gerçek komutlarla gör. Tüm çıktılar senin makinende doğrulandı;
          IP ve süreler sende farklı olabilir, önemli olan <b>şekil</b>.
        </p>
      </header>

      <Section n={1} title="Gerçek görevler">
        <TaskList items={tasks} />
      </Section>

      <Section n={2} title="Kır ve oku: hata hangi katmanda?">
        <TaskList items={breakTasks} />
        <Note icon="🔍">
          <p>
            <b>Hata teşhis sırası:</b> DNS (isim çözülüyor mu?) → TCP (port açık mı?) → TLS (sertifika tamam mı?) → HTTP (status
            code ne?). Hatanın mesajı hangi katmandan geldiğini söyler: “Could not resolve host” = DNS, “refused/timed out” =
            TCP, “SEC_E_…/certificate” = TLS, “404/500” = HTTP.
          </p>
        </Note>
      </Section>

      <Section n={3} title="Cheat sheet: sorun → komut → pentest karşılığı">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-zinc-500">
              <tr>
                <th className="py-1 pr-3">Soru</th>
                <th className="py-1 pr-3">Komut</th>
                <th className="py-1">Pentest/güvenlikte karşılığı</th>
              </tr>
            </thead>
            <tbody>
              {cheat.map(([q, c, p]) => (
                <tr key={q} className="border-t border-zinc-200 align-top dark:border-zinc-800">
                  <td className="py-1.5 pr-3">{q}</td>
                  <td className="py-1.5 pr-3 font-mono text-xs">{c}</td>
                  <td className="py-1.5 text-xs text-zinc-600 dark:text-zinc-400">{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note icon="⚖️">
          <p>
            <b>Udemy kursuyla köprü:</b> keşif (recon) aşamasında DNS kayıtları, alt alan adları, açık portlar ve sertifika bilgisi
            toplanır. Aynı bilgi savunmacı için “dışarıdan ne görünüyor?” sorusunun cevabıdır. <b>Etik kural:</b> bunları sadece
            kendi alan adında, kendi sunucunda veya açıkça izin verilen hedeflerde yap. Başkasının (Clopos dahil) sistemini izinsiz
            tarama; simülatör kullan.
          </p>
        </Note>
        <Note icon="🤖">
          <p>
            <i>“DNS’i propagate olmasını bekle.”</i> → Eski TTL dolana kadar bazı defterler eski adresi hatırlıyor. <i>“Sertifikayı
            yeniledim.”</i> → Kimlik kartının tarihini uzattı. <i>“Security group’a 5432 için sadece app IP’sini ekledim.”</i> → En
            az yetki (Bölüm 7). <i>“Timeout alıyorum.”</i> → Önce bunun TCP katmanında (firewall/sessizlik) olup olmadığına bak.
          </p>
        </Note>
      </Section>

      <p className="border-t border-zinc-300 pt-4 text-sm dark:border-zinc-700">
        📖 Okumak istersen: Cloudflare Learning Center → “What is DNS?” ve “What is TLS?”; Julia Evans’ın DNS ve HTTPS zine’leri.
      </p>
    </main>
  );
}
