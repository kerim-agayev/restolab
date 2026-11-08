# 90 Günlük Yol Haritası — "Garson butona basınca ne olur?"

**Format:** 90 gün × 1 saat. **Her ders:** 10 dk kavram → 35 dk yap → 10 dk kır & log oku → 5 dk özet + quiz.
**Her ders = 1 branch + 1 PR + 1 preview deploy + 1 `/tutorial` sayfası** (Clopos akışı ilk günden itibaren).
Yorgun günlerde "kır & log oku" kısmını ertesi güne at — sorun değil. Her modülün sonunda bir tekrar günü var.

**Proje: RestoLab** — mini restoran yönetim sistemi (Clopos'a benzer): restoran kaydı, roller, menü, masa/sipariş,
mutfak ekranı, ödeme, Z raporu, menü arama.

| Modül | Günler | Konu | Rol |
|---|---|---|---|
| 1 | 1–10 | Web temeli + Git akışı | `FE` `OPS` |
| 2 | 11–21 | SQL Database (MSSQL'den ileriye) + Auth | `DB` `BE` |
| 3 | 22–33 | NestJS, API tasarımı, Multi-tenancy | `BE` `DB` `SD` |
| 4 | 34–38 | NoSQL — MongoDB | `DB` |
| 5 | 39–44 | Cache (Redis) + Background job + Cron | `BE` |
| 6 | 45–54 | Event-driven (Kafka), Real-time, Webhook | `BE` `SD` |
| 7 | 55–60 | Docker, nginx, Elasticsearch, Kibana | `OPS` |
| 8 | 61–63 | Kubernetes | `OPS` |
| 9 | 64–68 | QA & Test | `QA` |
| 10 | 69–73 | CI/CD + Release kanalları (alpha/beta/rc/prod) | `OPS` `QA` |
| 11 | 74–77 | Observability + Incident | `OPS` |
| 12 | 78–82 | Security / Pentest | `SEC` |
| 13 | 83–87 | System Design, Offline-first, FDE | `SD` |
| 14 | 88–90 | Final | hepsi |

---

## Modül 1 — Web temeli + şirket Git akışı (Gün 1–10)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 1 | Git, GitHub, monorepo, deploy; branch → PR → preview → merge | `gh`, repo, pnpm+Turborepo, Next.js, Vercel ilk deploy, ilk PR + preview URL | Bozuk build → Vercel build log'u |
| 2 | Git derin: branch, merge vs rebase, conflict, PR review, Conventional Commits | İki branch'te aynı satırı değiştir | **Merge conflict** çöz |
| 3 | HTTP: request/response, method, status, header, body | `/tutorial/1`: drag & drop "istek yolculuğu"; DevTools → Network | 404, 500 |
| 4 | Ağ temeli: IP, port, localhost, TCP/UDP, DNS | `nslookup`, `curl -v`, `netstat` | Port zaten kullanımda (EADDRINUSE) |
| 5 | HTTPS/TLS, CDN, edge; CORS | Vercel edge vs server | CORS hatası |
| 6 | Next.js render: Server/Client Component, SSR/SSG/CSR, hydration | Menü sayfası 3 render türüyle | Hydration error; build-time vs runtime env |
| 7 | Form → Server Action / Route Handler, zod validation | "Masa aç" formu | 400 vs 422 |
| 8 | **Para neden float olmaz**, timezone (UTC), i18n'e giriş | Adisyon toplamı, restoran saati | 0.1 + 0.2 ≠ 0.3; gece yarısı tarih kayması |
| 9 | Tarayıcı state: cookie, localStorage; TanStack Query, optimistic UI; Core Web Vitals | Sipariş sepeti | localStorage'da fiyatı değiştir → neden server'a güvenmeli |
| 10 | Tekrar + quiz | `/tutorial` ana sayfası + Modül 1 haritası | — |

## Modül 2 — SQL Database + Auth (Gün 11–21)

> Database, SELECT ve window function'dan çok daha fazlası: modelleme, constraint, index, execution plan,
> transaction, isolation, locking, migration, pooling, backup, replication.

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 11 | PostgreSQL vs MSSQL, Neon (serverless, branching), connection string; **control plane** fikri | Prisma init, `control_db` | Yanlış şifre → hata mesajı |
| 12 | Modelleme: ERD, normalization, 1-N / N-N, constraint (PK, FK, UNIQUE, CHECK) | `User`, `Restaurant`, `Membership` | FK ihlali |
| 13 | Migration; PR başına Neon branch (preview DB) | `prisma migrate dev` | Migration drift |
| 14 | **Register**: password hashing (argon2/bcrypt) | Restoran sahibi kaydı | Aynı email → unique violation |
| 15 | **Login**: session vs JWT, access/refresh token, httpOnly cookie | Login + korumalı panel | Süresi dolmuş token → 401 |
| 16 | **RBAC**: owner / manager / waiter | Rol bazlı sayfa & aksiyon | Garson rapor sayfasına → 403 |
| 17 | Index (B-tree, composite), `EXPLAIN ANALYZE`, seed | 100.000 sipariş seed | Index'siz yavaş sorgu → index → ölç |
| 18 | İleri SQL (Postgres'te): CTE, window function, JSONB, view, materialized view | Günlük ciro raporu | MSSQL vs Postgres söz dizimi farkları |
| 19 | **Transaction & ACID**, isolation levels, race condition | Aynı masayı iki garson aynı anda açıyor | Stok -1 → transaction ile düzelt |
| 20 | Locking: `FOR UPDATE`, optimistic locking, **deadlock**; N+1; connection pooling | Masa-sipariş-kalem | Deadlock üret; N+1 → 101 sorgu |
| 21 | Backup / PITR, replication'a giriş; tekrar | Neon'da zamanda geri dön | "Yanlışlıkla DELETE" → restore |

## Modül 3 — NestJS, API, Multi-tenancy (Gün 22–33)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 22 | Monolit vs mikroservis; **NestJS**: module, controller, service | `order-service` iskeleti | — |
| 23 | Dependency Injection, provider, ConfigModule; pipe & validation | DTO doğrulama | Provider kaydı unutuldu → DI hatası |
| 24 | Guard, interceptor, exception filter; web ile JWT paylaşımı | Auth guard + süre ölçen interceptor | Token'sız istek → 401 |
| 25 | REST tasarımı, pagination (offset vs cursor), API versioning, Swagger | Sipariş API'si + `/docs` | Offset'in 5000. sayfada yavaşlaması |
| 26 | **Idempotency** | "Mutfağa gönder"e çift basma koruması | Çift sipariş → idempotency key |
| 27 | Structured logging (pino), requestId + tenantId, correlation | Servisler arası log takibi | Hatayı sadece requestId ile bul |
| 28 | **Multi-tenancy** desenleri: shared schema vs schema-per-tenant vs DB-per-tenant | ADR: "Neden DB-per-tenant?" | `tenant_id` filtresi unutulunca veri sızması |
| 29 | **Tenant provisioning**: `CREATE DATABASE tenant_<slug>` → migrate → control_db | Drizzle + kayıt akışı | Yarım kalan provisioning → temizlik |
| 30 | Tenant çözümleme (subdomain/token), dinamik bağlantı, tenant başına pool | Her istek doğru DB'ye | Cross-tenant test |
| 31 | **Migration fan-out** + **expand-contract** | Tüm tenant DB'lerine migration runner | Bir tenant'ta migration patlar → ne yaparsın? |
| 32 | Render deploy, env, health check, cold start | order-service canlıda | Uyuyan servis → 30 sn cold start |
| 33 | BFF; timeout, retry, circuit breaker, graceful degradation; tekrar | web → order-service | order-service kapalı → site çökmesin |

## Modül 4 — NoSQL / MongoDB (Gün 34–38)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 34 | **SQL vs NoSQL**: document, key-value, wide-column, graph; Atlas | Aynı menü: Postgres'te 5 tablo vs Mongo'da 1 doküman | — |
| 35 | `menu-service` (NestJS + Mongoose); embedding vs referencing; schema validation | Modifier'lı menü (Burger → boyut → ekstra peynir) | Şemasız veri karmaşası |
| 36 | Index, `explain()`, **aggregation pipeline** (SQL GROUP BY / window karşılığı) | "En çok satan" hem SQL hem Mongo | Index'siz sorgu |
| 37 | Mongo transaction, replica set, write concern, read preference | Menü + stok güncellemesi | Replica'dan eski veri okuma |
| 38 | Modelleme alıştırması: Mongo ne zaman YANLIŞ seçim?; tekrar | — | — |

## Modül 5 — Cache, Background job, Cron (Gün 39–44)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 39 | Cache katmanları; `Cache-Control`, ETag | HTTP cache header'ları | Cache yüzünden eski sayfa |
| 40 | **Upstash Redis**, cache-aside, TTL, hit/miss | Menüyü cache'le, ms ölç | Cache miss vs hit logda |
| 41 | Cache invalidation, stampede | Fiyat değişince cache temizle | Eski fiyat bug'ı |
| 42 | **Rate limiting**; Redis veri tipleri; distributed lock | Login 5 deneme/dk; "bugün en çok satan" sorted set | 429; lock'suz çift işlem |
| 43 | Background job, queue (BullMQ) vs Kafka vs RabbitMQ, **worker** | E-posta fişini arka planda gönder | Uzun iş request içinde → timeout |
| 44 | **Cron**: gece Z raporu + Resend; tekrar | Gün sonu raporu e-postası | Cron iki kez çalışırsa? (lock) |

## Modül 6 — Event-driven, Real-time, Webhook (Gün 45–54)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 45 | Sync vs async; **Kafka**: broker, topic, partition, offset, consumer group; Aiven | Topic + console'dan mesaj | Yanlış SASL → bağlantı hatası |
| 46 | **Producer**; event şeması ve versiyonlama | order-service → `order.created` | Şema değişince eski consumer bozulur |
| 47 | **Consumer**: kitchen-worker; partition key = tenantId | Sipariş → mutfak fişi | Sıra karışıklığı (yanlış key) |
| 48 | At-least-once, offset commit, idempotent consumer | — | Aynı mesaj 2 kez → çift fiş |
| 49 | Retry, **DLQ**, poison message | Hatalı mesaj DLQ'ya | Worker'ı kilitleyen mesaj |
| 50 | **Outbox pattern** | Sipariş + event atomik | DB'ye yazıldı ama event gitmedi |
| 51 | **Saga** (sipariş → ödeme → stok), compensation; CQRS'e giriş | Sahte ödeme adımı | Ödeme başarısız → geri al |
| 52 | Real-time: polling vs SSE vs **WebSocket**; NestJS gateway | Mutfak ekranı canlı | Bağlantı kopması → reconnect |
| 53 | WebSocket ölçekleme: tenant başına room, Redis pub/sub adapter | 2 gateway instance | Mesaj yanlış instance'ta kalır |
| 54 | **Webhook** & Stripe test: imza, retry, idempotency; tekrar | Ödeme alındı → sipariş "paid" | Sahte webhook → imza reddi |

## Modül 7 — Docker, nginx, Elasticsearch, Kibana (Gün 55–60)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 55 | **Docker** (WSL2 kurulumu), image vs container; temel Linux komutları | İlk container | — |
| 56 | Dockerfile, multi-stage, layer, `.dockerignore` | order-service image'ı | Image'a `.env` sızması |
| 57 | **docker-compose** | Postgres, Mongo, Redis, Kafka + servisler tek komutla | Servis DB'den önce başlar → healthcheck |
| 58 | **nginx**: reverse proxy, load balancer | order-service × 2, round-robin | Replica öldür → **502** |
| 59 | **Elasticsearch**: inverted index, full-text, fuzzy, analyzer (az/tr/ru) | search-service; Kafka ile indeks | "burgr" ile arama |
| 60 | **Kibana / ELK**: log toplama, Discover, dashboard | Tüm servis logları | Hatayı servisler arası takip |

## Modül 8 — Kubernetes (Gün 61–63)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 61 | **Kubernetes** (kind): pod, deployment, service, `kubectl` | order-service K8s'te | **CrashLoopBackOff**, **OOMKilled** |
| 62 | ConfigMap, Secret, Ingress, liveness/readiness probe | — | Readiness yanlış → trafik ölü pod'a |
| 63 | HPA, rolling update, rollback; IaC (Terraform/Helm) kavramı | Yük altında scale | Bozuk versiyon → rollback |

## Modül 9 — QA & Test (Gün 64–68)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 64 | **QA terminolojisi**: test piramidi, smoke, sanity, regression, test case/plan, bug report, severity vs priority; preview'da manuel test | İlk bug report'u yaz | — |
| 65 | Unit test (Vitest / Jest, NestJS testing), TDD fikri | Para hesabı + guard testleri | Kasıtlı bug → test yakalar |
| 66 | Integration test (Neon branch, mongodb-memory-server), mock/stub/fake; flaky test | API + DB testleri | Flaky test üret, sebebini bul |
| 67 | **Playwright e2e** — **PR preview URL'ine karşı** | kayıt → menü → sipariş → ödeme | Trace viewer ile kırık test |
| 68 | **Load test (k6)**: RPS, p95/p99; contract testing kavramı | 100 sanal garson | Çöküş noktası |

## Modül 10 — CI/CD + Release kanalları (Gün 69–73)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 69 | **GitHub Actions CI**: lint, typecheck, test, build; required checks; ESLint/Prettier/husky | PR pipeline | Kırmızı pipeline → merge engeli |
| 70 | CD, environment'lar, secret yönetimi, semver, changelog | Otomatik deploy | Eksik secret → deploy hatası |
| 71 | **Release kanalları**: `alpha/beta/rc/prod` deployment'ları, promotion, release notes | 4 ortam canlıda | Yanlış kanala promote |
| 72 | **Feature flag** + restoranı kanallar arası taşıma (middleware + control_db + Redis) | Admin: "restoranı beta'ya al" | Flag cache'i eski kalır |
| 73 | Canary, blue-green; kanala göre migration; rollback tatbikatı | — | Prod restoranı alpha migration'ı görmüş DB'de |

## Modül 11 — Observability + Incident (Gün 74–77)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 74 | Logs / metrics / traces, **OpenTelemetry** → Grafana Cloud | Bir siparişin tüm servislerdeki trace'i | Yavaş span'i bul |
| 75 | **Sentry**: tenant + release tag'leri, source map | Frontend + backend hataları | Hangi kanal/restoran etkilendi? |
| 76 | Dashboard, alert, **SLI / SLO / SLA** | Hata oranı alarmı | Alarm gürültüsü (alert fatigue) |
| 77 | **Incident** tatbikatı + **postmortem** | "Mutfak ekranı sipariş almıyor!" | Gerçekçi arıza |

## Modül 12 — Security / Pentest (Gün 78–82)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 78 | **OWASP Top 10**, threat modeling, CSP/HSTS | `security-lab/` (sadece local) | — |
| 79 | SQL injection, **NoSQL injection**, XSS | Saldır → düzelt | ✅ saldırı |
| 80 | Brute force, **IDOR / cross-tenant leak**, CSRF, JWT tampering | Başka restoranın siparişini gör → düzelt | ✅ saldırı |
| 81 | SSRF, secret leak, Dependabot, CodeQL, secret scanning, **OWASP ZAP** | Kendi siteni tara | — |
| 82 | Saldırı nasıl görülür: WAF, 401 spike alarmı, audit log; GDPR/PII | Grafana'da saldırı alarmı | ✅ simüle saldırı |

## Modül 13 — System Design, Offline-first, FDE (Gün 83–87)

| Gün | Konu | Yapacağımız |
|---|---|---|
| 83 | Scaling (vertical/horizontal), stateless, replication, read replica, sharding, CAP, consistency | Kendi mimarimizi büyüt |
| 84 | REST vs **gRPC** vs **GraphQL**; API gateway, service mesh kavramı | Küçük gRPC örneği |
| 85 | Tasarım alıştırması: "10.000 restoranlı Clopos"; back-of-the-envelope hesap | Whiteboard |
| 86 | **Offline-first POS**: PWA, service worker, IndexedDB, senkronizasyon çakışması | İnternet kesilince sipariş al, gelince senkronla |
| 87 | **FDE** + ekip pratikleri: Agile, ticket, code review, ADR; OAuth/SSO'ya giriş; şirket reposunu Claude Code ile okumak | PR + code review simülasyonu |

## Modül 14 — Final (Gün 88–90)

| Gün | Konu |
|---|---|
| 88 | Tek bir tıklamanın **uçtan uca izi**: UI → Vercel → Redis → order-service → tenant DB → Kafka → worker → WebSocket → loglar → trace |
| 89 | `/tutorial` final "Büyük Harita" + mock mülakat (her rolden 5 soru) |
| 90 | Sonraki adımlar: hangi alanda derinleşeceksin? |

## Hangi uygulama hangi derste büyüyor? (bkz. [docs/PRODUCT.md](docs/PRODUCT.md))

| Uygulama / sekme | Günler |
|---|---|
| Admin Panel iskeleti, Zallar & Masalar | 1, 7, 12–13 |
| QR Menü (render türleri, cache) | 6, 39–41 |
| Terminal: masa aç, sipariş, "Mətbəxə göndər" | 7, 9, 19–20, 26 |
| İşçiler & Roller (RBAC) | 14–16 |
| Dashboard & Hesabatlar (ciro, en çok satan) | 18, 36, 42 |
| Menü (MongoDB, modifier) | 34–37 |
| Menü arama (Elasticsearch) | 59 |
| **Anbar** (mədaxil/məxaric, stok) | 19–20 (transaction), 50–51 (outbox/saga) |
| **Texnoloji kart** → satışta anbardan otomatik düşme | 47–51 (Kafka stock-worker) |
| **İnventarlaşdırma** (sayım, fark raporu) | 18, 37 |
| Z raporu (cron) | 44 |
| Mutfak ekranı (KDS) | 52–53 |
| Kiosk + ödeme | 54 |
| Restoran ayarları: timezone, release kanalı | 8, 71–72 |
| Terminal offline | 86 |

## Opsiyonel Modül 15 — Mobil (Gün 91–95)

| Gün | Konu |
|---|---|
| 91 | React Native vs web; Expo kurulumu; telefonda Expo Go ile çalıştırma |
| 92 | Garson modu: aynı order-service API'sini mobilden kullanmak; token'ı güvenli saklama |
| 93 | Manager modu: canlı ciro, push notification |
| 94 | Mobilde offline, kötü ağ koşulları |
| 95 | Build & dağıtım (EAS), app store süreci kavramı |

## Bonus modüller

| Konu | Neden |
|---|---|
| Object storage (S3 / Cloudflare R2), presigned URL | Menü resimleri |
| OAuth2 / OIDC / SSO uygulamalı | Kurumsal giriş |
| Design patterns, SOLID, clean/hexagonal architecture, DDD | Senior kod tasarımı |
| Terraform uygulamalı | Altyapıyı kodla yönetmek |
| RabbitMQ | Kafka'ya alternatif |
| LLM/AI entegrasyonu | FDE rolünün merkezinde |
| Linux, SSH, shell scripting derin | DevOps temeli |
