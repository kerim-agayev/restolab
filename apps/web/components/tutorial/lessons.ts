/** Ders listesi — /tutorial ana sayfası ve önceki/sonraki linkleri buradan okur. Her yeni günde bir satır ekle. */
export const LESSONS = [
  { day: 1, title: "Kod nasıl internete çıkar?", summary: "Git, GitHub, deploy, branch → PR → preview → merge, environment variable." },
  { day: 2, title: "Git derin: merge conflict", summary: "Git'in 4 durağı, merge vs rebase, iki developer aynı satırı değiştirince ne olur, code review." },
  { day: 3, title: "HTTP: bir isteğin içinde ne var?", summary: "Request, response, method, status code, header, body — ve bunları kendi gözünle görmek (DevTools + loglar)." },
  { day: 4, title: "DevTools Network ve curl", summary: "Network sekmeleri (Headers, Payload, Initiator, Timing, Cookies…), curl ile terminalden istek, QA bug report." },
  { day: 5, title: "Network 1: Paket nasıl yolculuk eder?", summary: "Katmanlar (OSI/TCP-IP), IP & subnet, MAC & ARP (spoofing), NAT, port, TCP vs UDP, port tarama (nmap mantığı)." },
  { day: 6, title: "Network 2: İsim, yol ve güven", summary: "DNS, DHCP, ping/traceroute, TLS (HTTPS), dinleme, firewall — ve ‘Enter’a bastın’ uçtan uca yolculuk. Sade anlatım + teknik sayfa." },
  { day: 7, title: "HTTPS, CDN ve CORS", summary: "http→https ve HSTS, CDN/edge cache (x-vercel-cache canlı lab), CORS’un neden hata verdiği, hata teşhis oyunu." },
  { day: 8, title: "Sayfa kim tarafından, ne zaman çiziliyor?", summary: "SSG / SSR / CSR (üç mutfak), Server vs Client Component, hydration — ve aynı saatin üç şekilde çizildiği canlı lab." },
  { day: 9, title: "Form nereye gidiyor, kim reddediyor?", summary: "“Masa aç” formu: Server Action + Route Handler, zod ile tek kural, tarayıcı vs sunucu kontrolü, 400 / 422 / 409." },
  { day: 10, title: "Para neden float olmaz, gece yarısı neden kayar?", summary: "0.1 + 0.2, qəpik ile tam sayı, hesap bölme ve ƏDV yuvarlaması, UTC vs Bakı saati, Z raporu iş günü." },
  { day: 11, title: "Sepet nerede durur? State, güven ve hız", summary: "localStorage sepeti ve sunucuda fiyat kontrolü, server vs client state (TanStack / Redux / Zustand), optimistic UI, Core Web Vitals." },
  { day: 12, title: "Modül 1 tekrarı: tek butonun tüm yolculuğu", summary: "Modül haritası, uçtan uca sıralama, açık kalan sorular, 8 soruluk sınav, terminal sınavı ve öz-değerlendirme." },
  { day: 13, title: "Veri nerede yaşıyor? PostgreSQL ve Neon", summary: "MSSQL→Postgres lehçesi, bağlantı adresi (secret), gerçek control_db lab’ı ve hata kodları, connection pool (santral), control plane." },
  { day: 14, title: "Veriyi hangi tablolara bölmeliyim?", summary: "Tek büyük Excel’in sorunu (normalization), bir–çok / çok–çok, ERD, primary & foreign key, Prisma şeması — ve gerçek veritabanında FK ihlali (23503)." },
] as const;
