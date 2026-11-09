/** Ders listesi — /tutorial ana sayfası ve önceki/sonraki linkleri buradan okur. Her yeni günde bir satır ekle. */
export const LESSONS = [
  { day: 1, title: "Kod nasıl internete çıkar?", summary: "Git, GitHub, deploy, branch → PR → preview → merge, environment variable." },
  { day: 2, title: "Git derin: merge conflict", summary: "Git'in 4 durağı, merge vs rebase, iki developer aynı satırı değiştirince ne olur, code review." },
] as const;
