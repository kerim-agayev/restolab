# CLAUDE.md — Senior Engineer Lab (RestoLab)

> Bu dosya **Claude'un kendisi için** çalışma kılavuzudur. Her oturumun başında okunur.

## 0. ⚡ Yeni oturum: ilk 5 dakika (BUNU ATLAMA)

> Kullanıcı her yeni oturumda baştan anlatmak zorunda kalmamalı. Bu bölüm + [docs/SESSION.md](docs/SESSION.md) yeterli olmalı.
> Önceki oturumlarda yapılan hata: yeni oturum dersi **sohbette anlattı**, `/tutorial/<gün>` sayfasını yazmadı. ❌ Bu yanlış.
> **Ders = sayfa + PR.** Sohbet sadece yönlendirme, kısa durum özeti ve kullanıcının cevaplarını değerlendirmek içindir.

**Adım adım (sırayla, sessizce yap; sonra kullanıcıya 5–8 satırlık durum özeti ver):**
1. [docs/SESSION.md](docs/SESSION.md) → "Şu an" tablosu + "Adım günlüğü"nün son 5 satırı.
2. Git durumu (paylaşılan klasör!):
   `git branch --show-current; git status --short; git fetch -q; git log --oneline -3 origin/main`
   `& "C:\Program Files\GitHub CLI\gh.exe" pr list --state all --limit 5`
   → Açık PR var mı? Son PR merge edilmiş mi? Kullanıcının yaptığını PR durumundan oku, ona sorma.
3. MCP'ler: Vercel (`mcp__vercel__*`) ve Neon (`mcp__neon__*`) araçları listede mi? Neon yoksa `claude mcp get neon` çalıştır
   (bkz. §12). **Asla yeniden `mcp add` yapma.**
4. Sıradaki dersi bul: [docs/HAFTA-3.md](docs/HAFTA-3.md) (bu haftanın planı) → [ROADMAP.md](ROADMAP.md) (genel plan).
5. Kullanıcıya: 2 cümle "dün ne yaptık" + sıradaki dersin sorusu + "şimdi dersin sayfasını hazırlıyorum". Sonra **§10 ders üretim hattını** uygula.
6. Tekrar quiz'ini (3 soru) sohbete değil, yeni dersin sayfasına (`Quiz` / `Predict`) koy; sohbette sadece "sayfada cevapla" de.

### Proje durumu (anlık görüntü — kesin bilgi her zaman SESSION.md'de)
| | |
|---|---|
| Biten dersler | **Gün 1–14** (hepsi merge ✅). Gün 13–14 Modül 2'nin başı (Postgres/Neon, Prisma ERD) |
| Sıradaki | **Gün 15** migrations (Prisma migrate, Neon branch, drift) → 16 register/hash → 17 login/JWT → 18 RBAC → 19 index. Plan: HAFTA-3.md |
| Ders formatı | Her gün: `/tutorial/<gün>` (sade, Feynman) + `/tutorial/<gün>/teknik` + `Sims.tsx` + gerekiyorsa `app/api/tutorial/<konu>/route.ts` |
| Canlı | https://restolab-kappa.vercel.app (Vercel bölgesi **fra1**, Neon **eu-central-1** → sorgu ~2 ms) |
| Repo | https://github.com/kerim-agayev/restolab — sadece **squash merge**, merge'ü **kullanıcı** yapar |
| Veritabanı | Neon proje `summer-sunset-24930758`, branch `production`, database **`control_db`** (tablolar: `users`, `restaurants`, `memberships`, `_prisma_migrations`; sahte seed) |

## 1. Bu proje nedir?

Kullanıcı (Karim) **Clopos**'ta (restoran yönetim sistemi / POS) "vibe coder" olarak frontend işleri yapıyor. Claude Code ile kod
üretebiliyor ama ekibin konuştuğu kavramları (Redis, Kafka, Elasticsearch, Kibana, nginx, pod, worker, transaction, NoSQL,
NestJS, QA terimleri, system design, DevOps…) **anlamıyor**. Amaç:

**Bir kullanıcı UI'da butona bastığı andan; isteğin DB'ye, cache'e, kuyruğa, worker'a, loglara ve monitoring ekranına kadar
gittiği tüm yolu A'dan Z'ye, elle yaparak öğrenmek.** Kapsam: Frontend · Backend (NestJS) · SQL & NoSQL · Cache · Kafka ·
Real-time · Arama/Log · DevOps · QA · Observability · Security/Pentest · System Design · FDE.

Süre: **92 gün, günde 1 saat** (14 modül) (iş 20:00'de bitiyor, akşam çalışıyor). Plan: [ROADMAP.md](ROADMAP.md).

### Proje: RestoLab — mini restoran yönetim sistemi (ürün ailesi)
Clopos'a benzer olsun diye bilinçli seçildi; öğrenilen her şey işyerine doğrudan taşınır. UI çirkin olabilir.
Tam tanıtım: [docs/PRODUCT.md](docs/PRODUCT.md). Clopos gibi **aynı backend'i kullanan birden fazla client**:

| App | Clopos karşılığı | Başlangıç |
|---|---|---|
| `apps/web` Admin Panel (Dashboard, Menü, Anbar, Texnoloji kart, İnventarlaşdırma, Hesabatlar, Zallar, İşçiler, QR, Ayarlar) + `/tutorial` | client | Gün 1 |
| `apps/qr-menu` | QR menü | ertelendi (Gün 8 render dersi `/tutorial/8` içinde yapıldı; ayrı app ilk ihtiyaçta) |
| `apps/terminal` POS (PWA, offline) | Terminal | ertelendi (Gün 9 form dersi `/tutorial/9` içinde) |
| `apps/kds` Mutfak ekranı | KDS | Gün 54 |
| `apps/kiosk` Self-servis | Kiosk (Subway) | Gün 56 |
| `apps/mobile` Garson + Manager (Expo) | Ofisiant app, Clopos Manager | Opsiyonel Modül 16 |

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
7. **Her ders bir `/tutorial` sayfası üretir** (§6, üretim hattı §10). Ders sohbette anlatılmaz: önce sayfa + PR, sohbet yönlendirir.
8. **Ders sonunda** [docs/PROGRESS.md](docs/PROGRESS.md) güncellenir; yeni terimler [docs/GLOSSARY.md](docs/GLOSSARY.md)'ye eklenir.
9. **Şirket köprüsü:** Her konuda "Clopos reposunda bunu nerede arayabilirsin / backend'ci hangi cümleyle söyler" bölümü olsun.
11. **Junior seviyesinde anlat (Gün 1 dersi).** Kullanıcı hızlı ve terim yoğun anlatımda kayboluyor. Panel/terminal işlerinde
    **tek seferde tek adım**, tam buton/menü adı ve **beklenen ekran çıktısı** ver. Her dersin sonunda: (a) "bugün ne yaptık"
    benzetmeli özet, (b) terim tablosu, (c) quiz, (d) **"UI'da ne görmelisin"** bölümü (hangi URL'de hangi yazı).
12. **Network ve pentest köprüsü.** Kullanıcı Udemy'de bir **ethical hacking / pentest kursu** aldı. Network (Gün 5–6) ve güvenlik
    (Modül 12) derslerinde konuları kursla ilişkilendir (nmap, Wireshark, ARP spoofing/MITM, recon). Network kullanıcının
    "anlamadığı ama çok önemli" dediği konu: A'dan Z'ye ama **gerektiği kadar**, bol animasyon ve simülatörle.
    **Etik kural:** gerçek tarama/saldırı sadece kendi makinesine, kendi projesine (security-lab) veya buna açıkça izin veren
    hedeflere (ör. `scanme.nmap.org`) yapılır. Clopos'un ya da başkasının sistemlerine izinsiz tarama önerme; simülatör kullan.
13. **Feynman tekniği, ezber yok (Gün 5 sonrası kalıcı kural).** Kullanıcı **ekonomi** okudu (IT geçmişi yok) ve ezberlemekten
    nefret ediyor. Her ders **önce sade, sonra teknik**: ana sayfa `/tutorial/<gün>` = **sade anlatım** (Feynman döngüsü:
    🧒 hikâye → 🎮 dokun → 🔮 tahmin et → 🗣️ sen anlat (`TeachBack`) → 🏷️ en son teknik adı (`TermCard`); bölümler `Reveal` ile tek tek
    açılır), `/tutorial/<gün>/teknik` = terminal görevleri, "kır" görevleri, cheat sheet, derin simülatörler. Benzetmeler:
    restoran + **ekonomi** (tedarik zinciri, arz-talep, kıt kaynak, hız↔güvenilirlik takası, asimetrik bilgi, güven/itibar).
    Bileşenler: `components/tutorial/Feynman.tsx`. Terim önce değil **sonra** gelir; bir bölümde en fazla 3 yeni terim.
    (Gün 5 istisna: ana sayfa teknik, sade versiyon `/tutorial/5/kolay`.)
10. **Ezme.** Bir derste en fazla 3–4 yeni terim. SQL ↔ NoSQL gibi karşılaştırmalarda aynı veriyi iki tarafta yan yana göster.

## 3. Oturum başlangıç protokolü

Kısa hâli §0'da. Ek kurallar:
- **SESSION.md her önemli adımdan sonra HEMEN güncellenir** ("Şu an" tablosu + "Adım günlüğü"ne bir satır): branch açıldı, PR açıldı,
  preview doğrulandı, kullanıcı takıldı, kullanıcı cevap verdi, MCP/servis kuruldu. Oturum kopsa bile sonraki oturum buradan devam eder.
- [docs/PROGRESS.md](docs/PROGRESS.md) → ders bazlı özet + "zorlandığı" sütunu (kullanıcının TeachBack/quiz cevaplarından doldur).
- Token/servis eksikse [docs/TOKENS.md](docs/TOKENS.md)'deki adımı **tek adım tek adım** birlikte yap (önce "neden gerekli" anlat — kural 11).
- Kullanıcının bekleyen cevapları SESSION.md "Cevap bekleyen sorular" satırında. Uygun derste kısaca sor, zorlama.
- Paylaşılan klasör: kullanıcıyla **aynı klasörü** kullanıyoruz. Aynı anda iki Claude oturumu bu klasörde çalışmamalı (dosyalar karışır).
  Branch değiştirince kullanıcıya "senin terminalin de X branch'ine geçti" de.

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
  69. günden itibaren Playwright bu preview URL'ine karşı CI'da otomatik koşar. Hepsi yeşilse **squash merge**.
- Commit mesajları: **Conventional Commits** (`feat:`, `fix:`, `chore:` …).
- **Release kanalları** (73–74. günlerde kurulur): `alpha`, `beta`, `rc`, `prod` git branch'leri → her biri ayrı Vercel domain'i
  (`restolab-alpha.vercel.app` …). Promotion = bir üst branch'e merge. Restoranın kanalı control_db'de; web middleware'i restoranı
  kanalının deployment'ına yönlendirir. İnce ayar için ayrıca **feature flag**'ler.
- **DB tarafı:** her PR'a Neon branch (preview DB); tenant migration'ları önce alpha restoranlarına, sonra kademeli uygulanır.
- Ortamlar: `local` → `preview` → `alpha` → `beta` → `rc` → `prod`. Her servis kendi ortamını `RELEASE_CHANNEL` env'inden bilir; loglara ve Sentry'ye tag olarak yazar.

## 6. `/tutorial` kuralları

- Yol: `apps/web/app/tutorial/<gün>/page.tsx` (ör. `/tutorial/3`). Yeni günü `components/tutorial/lessons.ts`'e ekle → `/tutorial`
  listesi ve önceki/sonraki linkleri otomatik güncellenir. Güne özel interaktif parçalar o günün klasöründe (`tutorial/3/HttpLab.tsx`).
- Ortak bileşenler (`components/tutorial/`): `FlowPlayer` (animasyonlu akış), `SortGame` (dnd-kit sürükle-bırak), `Quiz`,
  `TutorialShell` + `Section` + `Note`. Lab endpoint'leri: `app/api/tutorial/<konu>/route.ts`.
- **Gün 6+ yapısı:** `tutorial/<gün>/page.tsx` (sade, Feynman bileşenleriyle) + `tutorial/<gün>/Sims.tsx` + `tutorial/<gün>/teknik/page.tsx`.
  Sade sayfada her bölümün sonunda `TeachBack`, sayfa sonunda "final" `TeachBack` + `Quiz`. Güvenlik/pentest konuları simülatörle,
  sahte verilerle ve savunma çerçevesinde anlatılır.
- JSX metninde düz `'` kullanma (lint: `react/no-unescaped-entities`) → `’` kullan.
- Her sayfada: (a) **animasyonlu akış diyagramı** (istek kutudan kutuya yanar), (b) **drag & drop alıştırma** (adımları sıraya diz),
  (c) **"Kır" butonları** (bilinçli hata), (d) **canlı log paneli** (requestId ile), (e) 3 soruluk quiz,
  (f) ilgiliyse **"Claude Code bunu söylerse ne demek?"** kutusu (`<Note icon="🤖">`) — kullanıcının asıl hedefi Claude Code'un ve
  developer'ların cümlelerini anlamak (bkz. ROADMAP "Claude Code bana şunu dedi" tablosu). İlgili kitap bölümü varsa (DDIA, Database
  Internals) dersin sonunda "📖 Okumak istersen" notu.
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
- **Platform:** Windows 10 Home + PowerShell. Docker için WSL2 (57. gün).
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

## 9. Komutlar
```
pnpm install                                   # postinstall → prisma generate
pnpm --filter web dev                          # http://localhost:3000 (test için farklı port: apps/web içinde npx next dev -p 3014)
pnpm --filter web build                        # prisma generate && next build (Vercel'in yaptığı)
pnpm --filter web exec eslint .                # lint (generated/ ignore'lu)
pnpm --filter web exec tsc --noEmit            # tip kontrolü
pnpm --filter web db:validate | db:format      # Prisma şema kontrol / biçim
pnpm --filter web exec prisma migrate dev --name <ad>   # yeni migration (UNPOOLED adres, prisma.config.ts)
pnpm --filter web db:seed                      # prisma/seed.sql (idempotent, sahte veri)
pnpm --filter web db:studio                    # Prisma Studio (Prisma 7: port RASTGELE, terminalde yazanı aç)
& "C:\Program Files\GitHub CLI\gh.exe" pr create --base main --head <branch> --title "..." --body-file <dosya>
```

## 10. Ders üretim hattı (Definition of Done) — HER GÜN AYNI

Bir ders ancak şunların hepsi bitince "hazır"dır. Sırayı koru; adımları kullanıcıya sormadan yap (sadece ücretli servis, Neon'da yazma/şema/branch, secret paylaşımı için sor).

1. **Branch:** `git switch main; git pull --ff-only; git switch -c day-XX/<konu>` — her zaman **main'den** (stacked PR yok; bkz. §11).
2. **Plan:** HAFTA-3.md/ROADMAP satırını oku → dersin tek sorusu, ekonomi/restoran benzetmesi, elle yapılacak iş, bilerek kırılacak şey.
   Next.js/Prisma API'si yazmadan önce **kurulu paketin** dokümanına/tiplerine bak (`apps/web/node_modules/next/dist/docs/`, `node_modules/.pnpm/...`).
3. **Lab (gerekiyorsa):** `apps/web/app/api/tutorial/<konu>/route.ts` — JSON log (`msg: "tutorial.<konu>"`, `requestId`), `cache-control: no-store`,
   "kır" senaryoları **zararsız** (yazma → transaction + bilerek ROLLBACK; secret asla cevapta/logda yok). Örnek: `api/tutorial/erd/route.ts`.
4. **Sayfalar** (örnek al: `apps/web/app/tutorial/14/`):
   - `tutorial/<gün>/Sims.tsx` (`"use client"`): 3–5 simülatör (dokun-gör), biri gerçek lab'a bağlı.
   - `tutorial/<gün>/page.tsx` (sade): `TutorialShell` → giriş `Econ` → 4–5 `Chapter` (her biri: `Story` → `Try`(Sim) → `Predict` → `TeachBack` → `TermCard` ≤3 terim)
     → final `TeachBack` → 3 soruluk `Quiz` → "👀 UI’da ne görmelisin?" listesi → teknik sayfa linki. İlgiliyse `Note icon="🤖"` (Claude Code bunu derse…).
     Önceki günün tekrar sorularını ilk bölümde `Predict` veya küçük bir `Quiz` olarak ver.
   - `tutorial/<gün>/teknik/page.tsx`: `TaskList` görevleri (`title/cmd/expect/why`) — Neon SQL Editor, terminal, DevTools; "Kır ve oku";
     cheat sheet; dosya haritası; 🏢 Clopos köprüsü; 📖 okuma notu.
   - `components/tutorial/lessons.ts`'e satır ekle.
   - **`expect` alanlarına sadece GERÇEKTEN çalıştırıp gördüğün çıktıyı yaz** (local'de veya Neon'da dene; şifreyi maskele).
5. **Doğrula (local):** `eslint .` + `tsc --noEmit` + `pnpm --filter web build` temiz; dev sunucusunda sayfalar 200; lab endpoint'inin her senaryosu curl ile.
6. **Dokümanlar:** PROGRESS.md (yeni satır), GLOSSARY.md (yeni terimler), SESSION.md (Şu an + günlük), HAFTA-3.md (✅), yeni env varsa `.env.example` + TOKENS.md.
7. **Secret kontrolü:** `git add -A -- . ':!ogrenilecekler.txt'` → staged diff'te DB şifresi yok mu kontrol et (bkz. §11).
8. **Commit + PR:** mesajı dosyaya yaz → `git commit -F <dosya>` (Conventional Commits, Co-Authored-By satırı). PR gövdesi: ne var + **QA checklist** (preview'da işaretlenecek maddeler).
9. **Preview doğrula:** Vercel MCP `list_deployments` (branch) → READY bekle (build ~30 sn + deploy) → `web_fetch_vercel_url` ile lab endpoint'i ve sayfa (koruma var, curl çalışmaz).
10. **Kullanıcıya teslim:** preview linki (`https://restolab-git-<branch-slug>-kerimagayevs-projects.vercel.app/tutorial/<gün>`), ne yapacağı (tek tek adım),
    "UI’da ne görmelisin" tablosu, PR linki, "bitince ‘XX merge ettim’ yaz". Merge'ü **kullanıcı** yapar.

## 11. Bilinen tuzaklar (yaşandı — tekrar yaşama)

| Tuzak | Doğrusu |
|---|---|
| Dersi sohbette anlatmak, sayfa yazmamak | §10. Ders = sayfa + PR |
| Stacked PR (bir branch'i diğerinin üstüne açmak) + squash merge → çakışma | Her ders main'den. Olduysa: `git rebase --onto origin/main <eski-taban> <branch>` + `push --force-with-lease` |
| Kullanıcı PR'ı, son commit'ler girmeden merge etti (#12'de fra1 kaçtı) | Push'tan sonra "PR'a X commit eklendi" de; merge sonrası `git diff <squash-commit> origin/<branch> --stat` ile kaçan var mı kontrol et |
| Secret'ı `.env.example`'a yapıştırmak | Gerçek değer: `apps/web/.env.local` (git-ignored) + Vercel (Secret). Şifreyi hiçbir çıktıda gösterme (`sed -E 's#://[^@]*@#://***@#g'`) |
| `ogrenilecekler.txt` | Kullanıcının kişisel notu, **asla commit etme** (`':!ogrenilecekler.txt'`) |
| Eski panel terimleri ("Sensitive") | Vercel paneli şu an **Secret / Config** diyor. Panel adımı yazmadan önce güncel adı doğrula |
| `react-hooks/purity` lint: `Date.now()`, `performance.now()`, `Math.random()` component/handler içinde | Sayaç kullan veya zamanı sunucudan al |
| JSX'te düz `'` | `’` kullan (`react/no-unescaped-entities`) |
| PowerShell: çok satırlı/tırnaklı `git commit -m` | Mesajı dosyaya yaz → `git commit -F` |
| `findstr` minified HTML'de "Line too long", Türkçe karakter bozuk | `Select-String -SimpleMatch "..." -Quiet` |
| Python `print` Türkçe 'ı' → cp1252 hatası | Dosyaya `encoding="utf-8"` yaz, ekrana basma |
| Uzun Python/heredoc'u Bash'e satır içi vermek tırnakları bozuyor | Script'i scratchpad'e dosya olarak yaz, sonra çalıştır |
| `Start-Sleep` / foreground `sleep` engelli | Bash `run_in_background` ile bekle, bildirim gelince devam |
| npm `latest` bazen RC (prisma `latest` = 8.0.0-rc) | `npm view <pkg> dist-tags` → stabil sürümü sabitle (Prisma **7.10.1**) |
| `prisma init` repoya ajan skill klasörleri (`.claude/skills`, `.agents`…) ekliyor | Repoda çalıştırma; dosyaları elle yaz (yapıldı) |
| Prisma 7: `.env` otomatik okunmaz; client `generated/prisma` (git'e girmez) | `prisma.config.ts` → `process.loadEnvFile(".env.local")`; build = `prisma generate && next build` |
| Turbo build uyarısı "DATABASE_URL missing from turbo.json" | Sadece build adımı için; runtime'da değişkenler var. Build sırasında DB gerekirse `turbo.json` `env`'e ekle |
| Vercel Hobby varsayılan bölge iad1 (ABD) | `apps/web/vercel.json` → `"regions": ["fra1"]` (yapıldı) |
| Preview alias'ını build READY olmadan açmak → 404 önbelleğe girer (`x-vercel-cache: HIT`) | Önce `get_deployment` → READY bekle; şüphede deploy'un kendi URL'ini veya `?r=1` ile dene. Kullanıcıya: “Ctrl+F5” |
| Neon MCP "yok" sanmak | §12: araçlar oturum başında yüklenir; `claude mcp get neon` → Connected ise kullanıcıya "yeni sohbet aç" de |
| Güvenlik/pentest içeriği | Sadece simülatör, sahte veri, savunma çerçevesi (kural 12) |

## 12. Altyapı kimlikleri ve bağlantılar (secret DEĞİL)

| Ne | Değer |
|---|---|
| Vercel proje | `prj_xE3WViPql3CatzxFXeYZ4Rmp6JiP` · team slug `kerimagayevs-projects`. Vercel MCP ile: deploy listesi, build log, runtime log, env (Secret), redeploy |
| Vercel env (Production + Preview, Secret) | `DATABASE_URL` (pooled, `-pooler` host) · `DATABASE_URL_UNPOOLED` (direkt; migrate) · `RELEASE_CHANNEL` |
| Preview URL kalıbı | `https://restolab-git-<branch, / yerine ->-kerimagayevs-projects.vercel.app` (Deployment Protection açık → Vercel MCP `web_fetch_vercel_url`) |
| Neon | proje `summer-sunset-24930758` · org `org-winter-block-25416581` · region eu-central-1 · Postgres 18 · DB `control_db` · rol `neondb_owner` · `sslmode=verify-full` |
| Neon MCP | `claude mcp add --scope user --transport http neon "https://mcp.neon.tech/mcp?projectId=summer-sunset-24930758"` (yapıldı, OAuth, **user scope**). Kontrol: `claude mcp get neon` → `✔ Connected`. Araçlar sohbette yoksa ve auth tamamsa **yeni sohbet** gerekir. Yazma/şema/branch işlemlerinden önce kullanıcıya sor; deneme işleri Neon branch'te |
| Local secret dosyası | `apps/web/.env.local` (iki URL). Okurken şifreyi maskele |
| Kod haritası (DB) | `apps/web/lib/db.ts` (ham pg pool, Gün 13) · `apps/web/lib/prisma.ts` (Prisma + adapter-pg, Gün 14) · `apps/web/prisma/` (schema, migrations, seed.sql) · `apps/web/prisma.config.ts` |
| Ortak ders bileşenleri | `components/tutorial/`: `Feynman.tsx` (Chapter, Reveal, Story, Econ, Try, Predict, TeachBack, TermCard, Deeper), `TaskList.tsx`, `Quiz.tsx`, `TutorialShell.tsx` (TutorialShell, Section, Note), `FlowPlayer`, `SortGame`, `lessons.ts` |
