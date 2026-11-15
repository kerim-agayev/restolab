# Hafta 3 özeti — Gün 13–19 (16–22 Kasım): "Veri nerede yaşıyor ve kim dokunabilir?"

> Modül 1 (Gün 1–12) bitti: bir butonun **yolculuğu** ve **tarayıcı** tarafı.
> Modül 2 (Gün 13–23) yolun **sonundaki kasaya** giriyor: veritabanı (PostgreSQL), giriş (login) ve yetki.
> MSSQL’de SELECT ve window function bildiğin için bu modül senin için **en tanıdık** olanı. Her gün MSSQL ↔ Postgres köprüsü olacak.
> Format aynı (CLAUDE.md #13): sade sayfa (Feynman) + `/teknik`. Bu modülde ilk kez **gerçek bir veritabanı** ve **gerçek kullanıcılar** var.

| Gün | Tarih | Cevaplayacağı soru | Sade benzetme (ekonomi/restoran) | Elle yapacağın | Bilerek kıracağın |
|---|---|---|---|---|---|
| **13** | Pzt | Veritabanı nerede, uygulama ona nasıl bağlanıyor? | Arşiv binası + adres/anahtar (connection string). **Control plane** = holdingin merkez sicili: hangi restoran hangi defterde | ✅ **Erken yapıldı (15 Kasım):** Neon’da `control_db`, ham `pg` sürücüsüyle gerçek bağlantı lab’ı. (Prisma Gün 14’e kaydı: önce altındaki sürücüyü gör.) | Yanlış şifre → hata mesajını oku |
| **14** | Sal | Veriyi hangi tablolara bölmeliyim? | **Hesap planı**: her bilgi tek bir yerde (normalization); ilişkiler = defterler arası çapraz referans | ✅ **Erken yapıldı (15 Kasım):** Prisma 7 + ERD; `users`, `restaurants`, `memberships` (çoka-çok, rol sözleşmede), sahte seed, ilk migration (içi Gün 15’te) | Var olmayan restorana üye ekle → **FK ihlali** |
| **15** | Çar | Tabloyu canlıdayken nasıl değiştiririz? | Binanın **tadilat projeleri**: numaralı, sırayla, geri alınabilir | `prisma migrate dev`; PR başına ayrı veritabanı kopyası (Neon branch) | Plana yazılmamış elle değişiklik → **migration drift** |
| **16** | Per | Şifreyi nasıl saklarız ki çalınsa bile işe yaramasın? | Kasada şifreyi değil **parmak izini** tutmak (hash) | Restoran sahibi kaydı (register), argon2/bcrypt | Aynı e-postayla ikinci kayıt → **unique violation** |
| **17** | Cum | Sunucu “bu kişi giriş yaptı”yı nereden hatırlar? | Otel: kısa süreli **oda kartı** (access token) + resepsiyondaki kimlik (refresh token) | Login + korumalı panel, httpOnly cookie (Gün 11’deki cookie’nin devamı) | Süresi dolmuş token → **401** |
| **18** | Cmt | Garson neden Z raporunu göremesin? | İç kontrolde **görevler ayrılığı** (segregation of duties): kasiyer, onaylayan ve denetleyen aynı kişi olmaz | RBAC: owner / manager / waiter | Garson rapor sayfasına → **403** (Gün 3’teki 401 vs 403’ün gerçeği) |
| **19** | Paz | 100.000 sipariş arasında arama neden yavaş, “index ekledim” ne demek? | Kitabın sonundaki **dizin**; soyada göre sıralı telefon rehberi | 100.000 sipariş seed, `EXPLAIN ANALYZE`, B-tree ve bileşik index | Index’siz yavaş sorgu → index ekle → **ölç** (ms karşılaştırması) |

**Sonraki hafta (önizleme, Gün 20–23):** CTE / window function / JSONB (MSSQL bilgin burada parlıyor) → **transaction & ACID, race condition** (aynı masayı iki garson aynı anda açıyor) → **deadlock, N+1, connection pool** → backup ve “yanlışlıkla DELETE” sonrası geri dönme.

## Pazartesiden önce hazırlaman gerekenler (5 dakika)
1. **Neon hesabı:** https://neon.tech → *Sign up with GitHub* → proje `restolab`, region **Frankfurt**. (Adımlar: [TOKENS.md](TOKENS.md) “Gün 13–16”.) Bağlantı adreslerini Pazartesi birlikte alacağız; şimdilik sadece hesap.
2. PR’ı (Gün 8–12) preview’da gez, beğenirsen merge et.
3. İstersen Gün 12’deki “Bilanço” listesinde işaretleyemediğin satırları bana yaz: Pazartesi 5 dakikalık tekrarla başlarız.

## Bu haftanın “Claude Code bana şunu dedi” sözlüğü
| Cümle | Gün |
|---|---|
| “Connection string’i env’e koydum”, “pooled URL kullan” | 13 |
| “Prisma schema’ya relation ekledim”, “foreign key constraint fails” | 14 |
| “Migration oluşturdum”, “migration drift var”, “db push yapma, migrate kullan” | 15 |
| “Şifreyi bcrypt/argon2 ile hash’ledim”, “unique constraint failed on email” | 16 |
| “JWT süresi 15 dk, refresh token httpOnly cookie’de” | 17 |
| “Guard ekledim”, “rolü kontrol ediyorum, 403 dönüyor” | 18 |
| “Index ekledim”, “EXPLAIN’e baktım, seq scan’di” | 19 |

## Clopos köprüsü (bu hafta sorabileceğin sorular)
- “Bizde control plane (restoran → veritabanı eşlemesi) nerede tutuluyor?” (Database-per-tenant’ın merkez sicili.)
- “Migration’lar her restoran veritabanına nasıl uygulanıyor? Önce alpha restoranlara mı?”
- “Rol/yetki matrisi nerede tanımlı? NestJS’te guard mı kullanıyoruz?”

## 📖 Okuma eşlikçisi
- **DDIA** Bölüm 2 (veri modelleri: ilişkisel vs doküman) → Gün 14.
- **DDIA** Bölüm 3 (depolama ve indeks: B-tree) ve **Database Internals** Bölüm 2 → Gün 19.
