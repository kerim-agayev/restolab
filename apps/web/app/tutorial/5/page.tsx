import type { Metadata } from "next";
import { FlowPlayer } from "@/components/tutorial/FlowPlayer";
import { Quiz } from "@/components/tutorial/Quiz";
import { SortGame } from "@/components/tutorial/SortGame";
import { Note, Section, TutorialShell } from "@/components/tutorial/TutorialShell";
import { ArpLan } from "./ArpLan";
import { IpSubnet } from "./IpSubnet";
import { LayerStack } from "./LayerStack";
import { NatTable } from "./NatTable";
import { PortMatch } from "./PortMatch";
import { PortScanner } from "./PortScanner";
import { TcpHandshake } from "./TcpHandshake";

export const metadata: Metadata = { title: "Gün 5 — Network 1: Paket nasıl yolculuk eder? | RestoLab" };

const journey = [
  { title: "Laptop", detail: "Garson “Mətbəxə göndər”e bastı. HTTP mesajı oluştu ve katman katman paketlendi (TCP → IP → Ethernet/Wi‑Fi)." },
  { title: "Wi‑Fi", detail: "Paket radyo dalgasıyla evdeki/restorandaki router’a gider. Hedef MAC = router’ın MAC’i (ARP ile bulundu)." },
  { title: "Router (NAT)", detail: "Router, private IP’ni (192.168.0.x) kendi public IP’siyle değiştirir ve tabloya yazar. Senin evinin internete açılan tek kapısı." },
  { title: "İnternet sağlayıcı", detail: "Paket internet sağlayıcının (ör. Azercell, CityNet) ağına girer." },
  { title: "Router’lar zinciri", detail: "Onlarca router paketi elden ele taşır. Her biri sadece IP’ye bakar ve “bir sonraki durak”a yollar. Her durakta TTL 1 azalır (Gün 6: traceroute)." },
  { title: "Vercel (fra1)", detail: "Paket Frankfurt’taki Vercel sunucusuna ulaşır. Port 443’te dinleyen program paketi alır, katmanları TERSTEN açar." },
  { title: "Cevap", detail: "Cevap aynı yolu geri döner. Router NAT tablosuna bakıp cevabı doğru cihaza (senin laptop’un) verir." },
];

const tasks: { title: string; cmd: string; expect: string; why: string }[] = [
  {
    title: "Kendi IP’ni, subnet’ini ve router’ını bul",
    cmd: "ipconfig",
    expect: "IPv4 Address: 192.168.0.103 · Subnet Mask: 255.255.255.0 · Default Gateway: 192.168.0.1",
    why: "Wi‑Fi adaptörünün altına bak. Bu değerleri yukarıdaki subnet hesaplayıcıya yaz: /24 çıkmalı.",
  },
  {
    title: "İnternetin seni gördüğü IP (NAT)",
    cmd: "curl.exe -s ifconfig.me",
    expect: "85.132.x.x gibi bir PUBLIC adres — ipconfig’tekiyle aynı DEĞİL",
    why: "ipconfig = evin içindeki adresin (private). ifconfig.me = router’ın dış adresi (public). Arada NAT var.",
  },
  {
    title: "ARP cache’ine bak",
    cmd: "arp -a",
    expect: "192.168.0.1   40-3f-8c-…   dynamic",
    why: "Laptop’un öğrendiği IP → MAC eşleşmeleri. İlk satır genelde router. ff-ff-ff-ff-ff-ff = broadcast (herkese).",
  },
  {
    title: "Bilgisayarında hangi portlar dinliyor?",
    cmd: "netstat -ano | findstr LISTENING",
    expect: "TCP  0.0.0.0:135 … LISTENING 1234  ·  TCP 127.0.0.1:… LISTENING …",
    why: "0.0.0.0 = tüm ağa açık, 127.0.0.1 = sadece bu bilgisayardan. Son sütun PID (hangi program).",
  },
];

const breakTasks: { title: string; cmd: string; expect: string; why: string }[] = [
  {
    title: "Terminal 1: bir sunucu başlat (port 4000)",
    cmd: "node -e \"require('net').createServer().listen(4000, () => console.log('4000 dinleniyor'))\"",
    expect: "4000 dinleniyor  (terminal açık kalır — kapatma!)",
    why: "Basit bir TCP sunucusu: port 4000’de LISTEN durumunda.",
  },
  {
    title: "Terminal 2 (+ ile yeni terminal aç): AYNI portu tekrar dene → KIR",
    cmd: "node -e \"require('net').createServer().listen(4000)\"",
    expect: "Error: listen EADDRINUSE: address already in use :::4000",
    why: "Bir kapıyı aynı anda iki program dinleyemez. “pnpm dev” açıkken bir daha açarsan da bunu görürsün.",
  },
  {
    title: "Portu kim tutuyor? (Terminal 2)",
    cmd: "netstat -ano | findstr :4000",
    expect: "TCP  0.0.0.0:4000  0.0.0.0:0  LISTENING  <PID>",
    why: "Sonra: tasklist /fi \"PID eq <PID>\" → node.exe. Developer’ların “3000 portunu kim tutuyor?” sorusunun cevabı.",
  },
  {
    title: "Bağlantı testi: açık port",
    cmd: "Test-NetConnection 127.0.0.1 -Port 4000",
    expect: "TcpTestSucceeded : True",
    why: "PowerShell’in kendi “kapıyı çal” aracı. QA/DevOps “servis ayakta mı?” sorusunu böyle cevaplar.",
  },
  {
    title: "Kapalı port → connection refused",
    cmd: "curl.exe -s --max-time 5 http://127.0.0.1:4001; echo \"exit=$LASTEXITCODE\"",
    expect: "exit=7  (Failed to connect) — Windows’ta ~2 sn sürer",
    why: "Kapı yok → bilgisayar RST ile “burada kimse yok” der. Linux’ta anında, Windows birkaç kez tekrar dener.",
  },
  {
    title: "Ulaşılamayan adres → timeout",
    cmd: "curl.exe -s --max-time 5 http://10.255.255.1; echo \"exit=$LASTEXITCODE\"",
    expect: "exit=28  (Operation timed out) — tam 5 sn bekler",
    why: "Hiç cevap yok (firewall veya olmayan adres). Port tarayıcıdaki “filtered” ile aynı mantık. İşin bitince Terminal 1’de Ctrl+C.",
  },
];

function TaskList({ items }: { items: typeof tasks }) {
  return (
    <ol className="space-y-3">
      {items.map((t, i) => (
        <li key={t.title} className="space-y-1 rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
          <p className="font-semibold">{i + 1}. {t.title}</p>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-2 text-xs text-emerald-300">{t.cmd}</pre>
          <p className="text-xs"><b>Beklenen:</b> <code>{t.expect}</code></p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{t.why}</p>
        </li>
      ))}
    </ol>
  );
}

export default function Day5() {
  return (
    <TutorialShell day={5}>
      <Note icon="🧒">
        <p>
          <b>Bu sayfa zor geldiyse:</b> önce <a href="/tutorial/5/kolay" className="font-semibold underline">sade anlatım versiyonunu</a> yap
          (benzetmelerle, kendi cümlelerinle anlatarak). Sonra buraya dön; aynı konular, bu kez teknik adlarıyla.
        </p>
      </Note>

      <Section n={1} title="Büyük resim: laptop’tan Vercel’e">
        <p className="text-sm">Gün 3’te HTTP mesajını gördük. Ama o mesaj Frankfurt’taki sunucuya NASIL ulaşıyor? ▶ Oynat.</p>
        <FlowPlayer steps={journey} />
      </Section>

      <Section n={2} title="Katmanlar: zarf içinde zarf (encapsulation)">
        <p className="text-sm">
          Ağ işini <b>katmanlara</b> böleriz. Her katman tek bir işi yapar ve sadece kendi başlığını okur. Böylece Wi‑Fi’ı kabloyla
          değiştirsen HTTP kodun hiç değişmez. Gerçek hayatta 4 katmanlı <b>TCP/IP</b> modeli kullanılır; mülakatlarda ve kurslarda
          7 katmanlı <b>OSI</b> modeli sorulur — eşleşmesi kutularda yazıyor.
        </p>
        <LayerStack />
        <Note icon="🔑">
          <p>
            <b>En önemli fikir:</b> IP adresi yolculuk boyunca <b>değişmez</b> (Vercel’in IP’si). MAC adresi ise <b>her durakta değişir</b> —
            Ethernet sadece bir sonraki durağa kadar götüren kamyondur. Bu yüzden laptop’un çerçevesindeki hedef MAC router’ınki.
          </p>
        </Note>
      </Section>

      <Section n={3} title="IP adresi ve subnet">
        <p className="text-sm">
          IP = binanın adresi. 4 sayı, her biri 0–255 (aslında 32 bit). <b>Subnet</b> = mahalle: aynı mahalledekiler doğrudan konuşur,
          başka mahalleye mektup router üzerinden gider. <b>/24</b> “ilk 24 bit mahallenin adı” demek.
        </p>
        <IpSubnet />
        <Note icon="🏢">
          <p>
            <b>Şirkette:</b> “Container’lar 172.17.0.0/16’da”, “VPC 10.0.0.0/16”, “bu IP whitelist’te değil”. Restoranda: garson tableti
            ile mutfak yazıcısı farklı subnet’teyse yazıcı sipariş basmaz — POS kurulumlarında klasik sorun.
          </p>
        </Note>
      </Section>

      <Section n={4} title="MAC ve ARP — ve ARP spoofing">
        <p className="text-sm">
          <b>MAC</b> = ağ kartının fabrika seri numarası (a4:5e:60:…). Yerel ağda (aynı Wi‑Fi) paketler aslında MAC’e göre teslim
          edilir. <b>ARP</b> = “Şu IP kimde? MAC’ini söylesin” diye sorma protokolü.
        </p>
        <ArpLan />
        <Note icon="🛡️">
          <p>
            <b>Pentest kursunda:</b> <code>netdiscover</code> / <code>arp-scan</code> (ağdaki cihazları ARP ile bulmak),{" "}
            <code>arpspoof</code> / <code>bettercap</code> (ARP spoofing ile MITM). Hepsinin mantığı yukarıdaki simülatör. Sadece kendi
            lab ağında, izinli.
          </p>
        </Note>
      </Section>

      <Section n={5} title="Router, gateway ve NAT">
        <p className="text-sm">
          <b>Router</b> = farklı ağları birbirine bağlayan cihaz. <b>Default gateway</b> = “nereye göndereceğimi bilmiyorsam buraya”
          dediğin router. <b>NAT</b> = içerideki birçok private IP’yi tek bir public IP arkasına saklamak.
        </p>
        <NatTable />
        <Note icon="💡">
          <p>
            NAT bir yan etki olarak koruma da sağlar: internetten biri senin laptop’una <b>doğrudan</b> bağlanamaz (tabloda kaydı yok).
            “Evdeki bilgisayarıma dışarıdan erişeyim” dersen router’da <b>port forwarding</b> açman gerekir — ve bu bir saldırı yüzeyidir.
          </p>
        </Note>
      </Section>

      <Section n={6} title="Port: binadaki kapı numarası">
        <p className="text-sm">
          IP binayı bulur, <b>port</b> binadaki doğru programı (kapıyı) bulur: 0–65535. Sunucu bir portu <b>dinler</b> (LISTEN);
          istemci ise rastgele bir <b>geçici port</b> (ör. 51234) açar. <b>IP:port</b> ikilisine <b>socket</b> denir:
          <code> 192.168.0.103:51234 → 76.76.21.21:443</code>.
        </p>
        <PortMatch />
        <Note icon="🤖">
          <p>
            <i>“Sunucuyu 0.0.0.0’a bind ettim.”</i> → Sadece bu bilgisayardan değil, <b>ağdaki herkesten</b> erişilebilir yaptı
            (ör. garson tableti laptop’taki dev sunucuya bağlanabilir). <i>“127.0.0.1’e bind ettim”</i> → sadece bu bilgisayar.
            <i> “3000 doluydu, 3001’e aldım.”</i> → EADDRINUSE yaşadı (aşağıda kendin kıracaksın).
          </p>
        </Note>
      </Section>

      <Section n={7} title="TCP vs UDP — el sıkışma ve paket kaybı">
        <TcpHandshake />
      </Section>

      <Section n={8} title="Port tarama: nmap ne yapıyor?">
        <p className="text-sm">
          Port tarama = binanın kapılarını tek tek çalmak. Saldırganın da, savunanın da (pentester, DevOps) ilk adımı: “Bu sunucuda hangi
          kapılar açık? Açık olmaması gereken var mı?”
        </p>
        <PortScanner />
        <Note icon="⚖️">
          <p>
            <b>Etik ve hukuk:</b> Gerçek tarama yalnızca <b>kendi</b> sistemine, kendi lab’ına veya buna açıkça izin veren hedeflere
            (<code>scanme.nmap.org</code>) yapılır. Şirketin ya da başkasının sistemlerini izinsiz taramak birçok ülkede suçtur.
            Kendi bilgisayarında güvenle deneyebilirsin: aşağıdaki <code>Test-NetConnection</code> görevi.
          </p>
        </Note>
      </Section>

      <Section n={9} title="Gerçek terminal görevleri (kendi ağın)">
        <TaskList items={tasks} />
      </Section>

      <Section n={10} title="Kır & düzelt: EADDRINUSE, refused ve timeout">
        <p className="text-sm">İki terminal gerekecek. VS Code terminal panelindeki <b>+</b> ile ikincisini aç.</p>
        <TaskList items={breakTasks} />
        <Note icon="🔍">
          <p>
            <b>refused</b> (exit 7) = kapı yok ama bina cevap veriyor → servis çalışmıyor veya yanlış port. <b>timeout</b> (exit 28) =
            hiç cevap yok → firewall, yanlış IP veya ağ sorunu. Debug ederken ilk soru bu: <i>“Reddedildi mi, cevapsız mı kaldı?”</i>
          </p>
        </Note>
      </Section>

      <Section n={11} title="Alıştırma: paketin yolculuğunu sırala">
        <SortGame
          items={[
            "HTTP mesajı oluşur",
            "TCP başlığı eklenir (portlar)",
            "IP başlığı eklenir (IP adresleri)",
            "Ethernet/Wi‑Fi çerçevesi eklenir (MAC)",
            "Bitler havadan/kablodan gider",
            "Router çerçeveyi açar, IP’ye bakar, yeniden çerçeveler",
            "Sunucu katmanları tersten açar",
          ]}
        />
      </Section>

      <Section n={12} title="Quiz">
        <Quiz
          questions={[
            {
              q: "Laptop’undan Vercel’e giden paketin Ethernet çerçevesinde hedef MAC kimin?",
              options: ["Vercel sunucusunun", "Router’ın (default gateway)", "Broadcast (ff:ff:ff:ff:ff:ff)"],
              answer: 1,
              explain: "MAC sadece bir sonraki durağa kadar geçerlidir. Vercel başka ağda → ilk durak router.",
            },
            {
              q: "curl exit=7 (refused) ile exit=28 (timeout) arasındaki fark nedir?",
              options: [
                "Fark yok, ikisi de hata",
                "Refused: makine cevap verdi ama o portta kimse yok; timeout: hiç cevap gelmedi (firewall/ulaşılamaz)",
                "Refused: şifre yanlış; timeout: internet yavaş",
              ],
              answer: 1,
              explain: "Port taramadaki closed (RST) ↔ filtered (cevapsız) farkının aynısı.",
            },
            {
              q: "Görüntülü aramada bir an görüntü donuyor ama arama kopmuyor. Muhtemelen hangi protokol?",
              options: ["TCP — kaybolan paketi bekliyor", "UDP — kaybolan paket tekrar gönderilmedi, devam edildi", "ARP"],
              answer: 1,
              explain: "Canlı ses/görüntüde eski paketi beklemek anlamsız; UDP hızlıdır, kaybı tolere eder.",
            },
          ]}
        />
        <Note icon="📖">
          <p>
            Okumak istersen: Julia Evans — “Networking! ACK!” (çizimli, kısa) · Cloudflare Learning Center → “What is the OSI model?” ·
            “What is TCP/IP?”. Yarın (Gün 6): DNS, ping/traceroute, TLS, sniffing, firewall ve “Enter’a bastın” final animasyonu.
          </p>
        </Note>
      </Section>
    </TutorialShell>
  );
}
