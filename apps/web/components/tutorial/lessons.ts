/** Ders listesi — /tutorial ana sayfası ve önceki/sonraki linkleri buradan okur. Her yeni günde bir satır ekle. */
export const LESSONS = [
  { day: 1, title: "Kod nasıl internete çıkar?", summary: "Git, GitHub, deploy, branch → PR → preview → merge, environment variable." },
  { day: 2, title: "Git derin: merge conflict", summary: "Git'in 4 durağı, merge vs rebase, iki developer aynı satırı değiştirince ne olur, code review." },
  { day: 3, title: "HTTP: bir isteğin içinde ne var?", summary: "Request, response, method, status code, header, body — ve bunları kendi gözünle görmek (DevTools + loglar)." },
  { day: 4, title: "DevTools Network ve curl", summary: "Network sekmeleri (Headers, Payload, Initiator, Timing, Cookies…), curl ile terminalden istek, QA bug report." },
  { day: 5, title: "Network 1: Paket nasıl yolculuk eder?", summary: "Katmanlar (OSI/TCP-IP), IP & subnet, MAC & ARP (spoofing), NAT, port, TCP vs UDP, port tarama (nmap mantığı)." },
  { day: 6, title: "Network 2: İsim, yol ve güven", summary: "DNS, DHCP, ping/traceroute, TLS (HTTPS), dinleme, firewall — ve ‘Enter’a bastın’ uçtan uca yolculuk. Sade anlatım + teknik sayfa." },
] as const;
