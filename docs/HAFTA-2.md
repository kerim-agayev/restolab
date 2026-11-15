# Hafta 2 özeti — Gün 8–12 (Modül 1'in sonu: "Frontend'in arkasında ne var?")

> Hafta 1 (Gün 1–7) "isteğin yolculuğu"ydu: Git → HTTP → DevTools/curl → ağ → DNS/TLS → CDN/CORS.
> Hafta 2 aynı butona bu kez **tarayıcının ve sayfanın içinden** bakıyor: sayfa nasıl çiziliyor, form nasıl gidiyor, para neden float olmaz, state nerede yaşar.
> Format (CLAUDE.md #13): her gün **sade sayfa** (Feynman) + **/teknik** sayfa. Ritim: 1 gün = ~1 saat.

| Gün | Cevaplayacağı soru | Sade benzetme | Elle yapacağın | Bilerek kıracağın | Yeni terimler (max 3–4) |
|---|---|---|---|---|---|
| **8** | Sayfa kim tarafından, ne zaman çiziliyor: sunucuda mı, tarayıcıda mı? | Restoranda yemek: mutfakta hazır servis (SSR) / önceden hazırlanmış menü kartı (SSG) / masada pişirme (CSR) | Menü sayfasını 3 render türüyle yap, `view-source` ile farkı gör. Not: ROADMAP'e göre `apps/qr-menu` bu günlerde başlıyor; yeni bir Vercel projesi gerekebilir, o gün adım adım bağlarız | **Hydration error**; build-time vs runtime env (Gün 1'deki "Ortam: unknown" bug'ının akrabası) | Server/Client Component, SSR/SSG/CSR, hydration |
| **9** | "Masa aç" butonuna basınca form verisi nereye gidiyor, yanlışsa kim reddediyor? | Sipariş fişini mutfağa vermeden önce kasada kontrol (doğrulama) | Form → Server Action / Route Handler, zod ile doğrulama | **400 vs 422**: bozuk istek mi, anlamsız veri mi? | Server Action, validation (zod), 400/422 |
| **10** | Para neden `float` olmaz? Gece yarısı neden tarih kayıyor? | Kuruşları kasada tek tek saymak vs "yaklaşık" hesap; ekonomiden yuvarlama ve KDV | Adisyon toplamı (kuruş = integer), restoranın saat dilimi, UTC | `0.1 + 0.2 ≠ 0.3`; gece yarısı tarih kayması | float hatası, `price_minor`, UTC/timezone |
| **11** | Sepet bilgisi nerede durur? Tarayıcıda mı, sunucuda mı? Hangi state aracı ne zaman? | Sipariş bloknotu (tarayıcı) vs mutfaktaki resmi kayıt (sunucu) | Sipariş sepeti: cookie, localStorage; TanStack Query vs Redux Toolkit vs Zustand karşılaştırması; optimistic UI; Core Web Vitals'a giriş | localStorage'da fiyatı değiştir → **neden server'a güvenmeli** (Gün 6'daki "güven" fikrinin devamı) | server state vs client state, optimistic UI, Core Web Vitals |
| **12** | Modül 1'i bir haritada toplayabiliyor muyum? | Haftalık "ders çıkarma" toplantısı | Tekrar + quiz, Modül 1 haritası (`/tutorial` ana sayfası), Gün 4 ve 5 cevapsız soruları kapatma | — | (yeni terim yok, sadece pekiştirme) |

## Hafta içi plan önerisi
- **Pzt–Per:** Gün 8, 9, 10, 11 (her biri ayrı branch + PR + preview, sırayla merge).
- **Cum:** Gün 12 tekrar. Hafta sonu isteğe bağlı: okuma notları (📖) ve "Sen anlat" kutularına yazdıkların.

## Önceden hazırlaman gerekenler
1. **PR #8, #9, #10'u sırayla merge et** (8 → 9 → 10). Her merge'den sonra bana yaz, bir üstteki PR'ı rebase ederim.
2. Gün 4/5/6/7'den cevapsız kalan soruları ilk fırsatta yaz; "Sen anlat" kutularındaki metinleri 📋 Kopyala ile bana yapıştırırsan eksik fikri söylerim (Feynman'ın 3. adımı).
3. Gün 8'de **yeni Vercel projesi** gerekirse (qr-menu için) hesabın zaten bağlı, ekstra token yok.

## Bu haftanın Clopos köprüsü
- **Gün 8:** Clopos'ta QR menü sayfası muhtemelen hızlı açılması için önceden üretilen/cache'lenen bir sayfa. Reponda `getStaticProps`/`generateStaticParams`/`revalidate` gibi kelimelere bak.
- **Gün 10:** Fiyat/adisyon alanlarının tipi (`decimal`/`numeric` mi, integer mı?) ve restoranın saat dilimi nerede tutuluyor: ilk bakacağın iki yer.
- **Gün 11:** Frontend'de hangi state kütüphanesi var (Redux mı, başka mı)? `store`, `slice`, `useQuery` ara.

## Claude Code bana şunu derse → hangi gün
| Cümle | Gün |
|---|---|
| "Server Component yaptım / 'use client' ekledim" | 8 |
| "Hydration mismatch'i düzelttim" | 8 |
| "zod ile validate ettim, 422 dönüyorum" | 9 |
| "Para alanlarını integer'a çevirdim (minor units)" | 10 |
| "Tarihi UTC'ye çevirdim" | 10 |
| "Optimistic update ekledim", "query'yi invalidate ettim" | 11 |
