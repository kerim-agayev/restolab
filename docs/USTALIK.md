# USTALIK.md — Öğrenmeden geçilmez (Gün 16 → son)

> Kural: [CLAUDE.md](../CLAUDE.md) §2 kural 14. Kullanıcının isteği (15 Kasım): *"Gün 16'dan sona kadar öğretmeden geçme, her konuyu mutlaka
> öğrenmemi sağla, işyeri terminolojilerini de anlayayım."*
> Claude her dersin sonunda bu tabloyu günceller. Bir gün 4 kapısı da ✅ olmadan bir sonraki derse geçilmez.

## Kapılar
| Kapı | Nasıl açılır |
|---|---|
| 🗣️ Anlattı | Final `TeachBack` metni sohbete yapıştırıldı, Claude değerlendirdi, eksikler kapandı |
| 🏁 Quiz | 3/3 (yanlış varsa yeniden anlatım + farklı soru) |
| 💥 Kırdı | "Kır" görevi yapıldı, hata kodu/log kullanıcı tarafından yorumlandı |
| 🏢 İşyeri | 5 işyeri cümlesinden ≥4'ü doğru açıklandı + "ne yapardın" |

## Durum
| Gün | Konu | 🗣️ | 🏁 | 💥 | 🏢 | Not / borç |
|---|---|---|---|---|---|---|
| 13–15 | Postgres, Prisma ERD, migrations | — | — | — | — | Kural öncesi. Gün 16'nın ilk bölümünde 15'in işyeri cümleleriyle hızlı kontrol (migration, drift, deploy sırası) |
| 16 | Register, password hashing | | | | | |
| 17 | Login, JWT, refresh token, cookie | | | | | |
| 18 | RBAC (owner / manager / waiter) | | | | | |
| 19 | Index, EXPLAIN ANALYZE | | | | | |
| 20 | İleri SQL (CTE, window, JSONB, view) | | | | | |
| 21 | Transaction, ACID, race condition | | | | | |
| 22 | Locking, deadlock, N+1, pool | | | | | |
| 23 | Backup, PITR, tekrar | | | | | |
| 24–35 | NestJS, API, multi-tenancy (Modül 3) | | | | | |

## Borçlar (geçilmiş ama tam açılmamış kapılar)
_(yok)_
