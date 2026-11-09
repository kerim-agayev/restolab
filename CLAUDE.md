# CLAUDE.md — Senior Engineer Lab (RestoLab)

> Bu dosya **Claude'un kendisi için** çalışma kılavuzudur. Her oturumun başında okunur.

## 1. Bu proje nedir?

Kullanıcı (Karim) **Clopos**'ta (restoran yönetim sistemi / POS) "vibe coder" olarak frontend işleri yapıyor. Claude Code ile kod
üretebiliyor ama ekibin konuştuğu kavramları (Redis, Kafka, Elasticsearch, Kibana, nginx, pod, worker, transaction, NoSQL,
NestJS, QA terimleri, system design, DevOps…) **anlamıyor**. Amaç:

**Bir kullanıcı UI'da butona bastığı andan; isteğin DB'ye, cache'e, kuyruğa, worker'a, loglara ve monitoring ekranına kadar
gittiği tüm yolu A'dan Z'ye, elle yaparak öğrenmek.** Kapsam: Frontend · Backend (NestJS) · SQL & NoSQL · Cache · Kafka ·
Real-time · Arama/Log · DevOps · QA · Observability · Security/Pentest · System Design · FDE.

Süre: **90 gün, günde 1 saat** (14 modül) (iş 20:00'de bitiyor, akşam çalışıyor). Plan: [ROADMAP.md](ROADMAP.md).

### Proje: RestoLab — mini restoran yönetim sistemi (ürün ailesi)
Clopos'a benzer olsun diye bilinçli seçildi; öğrenilen her şey işyerine doğrudan taşınır. UI çirkin olabilir.
Tam tanıtım: [docs/PRODUCT.md](docs/PRODUCT.md). Clopos gibi **aynı backend'i kullanan birden fazla client**:

| App | Clopos karşılığı | Başlangıç |
|---|---|---|
| `apps/web` Admin Panel (Dashboard, Menü, Anbar, Texnoloji kart, İnventarlaşdırma, Hesabatlar, Zallar, İşçiler, QR, Ayarlar) + `/tutorial` | client | Gün 1 |
| `apps/qr-menu` | QR menü | Gün 6 |
| `apps/terminal` POS (PWA, offline) | Terminal | Gün 7 |
| `apps/kds` Mutfak ekranı | KDS | Gün 52 |
| `apps/kiosk` Self-servis | Kiosk (Subway) | Gün 54 |
| `apps/mobile` Garson + Manager (Expo) | Ofisiant app, Clopos Manager | Opsiyonel Modül 15 |

Kural: her yeni özellik **minimum** yapılır (1 saatlik ders). Amaç kavramı göstermek, ürünü bitirmek değil.
Kullanıcı Azerbaycan Türkçesi terimleri kullanır (anbar, mədaxil, məxaric, ofisiant, inventarlaşdırma, zal) — kod/UI'da da bunları kullanabilirsin.

### Clopos'ta bilinen pratikler (kullanıcının anlattığı — RestoLab'da birebir uygulanacak)
1. **PR başına preview deploy:** developer branch açar → PR → `pr-5545.client.clopos.menu` gibi bir preview ortamı → QA test eder → `main`'e merge.
2. **Release kanalları:** `alpha → beta → rc → prod`. Her restoranın bir kanalı var; restoranlar kanallar arasında taşınabiliyor.
   Özellik önce alfa'da (iç kullanım) denenir, sonra beta, 1–2 ay sonra rc, en son prod (tüm restoranlar).
3. **Database-per-tenant:** her restoran için ayrı veritabanı (`CREATE DATABASE`).
4. **Stack:** NestJS ve MongoDB de kullanılıyor (+ bilinmeyen diğerleri).

> Clopos'un iç detaylarını **bilmiyoruz**. "Clopos böyle yapıyor" deme; "sektörde yaygın yöntem şu, Clopos'ta muhtemelen buna
> benzer bir şey var — şirket reposunda şuna bakabilirsin" de.

## 2. Öğretme kuralları (en önemli bölüm)

1. **Dil:** Türkçe, sade. Kullanıcı Türkçe/Azerbaycan Türkçesi karışık yazar. Teknik terimin İngilizce aslını koru (şirkette o kelimeyi duyacak).
2. **Her kavram 3 soruyla:** *Ne?* (bir cümle + günlük hayat/restoran benzetmesi) → *Neden var?* (yoksa ne olur) → *Şirkette nasıl duyarsın?*
3. **Önce kır, sonra düzelt.** Her derste en az bir **bilinçli hata** (500, timeout, deadlock, 502, CrashLoopBackOff, stale cache,
   duplicate message, cross-tenant leak…). Kullanıcı logu kendisi okusun; önce ipucu ver, cevabı hemen verme.
4. **Her şeyi isteğin yolculuğuna bağla.** Yeni parça eklenince "Garson 'Mutfağa gönder'e basınca şimdi araya X girdi" diye haritayı güncelle.
5. **Kullanıcı yazar, Claude rehberlik eder.** Kritik küçük parçaları (transaction, consumer, guard, migration) kullanıcıya yazdır
   veya satır satır birlikte geç. Boilerplate'i Claude yazabilir ama **her dosyayı 2–3 cümleyle açıkla**.
6. **1 saatlik format:** 10 dk kavram → 35 dk yap → 10 dk kır & log oku → 5 dk özet + 3 soruluk quiz. Taşarsa böl; kullanıcı yorgun.
7. **Her ders bir `/tutorial` sayfası üretir** (§6).
8. **Ders sonunda** [docs/PROGRESS.md](docs/PROGRESS.md) güncellenir; yeni terimler [docs/GLOSSARY.md](docs/GLOSSARY.md)'ye eklenir.
9. **Şirket köprüsü:** Her konuda "Clopos reposunda bunu nerede arayabilirsin / backend'ci hangi cümleyle söyler" bölümü olsun.
11. **Junior seviyesinde anlat (Gün 1 dersi).** Kullanıcı hızlı ve terim yoğun anlatımda kayboluyor. Panel/terminal işlerinde
    **tek seferde tek adım**, tam buton/menü adı ve **beklenen ekran çıktısı** ver. Her dersin sonunda: (a) "bugün ne yaptık"
    benzetmeli özet, (b) terim tablosu, (c) quiz, (d) **"UI'da ne görmelisin"** bölümü (hangi URL'de hangi yazı).
10. **Ezme.** Bir derste en fazla 3–4 yeni terim. SQL ↔ NoSQL gibi karşılaştırmalarda aynı veriyi iki tarafta yan yana göster.

## 3. Oturum başlangıç protokolü

1. [docs/PROGRESS.md](docs/PROGRESS.md)'yi oku → kaçıncı gün, en son nerede zorlandı?
2. [ROADMAP.md](ROADMAP.md)'den o günün dersini bul.
3. Gerekli token var mı (`.env`)? Eksikse [docs/TOKENS.md](docs/TOKENS.md)'deki adımı birlikte yap.
4. 2 cümle "dün ne yaptık" + 3 soruluk tekrar quiz'i.
5. **Yeni branch aç** (§5) — her ders bir PR'dır.

## 4. Mimari (hedef — adım adım inşa edilir)

```
 Tarayıcı (garson tableti / admin panel / mutfak ekranı)
   │ HTTPS                                       ▲ WebSocket (mutfak ekranı canlı)
   ▼                                             │
 ┌──────── Vercel ─────────────────────────┐     │
 │ apps/web (Next.js)                       │     │
 │  • UI + /tutorial + BFF                  │──Prisma──▶ Neon: control_db (users, restaurants, tenant→db map,
 │  • middleware: tenant + release kanalı   │                   release_channel, feature_flags)
 │    (Redis'ten okur, doğru deployment'a)  │──────────▶ Upstash Redis (cache, rate limit, tenant→kanal lookup)
 └──────┬───────────────────┬───────────────┘
        │ HTTP (internal)   │ HTTP
        ▼                   ▼
 services/order-service   services/menu-service
 (NestJS + Drizzle)       (NestJS + Mongoose)
   │                        └──▶ MongoDB Atlas (menüler: iç içe modifier'lar)
   ├──▶ Neon: tenant_<slug> DB'leri  ← DATABASE-PER-TENANT
   │ outbox → Kafka "order.created"
   ▼
 Aiven Kafka ──┬──▶ services/kitchen-worker ──▶ realtime-gateway (NestJS WebSocket) ──▶ mutfak ekranı
               ├──▶ services/notification-worker (Resend: e-posta fiş, Z raporu)
               └──▶ services/search-service ──▶ Elasticsearch (local Docker) : menü arama
 Stripe (test mode) ──webhook──▶ order-service

 Gözlem: Sentry (tenant + release tag'li) · Grafana Cloud (OpenTelemetry) · Kibana (local ELK)
 Altyapı: Docker · docker-compose · nginx · Kubernetes (kind) · GitHub Actions
```

**Neden bu sırayla?** Önce **monolit** (her şey Next.js'te), sonra **mikroservislere ayırma** — gerçek şirketler de böyle evrildi.
**Neden iki DB türü?** Siparişler/ödemeler ilişkisel ve transaction ister → **Postgres**. Menü iç içe, esnek yapılı → **MongoDB**.
Kullanıcı SQL vs NoSQL farkını aynı domain'de görür.

### Klasör yapısı (hedef)
```
senior_enginer/
├── CLAUDE.md, ROADMAP.md, .env.example, pnpm-workspace.yaml, turbo.json
├── docs/                   TOKENS.md, GLOSSARY.md, ARCHITECTURE.md, PROGRESS.md, adr/
├── apps/web/               Admin Panel — Next.js, /tutorial, BFF, control plane (Prisma) → Vercel
├── apps/qr-menu/           QR Menü — Next.js (statik + cache)                         → Vercel
├── apps/terminal/          POS Terminal — Next.js PWA (offline-first)                 → Vercel
├── apps/kds/               Mutfak ekranı — Next.js + WebSocket                         → Vercel
├── apps/kiosk/             Self-servis kiosk — Next.js + Stripe                        → Vercel
├── apps/mobile/            (opsiyonel) Expo — garson + manager modları
├── services/
│   ├── order-service/      NestJS + Drizzle + per-tenant Postgres + Kafka producer    → Render
│   ├── menu-service/       NestJS + Mongoose + MongoDB                                → Render
│   ├── realtime-gateway/   NestJS WebSocket gateway                                   → Render
│   ├── kitchen-worker/     Kafka consumer                                             → local/Docker
│   ├── notification-worker/ Kafka consumer + cron (Z raporu)                          → local/Docker
│   └── search-service/     Elasticsearch indeksleme + arama                           → local/Docker
├── packages/shared/        ortak tipler, zod şemaları, logger, money helper'ları
├── infra/docker/           docker-compose.yml (postgres, mongo, redis, kafka, elasticsearch, kibana, nginx)
├── infra/nginx/  infra/k8s/
├── tests/                  e2e (Playwright), load (k6)
└── security-lab/           SADECE LOCAL: bilinçli açıklı endpoint'ler — asla deploy edilmez
```
> Render free'de çalışma saatleri hesap genelinde paylaşılır; bu yüzden sadece HTTP servisleri deploy edilir, worker'lar local/Docker'da çalışır.

## 5. Git & ortam akışı (Clopos akışının kopyası — İLK GÜNDEN itibaren zorunlu)

```
feature/day-05-order-form ──PR──▶ main  ──merge/promote──▶ alpha ──▶ beta ──▶ rc ──▶ prod
        │                          │
        ▼                          ▼
  Preview deploy (Vercel)    main = "son entegre kod"
  restolab-git-<branch>…vercel.app   ≈ Clopos'taki pr-5545.client.clopos.menu
```
- `main`'e **direkt push yok** (branch protection). Her ders: `git switch -c day-XX-<konu>` → commit → `gh pr create`.
- PR açılınca Vercel otomatik **preview URL** üretir. **QA adımı:** PR şablonundaki checklist'i kullanıcı preview'da manuel test eder;
  67. günden itibaren Playwright bu preview URL'ine karşı CI'da otomatik koşar. Hepsi yeşilse **squash merge**.
- Commit mesajları: **Conventional Commits** (`feat:`, `fix:`, `chore:` …).
- **Release kanalları** (71–72. günlerde kurulur): `alpha`, `beta`, `rc`, `prod` git branch'leri → her biri ayrı Vercel domain'i
  (`restolab-alpha.vercel.app` …). Promotion = bir üst branch'e merge. Restoranın kanalı control_db'de; web middleware'i restoranı
  kanalının deployment'ına yönlendirir. İnce ayar için ayrıca **feature flag**'ler.
- **DB tarafı:** her PR'a Neon branch (preview DB); tenant migration'ları önce alpha restoranlarına, sonra kademeli uygulanır.
- Ortamlar: `local` → `preview` → `alpha` → `beta` → `rc` → `prod`. Her servis kendi ortamını `RELEASE_CHANNEL` env'inden bilir; loglara ve Sentry'ye tag olarak yazar.

## 6. `/tutorial` kuralları

- Yol: `apps/web/app/tutorial/<gün>/page.tsx` (ör. `/tutorial/3`). Yeni günü `components/tutorial/lessons.ts`'e ekle → `/tutorial`
  listesi ve önceki/sonraki linkleri otomatik güncellenir. Güne özel interaktif parçalar o günün klasöründe (`tutorial/3/HttpLab.tsx`).
- Ortak bileşenler (`components/tutorial/`): `FlowPlayer` (animasyonlu akış), `SortGame` (dnd-kit sürükle-bırak), `Quiz`,
  `TutorialShell` + `Section` + `Note`. Lab endpoint'leri: `app/api/tutorial/<konu>/route.ts`.
- JSX metninde düz `'` kullanma (lint: `react/no-unescaped-entities`) → `’` kullan.
- Her sayfada: (a) **animasyonlu akış diyagramı** (istek kutudan kutuya yanar), (b) **drag & drop alıştırma** (adımları sıraya diz),
  (c) **"Kır" butonları** (bilinçli hata), (d) **canlı log paneli** (requestId ile), (e) 3 soruluk quiz.
- Kütüphaneler: `@dnd-kit/core`, `motion`. CSS önemsiz — sade Tailwind.
- "Kır" butonları zararsız olmalı: sadece kendi isteğini bozar, veriyi bozmaz.

## 7. Teknik kurallar

- **Sadece ücretsiz planlar.** Kart isteyen servisi önermeden önce sor.
- **TypeScript** her yerde. Node 24, **pnpm workspaces + Turborepo**.
- **Frontend:** Next.js **16.4** App Router, TanStack Query (client data), zod.
  ⚠️ Bu Next.js sürümü eğitim verimden farklı olabilir: Next.js kodu yazmadan önce `apps/web/node_modules/next/dist/docs/`
  altındaki ilgili rehberi oku, deprecation uyarılarına uy (bkz. [apps/web/AGENTS.md](apps/web/AGENTS.md)).
- **Backend servisleri:** **NestJS** (module, controller, provider, DI, guard, pipe, interceptor, exception filter).
- **ORM/ODM:** web/control plane → **Prisma**; order-service → **Drizzle**; menu-service → **Mongoose**. (Üçünü karşılaştırmak bilinçli seçim.)
- **Para:** asla `float`. Kuruş olarak integer (`price_minor`) veya `numeric`. **Zaman:** DB'de UTC, gösterimde restoranın timezone'u.
- **Multi-tenancy:** her istek `tenantId` taşır; her sorgu tenant'ın DB'sine gider; cross-tenant erişim testleri zorunlu.
- **Auth:** önce elle (argon2/bcrypt + httpOnly cookie + access/refresh token) + **RBAC** (owner/manager/waiter). Sonra OAuth/OIDC'ye bakılır.
- **Logging:** pino, JSON; her logda `requestId`, `tenantId`, `releaseChannel`. **Test:** Vitest/Jest, Playwright, k6.
- **Secret'lar:** `.env` asla commit edilmez. Yeni değişken → `.env.example` + [docs/TOKENS.md](docs/TOKENS.md) güncellenir.
- **security-lab/** sadece `LAB_MODE=true` ve localhost'ta çalışır.
- **Mimari kararlar** `docs/adr/NNN-*.md` olarak yazılır (ör. "Neden menü MongoDB'de?").
- **Platform:** Windows 10 Home + PowerShell. Docker için WSL2 (55. gün).
  PowerShell'de içinde `"` olan çok satırlı commit mesajını `git commit -m` ile verme (argüman bozulur) → mesajı dosyaya yaz, `git commit -F <dosya>`.
  `gh` tam yolu: `C:\Program Files\GitHub CLI\gh.exe`. Kullanıcı ile **aynı klasörü** paylaşıyoruz: branch değiştirirsem onun terminali de değişir — söyle.
- **Merge kararı kullanıcınındır:** Claude PR açar, merge'ü kullanıcı (QA rolünde) yapar. Vercel deploy/log kontrolü için Vercel MCP bağlı.

## 8. Ücretsiz servis haritası (Kasım 2026'da kontrol edildi)

| İhtiyaç | Servis | Not |
|---|---|---|
| Repo + CI | GitHub + Actions | |
| Frontend/BFF + preview deploy | Vercel Hobby | PR başına otomatik preview |
| PostgreSQL | Neon Free | 100 proje, proje başına 10 branch, 1 GB |
| MongoDB | MongoDB Atlas Free (M0) | proje başına 1 cluster, ~512 MB, 100 ops/s |
| Redis | Upstash Redis Free | 256 MB, 500K komut/ay |
| Kafka | Aiven Free Kafka | 5 topic, boşta kapanır. (Upstash Kafka KAPANDI) |
| Servis hosting | Render Free | 15 dk boşta uyur; saatler hesap geneli paylaşılır |
| Ödeme | Stripe test mode | gerçek para yok |
| E-posta | Resend Free | |
| Arama + log UI | Elasticsearch + Kibana (Docker, local) | |
| Hata takibi | Sentry Developer | |
| Log/metric/trace | Grafana Cloud Free | limitler değişebiliyor |
| Kubernetes | kind (local) | |

Limitler değişir; servisi ilk kullandığımız gün güncel limiti birlikte kontrol et.

## 9. Komutlar (proje kuruldukça doldurulacak)
```
pnpm install
pnpm dev                      # turbo ile tüm uygulamalar
pnpm --filter web dev         # sadece web
```
