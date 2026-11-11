/** Ders listesi — /tutorial ana sayfası ve önceki/sonraki linkleri buradan okur. Her yeni günde bir satır ekle. */
export const LESSONS = [
  { day: 1, title: "Kod nasıl internete çıkar?", summary: "Git, GitHub, deploy, branch → PR → preview → merge, environment variable." },
  { day: 2, title: "Git derin: merge conflict", summary: "Git'in 4 durağı, merge vs rebase, iki developer aynı satırı değiştirince ne olur, code review." },
  { day: 3, title: "HTTP: bir isteğin içinde ne var?", summary: "Request, response, method, status code, header, body — ve bunları kendi gözünle görmek (DevTools + loglar)." },
  { day: 4, title: "DevTools Network ve curl", summary: "Network sekmeleri (Headers, Payload, Initiator, Timing, Cookies…), curl ile terminalden istek, QA bug report." },
] as const;
