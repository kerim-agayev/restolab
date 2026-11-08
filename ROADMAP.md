# 60 Günlük Yol Haritası — "Garson butona basınca ne olur?"

**Format:** 60 gün × 1 saat. **Her ders:** 10 dk kavram → 35 dk yap → 10 dk kır & log oku → 5 dk özet + quiz.
**Her ders = 1 branch + 1 PR + 1 preview deploy + 1 `/tutorial` sayfası.** (Clopos akışı ilk günden itibaren.)
Yorgun günlerde "kır & log oku" kısmını ertesi güne at — sorun değil.

**Proje: RestoLab** — mini restoran yönetim sistemi (Clopos'a benzer): restoran kaydı, roller, menü, masa/sipariş,
mutfak ekranı, ödeme, Z raporu, menü arama.

Rol etiketleri: `FE` frontend · `BE` backend · `DB` database · `OPS` DevOps · `QA` · `SEC` güvenlik · `SD` system design

---

## Hafta 1 — Web temeli + şirket Git akışı `FE` `OPS`

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 1 | Git, GitHub, monorepo, deploy; **branch → PR → preview → merge** akışı | `gh` CLI, repo, pnpm+Turborepo, Next.js, Vercel'e ilk deploy, branch protection, ilk PR ve preview URL'i | Bozuk build → Vercel build log'unu oku |
| 2 | HTTP: request/response, method, status, header, body; IP, port, localhost, TCP | `/tutorial/1`: drag & drop "istek yolculuğu" | 404 ve 500 üret, DevTools → Network |
| 3 | DNS, CDN, HTTPS/TLS, edge; CORS | `nslookup`, `curl -v`; Vercel edge vs server | CORS hatası |
| 4 | Next.js render: Server/Client Component, SSR/SSG/CSR, hydration; Core Web Vitals | Menü sayfası 3 render türüyle | Hydration error |
| 5 | Form → Server Action/Route Handler, zod validation; **para neden float olmaz** | "Masa aç" formu | 0.1+0.2 hatası, 400 vs 422 |
| 6 | Tarayıcı state: cookie, localStorage; TanStack Query, optimistic UI, loading/error state | Sipariş sepeti (adisyon) | localStorage'da fiyatı değiştirip "hile" → neden server'a güvenmeli |
| 7 | Tekrar + quiz | `/tutorial` ana sayfası + 1. hafta haritası | — |

## Hafta 2 — SQL Database: MSSQL'den ileriye `DB` `BE`

> Database, SELECT ve window function'dan çok daha fazlası: **modelleme, constraint, index, execution plan, transaction,
> isolation, locking, migration, connection pooling, backup, replication**.

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 8 | PostgreSQL vs MSSQL, Neon (serverless, branching), connection string; **control plane** fikri | Prisma init, `control_db`: `User`, `Restaurant` | Yanlış şifre → hata mesajını oku |
| 9 | Migration (şema versiyonlama); PR başına **Neon branch** (preview DB) | `prisma migrate dev` | Migration drift |
| 10 | **Register**: password hashing, unique constraint | Restoran sahibi kaydı | Aynı email → unique violation (P2002) |
| 11 | **Login**: session vs JWT, access/refresh token, httpOnly cookie; **RBAC** (owner/manager/waiter) | Login + korumalı admin panel | Garson rolüyle rapor sayfası → 403; süresi dolmuş token → 401 |
| 12 | Index, `EXPLAIN ANALYZE`, seed | 100.000 sipariş seed | Index'siz yavaş sorgu → index → farkı ölç |
| 13 | **Transaction & ACID**, isolation level, race condition, `SELECT … FOR UPDATE`, optimistic locking, deadlock | Aynı masayı iki garson aynı anda açıyor / son porsiyonu iki kişi satıyor | Stok -1 → transaction ile düzelt; deadlock üret |
| 14 | Normalization, ilişkiler, N+1, connection pooling; **timezone (UTC)**; backup/PITR | Masa-sipariş-sipariş kalemi tabloları | N+1 → logda 101 sorgu → join ile düzelt |

## Hafta 3 — Multi-tenancy + NestJS `BE` `DB` `SD`

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 15 | **Multi-tenancy** desenleri: shared schema (`tenant_id`) vs schema-per-tenant vs **database-per-tenant**; tenant çözümleme (subdomain/header) | ADR yaz: "neden DB-per-tenant?" | `tenant_id` filtresi unutulunca başka restoranın verisi |
| 16 | **NestJS**: module, controller, service, DI, pipe, guard | `order-service` iskeleti | Provider kaydı unutuldu → DI hatası |
| 17 | **Tenant provisioning**: restoran kaydında `CREATE DATABASE tenant_<slug>` → migrate → control_db'ye kaydet | Drizzle + dinamik bağlantı (tenant'a göre) | Yarım kalan provisioning → temizlik |
| 18 | **Migration fan-out**: tüm tenant DB'lerine migration; **expand-contract** (geriye uyumlu migration) | Migration runner | Bir tenant'ta migration patlıyor → ne yaparsın? |
| 19 | REST tasarımı, pagination, **idempotency** ("mutfağa gönder"e çift basma), API versioning, Swagger | Sipariş API'si | Çift sipariş → idempotency key |
| 20 | Structured logging (pino), requestId + tenantId, NestJS exception filter; Render deploy, health check, cold start | order-service canlıda | Uyuyan servis → 30 sn cold start |
| 21 | BFF; timeout, retry, circuit breaker, graceful degradation; tekrar | web → order-service | order-service kapalı → site çökmesin |

## Hafta 4 — NoSQL (MongoDB) + Cache (Redis) `DB` `BE`

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 22 | **SQL vs NoSQL**: document, key-value, wide-column, graph; ne zaman hangisi; MongoDB Atlas | Aynı menüyü önce Postgres'te modelle (5 tablo), sonra Mongo'da (1 doküman) | — |
| 23 | **menu-service** (NestJS + Mongoose); embedding vs referencing; schema validation | Modifier'lı menü (Burger → ekstra peynir, sos seçimi) | Şemasız veri karmaşası → validation ekle |
| 24 | Mongo derin: index, **aggregation pipeline** (SQL GROUP BY/window function karşılığı), Mongo transaction | "En çok satan ürünler" hem SQL hem Mongo | Index'siz sorgu → `explain()` |
| 25 | Cache katmanları, `Cache-Control`, ETag; **Upstash Redis**, cache-aside, TTL | Menüyü cache'le, ms ölç | Cache hit vs miss logda |
| 26 | Cache invalidation, stampede; **rate limiting** | Fiyat değişince cache temizle; login 5 deneme/dk | Eski fiyat bug'ı; 429 |
| 27 | Redis veri tipleri, distributed lock, session; tenant→kanal lookup | "Bugün en çok satan" sorted set | Lock'suz çift işlem |
| 28 | **Background job**, queue vs Kafka vs RabbitMQ, **cron** (gece Z raporu), Resend; tekrar | Gün sonu raporu e-postası | Uzun işi request içinde yapınca timeout |

## Hafta 5 — Event-driven + Real-time + Entegrasyon `BE` `SD`

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 29 | Sync vs async; **Kafka**: broker, topic, partition, offset, consumer group; Aiven | Topic + console'dan mesaj | Yanlış SASL → bağlantı hatası |
| 30 | **Producer** | order-service → `order.created` | — |
| 31 | **Consumer / worker**: kitchen-worker; partition key = tenantId (sıra garantisi); at-least-once, idempotent consumer | Sipariş mutfak fişine dönüşür | Aynı mesaj 2 kez → çift fiş |
| 32 | Retry, **DLQ**, poison message | Hatalı mesaj DLQ'ya | Worker'ı kilitleyen mesaj |
| 33 | **Outbox pattern** + **Saga** (sipariş → ödeme → stok), compensation | Atomik sipariş + event | DB'ye yazıldı ama event gitmedi |
| 34 | **Real-time**: polling vs SSE vs **WebSocket**; NestJS gateway | Mutfak ekranı canlı güncellenir | Bağlantı kopunca reconnect |
| 35 | **Webhook** & ödeme entegrasyonu (Stripe test): imza doğrulama, retry, idempotency; tekrar | Ödeme alındı → sipariş "paid" | Sahte webhook → imza reddi |

## Hafta 6 — DevOps: Docker, nginx, Elasticsearch/Kibana, Kubernetes `OPS`

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 36 | **Docker** (WSL2 kurulumu), image vs container, Dockerfile, multi-stage; temel Linux komutları | order-service container'da | Image'a `.env` sızması → `.dockerignore` |
| 37 | **docker-compose** | Postgres, Mongo, Redis, Kafka + servisler tek komutla | Servis DB'den önce başlar → healthcheck |
| 38 | **nginx**: reverse proxy, load balancer | order-service × 2, round-robin'i logda gör | Replica öldür → **502** |
| 39 | **Elasticsearch**: inverted index, full-text, fuzzy, analyzer (az/tr/ru) | search-service; Kafka ile menü indeksi | "burgr" yazım hatasıyla arama |
| 40 | **Kibana / ELK**: log toplama, Discover, dashboard | Tüm servis logları | Hatayı requestId ile servisler arası takip |
| 41 | **Kubernetes** (kind): pod, deployment, service, `kubectl` | order-service K8s'te | **CrashLoopBackOff**, **OOMKilled** |
| 42 | ConfigMap, Secret, Ingress, probe'lar, HPA, rolling update/rollback; IaC (Terraform/Helm) kavramı | Yük altında scale | Bozuk versiyon → rollback |

## Hafta 7 — QA, CI/CD, Release yönetimi `QA` `OPS`

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 43 | **QA terminolojisi**: test piramidi, smoke, sanity, regression, test case/plan, bug report, severity vs priority, flaky; unit test (Vitest/Jest, NestJS testing) | Para hesabı + guard testleri | Kasıtlı bug → test yakalar |
| 44 | Integration test (Neon branch, mongodb-memory-server), mock/stub/fake, contract testing | API + DB testleri | Flaky test üret, sebebini bul |
| 45 | **Playwright e2e** — **PR preview URL'ine karşı** (Clopos'taki QA adımının otomatiği) | kayıt → menü → sipariş → ödeme | Trace viewer ile kırık test |
| 46 | **GitHub Actions CI**: lint, typecheck, test, build; branch protection, required checks; ESLint/Prettier/husky; semver, changelog | Kırmızı pipeline → merge engellenir | — |
| 47 | **Release kanalları**: `alpha/beta/rc/prod` branch'leri → ayrı deployment'lar, promotion, release notes | 4 ortam canlıda | Yanlış kanala promote |
| 48 | **Feature flag** + restoranı kanallar arası taşıma (middleware + control_db + Redis); canary, blue-green; migration'ları kanala göre | Admin panelde "restoranı beta'ya al" butonu | Prod restoranı alpha migration'ı görmüş DB'ye bağlanınca ne olur? |
| 49 | **Load test (k6)**: RPS, throughput, p95/p99, bottleneck | 100 sanal garson | Sistemin çöktüğü nokta |

## Hafta 8 — Observability, Security, System Design, FDE `OPS` `SEC` `SD`

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 50 | **Observability**: logs/metrics/traces, OpenTelemetry → Grafana; Sentry (tenant + release tag) | Bir siparişin tüm servislerdeki trace'i | Sentry'de hata → hangi kanal/restoran? |
| 51 | SLI/SLO/SLA, alert, on-call, incident, **postmortem** | "Mutfak ekranı sipariş almıyor!" tatbikatı | Gerçekçi incident çözümü |
| 52 | **OWASP Top 10**, security header'ları; SQL injection, **NoSQL injection** (`$ne`), XSS | security-lab'da saldır → düzelt | ✅ saldırı |
| 53 | Brute force, **IDOR / cross-tenant leak** (multi-tenant'ın en kritik açığı), CSRF, JWT tampering | Başka restoranın siparişini gör → düzelt | ✅ saldırı |
| 54 | SAST/DAST: OWASP ZAP, npm audit, Dependabot, CodeQL, secret scanning; saldırı nasıl görülür (WAF, 401 spike alarmı) | Kendi siteni tara | Grafana'da saldırı alarmı |
| 55 | **System design 1**: scaling, stateless, replication, read replica, sharding, CAP, consistency; gRPC vs REST vs GraphQL | "10.000 restoranlı Clopos'u tasarla" | — |
| 56 | **System design 2 + offline-first POS**: PWA, service worker, IndexedDB, senkronizasyon çakışması | İnternet kesilince sipariş al, gelince senkronla | Çevrimdışı iki cihaz aynı masayı değiştirir |
| 57 | **FDE** + ekip pratikleri: Agile/Scrum, ticket, code review, ADR; şirket reposunu Claude Code ile okumak | PR + code review simülasyonu | — |
| 58 | Tek bir tıklamanın **uçtan uca izi**: UI → Vercel → Redis → order-service → tenant DB → Kafka → worker → WebSocket → loglar → trace | — | — |
| 59 | `/tutorial` final "Büyük Harita" + mock mülakat (her rolden 5 soru) | — | — |
| 60 | Sonraki adımlar: hangi alanda derinleşeceksin? | — | — |

## Bonus modüller (60. günden sonra, istersen)

| Konu | Neden önemli |
|---|---|
| OAuth2 / OIDC / SSO | "Google ile giriş", kurumsal girişler |
| Object storage (S3 / Cloudflare R2) | Menü resimleri, presigned URL |
| GraphQL & gRPC uygulamalı | Servisler arası hızlı iletişim |
| RabbitMQ | Kafka'ya alternatif kuyruk |
| Design patterns, SOLID, clean/hexagonal architecture, DDD | Senior kod tasarımı |
| Terraform uygulamalı | Altyapıyı kodla yönetmek |
| i18n (az/tr/ru/en), accessibility | Çok dilli POS |
| GDPR / PII, audit log | Müşteri verisi güvenliği |
| LLM/AI entegrasyonu | FDE rolünün merkezinde |
| Linux, SSH, shell scripting | DevOps temeli |
