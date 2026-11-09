# 91 Günlük Yol Haritası — "Garson butona basınca ne olur?"

**Format:** 91 gün × 1 saat. **Her ders:** 10 dk kavram → 35 dk yap → 10 dk kır & log oku → 5 dk özet + quiz.
**Her ders = 1 branch + 1 PR + 1 preview deploy + 1 `/tutorial` sayfası** (Clopos akışı ilk günden itibaren).
Yorgun günlerde "kır & log oku" kısmını ertesi güne at — sorun değil. Her modülün sonunda bir tekrar günü var.

**Proje: RestoLab** — mini restoran yönetim sistemi (Clopos'a benzer): restoran kaydı, roller, menü, masa/sipariş,
mutfak ekranı, ödeme, Z raporu, menü arama.

| Modül | Günler | Konu | Rol |
|---|---|---|---|
| 1 | 1–11 | Web temeli + Git akışı + DevTools/curl | `FE` `OPS` `QA` |
| 2 | 12–22 | SQL Database (MSSQL'den ileriye) + Auth | `DB` `BE` |
| 3 | 23–34 | NestJS, API tasarımı, Multi-tenancy | `BE` `DB` `SD` |
| 4 | 35–39 | NoSQL — MongoDB | `DB` |
| 5 | 40–45 | Cache (Redis) + Background job + Cron | `BE` |
| 6 | 46–55 | Event-driven (Kafka), Real-time, Webhook | `BE` `SD` |
| 7 | 56–61 | Docker, nginx, Elasticsearch, Kibana | `OPS` |
| 8 | 62–64 | Kubernetes | `OPS` |
| 9 | 65–69 | QA & Test | `QA` |
| 10 | 70–74 | CI/CD + Release kanalları (alpha/beta/rc/prod) | `OPS` `QA` |
| 11 | 75–78 | Observability + Incident | `OPS` |
| 12 | 79–83 | Security / Pentest | `SEC` |
| 13 | 84–88 | System Design, Offline-first, FDE | `SD` |
| 14 | 89–91 | Final | hepsi |

---

## Modül 1 — Web temeli + şirket Git akışı (Gün 1–11)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 1 | Git, GitHub, monorepo, deploy; branch → PR → preview → merge | `gh`, repo, pnpm+Turborepo, Next.js, Vercel ilk deploy, ilk PR + preview URL | Bozuk build → Vercel build log'u |
| 2 | Git derin: branch, merge vs rebase, conflict, PR review, Conventional Commits | İki branch'te aynı satırı değiştir | **Merge conflict** çöz |
| 3 | HTTP: request/response, method, status, header, body | `/tutorial/3` HTTP Lab: status/delay/crash, raw request/response, requestId'li log; Vercel Logs | 400 (bozuk JSON), 405, TIMEOUT, 500 |
| 4 | **DevTools Network derin**: Headers (general/request/response), Payload, Preview vs Response, **Initiator** (isteği hangi kod attı), **Timing** (DNS/TLS/TTFB/download), **Cookies**; filtreler, Preserve log, Disable cache, throttling (Slow 4G), HAR export. **curl**: `-i`, `-v`, `-X`, `-H`, `-d`, `--max-time`; "Copy as cURL"; Bruno/Postman'a giriş | `/tutorial/4`: HTTP Lab isteklerini curl ile tekrar et; tarayıcıdaki bir isteği "Copy as cURL" ile terminalde çalıştır; QA gibi bug report'a curl ekle | Throttling ile timeout; yanlış `content-type` ile 400; `--max-time` ile client timeout |
| 5 | Ağ temeli: IP, port, localhost, TCP/UDP, DNS | `nslookup`, `curl -v`, `netstat` | Port zaten kullanımda (EADDRINUSE) |
| 6 | HTTPS/TLS, CDN, edge; CORS | Vercel edge vs server | CORS hatası |
| 7 | Next.js render: Server/Client Component, SSR/SSG/CSR, hydration | Menü sayfası 3 render türüyle | Hydration error; build-time vs runtime env |
| 8 | Form → Server Action / Route Handler, zod validation | "Masa aç" formu | 400 vs 422 |
| 9 | **Para neden float olmaz**, timezone (UTC), i18n'e giriş | Adisyon toplamı, restoran saati | 0.1 + 0.2 ≠ 0.3; gece yarısı tarih kayması |
| 10 | Tarayıcı state: cookie, localStorage; TanStack Query, optimistic UI; Core Web Vitals | Sipariş sepeti | localStorage'da fiyatı değiştir → neden server'a güvenmeli |
| 11 | Tekrar + quiz | `/tutorial` ana sayfası + Modül 1 haritası | — |

## Modül 2 — SQL Database + Auth (Gün 12–22)

> Database, SELECT ve window function'dan çok daha fazlası: modelleme, constraint, index, execution plan,
> transaction, isolation, locking, migration, pooling, backup, replication.

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 12 | PostgreSQL vs MSSQL, Neon (serverless, branching), connection string; **control plane** fikri | Prisma init, `control_db` | Yanlış şifre → hata mesajı |
| 13 | Modelleme: ERD, normalization, 1-N / N-N, constraint (PK, FK, UNIQUE, CHECK) | `User`, `Restaurant`, `Membership` | FK ihlali |
| 14 | Migration; PR başına Neon branch (preview DB) | `prisma migrate dev` | Migration drift |
| 15 | **Register**: password hashing (argon2/bcrypt) | Restoran sahibi kaydı | Aynı email → unique violation |
| 16 | **Login**: session vs JWT, access/refresh token, httpOnly cookie | Login + korumalı panel | Süresi dolmuş token → 401 |
| 17 | **RBAC**: owner / manager / waiter | Rol bazlı sayfa & aksiyon | Garson rapor sayfasına → 403 |
| 18 | Index (B-tree, composite), `EXPLAIN ANALYZE`, seed | 100.000 sipariş seed | Index'siz yavaş sorgu → index → ölç |
| 19 | İleri SQL (Postgres'te): CTE, window function, JSONB, view, materialized view | Günlük ciro raporu | MSSQL vs Postgres söz dizimi farkları |
| 20 | **Transaction & ACID**, isolation levels, race condition | Aynı masayı iki garson aynı anda açıyor | Stok -1 → transaction ile düzelt |
| 21 | Locking: `FOR UPDATE`, optimistic locking, **deadlock**; N+1; connection pooling | Masa-sipariş-kalem | Deadlock üret; N+1 → 101 sorgu |
| 22 | Backup / PITR, replication'a giriş; tekrar | Neon'da zamanda geri dön | "Yanlışlıkla DELETE" → restore |

## Modül 3 — NestJS, API, Multi-tenancy (Gün 23–34)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 23 | Monolit vs mikroservis; **NestJS**: module, controller, service | `order-service` iskeleti | — |
| 24 | Dependency Injection, provider, ConfigModule; pipe & validation | DTO doğrulama | Provider kaydı unutuldu → DI hatası |
| 25 | Guard, interceptor, exception filter; web ile JWT paylaşımı | Auth guard + süre ölçen interceptor | Token'sız istek → 401 |
| 26 | REST tasarımı, pagination (offset vs cursor), API versioning, Swagger | Sipariş API'si + `/docs` | Offset'in 5000. sayfada yavaşlaması |
| 27 | **Idempotency** | "Mutfağa gönder"e çift basma koruması | Çift sipariş → idempotency key |
| 28 | Structured logging (pino), requestId + tenantId, correlation | Servisler arası log takibi | Hatayı sadece requestId ile bul |
| 29 | **Multi-tenancy** desenleri: shared schema vs schema-per-tenant vs DB-per-tenant | ADR: "Neden DB-per-tenant?" | `tenant_id` filtresi unutulunca veri sızması |
| 30 | **Tenant provisioning**: `CREATE DATABASE tenant_<slug>` → migrate → control_db | Drizzle + kayıt akışı | Yarım kalan provisioning → temizlik |
| 31 | Tenant çözümleme (subdomain/token), dinamik bağlantı, tenant başına pool | Her istek doğru DB'ye | Cross-tenant test |
| 32 | **Migration fan-out** + **expand-contract** | Tüm tenant DB'lerine migration runner | Bir tenant'ta migration patlar → ne yaparsın? |
| 33 | Render deploy, env, health check, cold start | order-service canlıda | Uyuyan servis → 30 sn cold start |
| 34 | BFF; timeout, retry, circuit breaker, graceful degradation; tekrar | web → order-service | order-service kapalı → site çökmesin |

## Modül 4 — NoSQL / MongoDB (Gün 35–39)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 35 | **SQL vs NoSQL**: document, key-value, wide-column, graph; Atlas | Aynı menü: Postgres'te 5 tablo vs Mongo'da 1 doküman | — |
| 36 | `menu-service` (NestJS + Mongoose); embedding vs referencing; schema validation | Modifier'lı menü (Burger → boyut → ekstra peynir) | Şemasız veri karmaşası |
| 37 | Index, `explain()`, **aggregation pipeline** (SQL GROUP BY / window karşılığı) | "En çok satan" hem SQL hem Mongo | Index'siz sorgu |
| 38 | Mongo transaction, replica set, write concern, read preference | Menü + stok güncellemesi | Replica'dan eski veri okuma |
| 39 | Modelleme alıştırması: Mongo ne zaman YANLIŞ seçim?; tekrar | — | — |

## Modül 5 — Cache, Background job, Cron (Gün 40–45)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 40 | Cache katmanları; `Cache-Control`, ETag | HTTP cache header'ları | Cache yüzünden eski sayfa |
| 41 | **Upstash Redis**, cache-aside, TTL, hit/miss | Menüyü cache'le, ms ölç | Cache miss vs hit logda |
| 42 | Cache invalidation, stampede | Fiyat değişince cache temizle | Eski fiyat bug'ı |
| 43 | **Rate limiting**; Redis veri tipleri; distributed lock | Login 5 deneme/dk; "bugün en çok satan" sorted set | 429; lock'suz çift işlem |
| 44 | Background job, queue (BullMQ) vs Kafka vs RabbitMQ, **worker** | E-posta fişini arka planda gönder | Uzun iş request içinde → timeout |
| 45 | **Cron**: gece Z raporu + Resend; tekrar | Gün sonu raporu e-postası | Cron iki kez çalışırsa? (lock) |

## Modül 6 — Event-driven, Real-time, Webhook (Gün 46–55)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 46 | Sync vs async; **Kafka**: broker, topic, partition, offset, consumer group; Aiven | Topic + console'dan mesaj | Yanlış SASL → bağlantı hatası |
| 47 | **Producer**; event şeması ve versiyonlama | order-service → `order.created` | Şema değişince eski consumer bozulur |
| 48 | **Consumer**: kitchen-worker; partition key = tenantId | Sipariş → mutfak fişi | Sıra karışıklığı (yanlış key) |
| 49 | At-least-once, offset commit, idempotent consumer | — | Aynı mesaj 2 kez → çift fiş |
| 50 | Retry, **DLQ**, poison message | Hatalı mesaj DLQ'ya | Worker'ı kilitleyen mesaj |
| 51 | **Outbox pattern** | Sipariş + event atomik | DB'ye yazıldı ama event gitmedi |
| 52 | **Saga** (sipariş → ödeme → stok), compensation; CQRS'e giriş | Sahte ödeme adımı | Ödeme başarısız → geri al |
| 53 | Real-time: polling vs SSE vs **WebSocket**; NestJS gateway | Mutfak ekranı canlı | Bağlantı kopması → reconnect |
| 54 | WebSocket ölçekleme: tenant başına room, Redis pub/sub adapter | 2 gateway instance | Mesaj yanlış instance'ta kalır |
| 55 | **Webhook** & Stripe test: imza, retry, idempotency; tekrar | Ödeme alındı → sipariş "paid" | Sahte webhook → imza reddi |

## Modül 7 — Docker, nginx, Elasticsearch, Kibana (Gün 56–61)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 56 | **Docker** (WSL2 kurulumu), image vs container; temel Linux komutları | İlk container | — |
| 57 | Dockerfile, multi-stage, layer, `.dockerignore` | order-service image'ı | Image'a `.env` sızması |
| 58 | **docker-compose** | Postgres, Mongo, Redis, Kafka + servisler tek komutla | Servis DB'den önce başlar → healthcheck |
| 59 | **nginx**: reverse proxy, load balancer | order-service × 2, round-robin | Replica öldür → **502** |
| 60 | **Elasticsearch**: inverted index, full-text, fuzzy, analyzer (az/tr/ru) | search-service; Kafka ile indeks | "burgr" ile arama |
| 61 | **Kibana / ELK**: log toplama, Discover, dashboard | Tüm servis logları | Hatayı servisler arası takip |

## Modül 8 — Kubernetes (Gün 62–64)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 62 | **Kubernetes** (kind): pod, deployment, service, `kubectl` | order-service K8s'te | **CrashLoopBackOff**, **OOMKilled** |
| 63 | ConfigMap, Secret, Ingress, liveness/readiness probe | — | Readiness yanlış → trafik ölü pod'a |
| 64 | HPA, rolling update, rollback; IaC (Terraform/Helm) kavramı | Yük altında scale | Bozuk versiyon → rollback |

## Modül 9 — QA & Test (Gün 65–69)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 65 | **QA terminolojisi**: test piramidi, smoke, sanity, regression, test case/plan, bug report, severity vs priority; preview'da manuel test | İlk bug report'u yaz | — |
| 66 | Unit test (Vitest / Jest, NestJS testing), TDD fikri | Para hesabı + guard testleri | Kasıtlı bug → test yakalar |
| 67 | Integration test (Neon branch, mongodb-memory-server), mock/stub/fake; flaky test | API + DB testleri | Flaky test üret, sebebini bul |
| 68 | **Playwright e2e** — **PR preview URL'ine karşı** | kayıt → menü → sipariş → ödeme | Trace viewer ile kırık test |
| 69 | **Load test (k6)**: RPS, p95/p99; contract testing kavramı | 100 sanal garson | Çöküş noktası |

## Modül 10 — CI/CD + Release kanalları (Gün 70–74)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 70 | **GitHub Actions CI**: lint, typecheck, test, build; required checks; ESLint/Prettier/husky | PR pipeline | Kırmızı pipeline → merge engeli |
| 71 | CD, environment'lar, secret yönetimi, semver, changelog | Otomatik deploy | Eksik secret → deploy hatası |
| 72 | **Release kanalları**: `alpha/beta/rc/prod` deployment'ları, promotion, release notes | 4 ortam canlıda | Yanlış kanala promote |
| 73 | **Feature flag** + restoranı kanallar arası taşıma (middleware + control_db + Redis) | Admin: "restoranı beta'ya al" | Flag cache'i eski kalır |
| 74 | Canary, blue-green; kanala göre migration; rollback tatbikatı | — | Prod restoranı alpha migration'ı görmüş DB'de |

## Modül 11 — Observability + Incident (Gün 75–78)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 75 | Logs / metrics / traces, **OpenTelemetry** → Grafana Cloud | Bir siparişin tüm servislerdeki trace'i | Yavaş span'i bul |
| 76 | **Sentry**: tenant + release tag'leri, source map | Frontend + backend hataları | Hangi kanal/restoran etkilendi? |
| 77 | Dashboard, alert, **SLI / SLO / SLA** | Hata oranı alarmı | Alarm gürültüsü (alert fatigue) |
| 78 | **Incident** tatbikatı + **postmortem** | "Mutfak ekranı sipariş almıyor!" | Gerçekçi arıza |

## Modül 12 — Security / Pentest (Gün 79–83)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 79 | **OWASP Top 10**, threat modeling, CSP/HSTS | `security-lab/` (sadece local) | — |
| 80 | SQL injection, **NoSQL injection**, XSS | Saldır → düzelt | ✅ saldırı |
| 81 | Brute force, **IDOR / cross-tenant leak**, CSRF, JWT tampering | Başka restoranın siparişini gör → düzelt | ✅ saldırı |
| 82 | SSRF, secret leak, Dependabot, CodeQL, secret scanning, **OWASP ZAP** | Kendi siteni tara | — |
| 83 | Saldırı nasıl görülür: WAF, 401 spike alarmı, audit log; GDPR/PII | Grafana'da saldırı alarmı | ✅ simüle saldırı |

## Modül 13 — System Design, Offline-first, FDE (Gün 84–88)

| Gün | Konu | Yapacağımız |
|---|---|---|
| 84 | Scaling (vertical/horizontal), stateless, replication, read replica, sharding, CAP, consistency | Kendi mimarimizi büyüt |
| 85 | REST vs **gRPC** vs **GraphQL**; API gateway, service mesh kavramı | Küçük gRPC örneği |
| 86 | Tasarım alıştırması: "10.000 restoranlı Clopos"; back-of-the-envelope hesap | Whiteboard |
| 87 | **Offline-first POS**: PWA, service worker, IndexedDB, senkronizasyon çakışması | İnternet kesilince sipariş al, gelince senkronla |
| 88 | **FDE** + ekip pratikleri: Agile, ticket, code review, ADR; OAuth/SSO'ya giriş; şirket reposunu Claude Code ile okumak | PR + code review simülasyonu |

## Modül 14 — Final (Gün 89–91)

| Gün | Konu |
|---|---|
| 89 | Tek bir tıklamanın **uçtan uca izi**: UI → Vercel → Redis → order-service → tenant DB → Kafka → worker → WebSocket → loglar → trace |
| 90 | `/tutorial` final "Büyük Harita" + mock mülakat (her rolden 5 soru) |
| 91 | Sonraki adımlar: hangi alanda derinleşeceksin? |

## Hangi uygulama hangi derste büyüyor? (bkz. [docs/PRODUCT.md](docs/PRODUCT.md))

| Uygulama / sekme | Günler |
|---|---|
| Admin Panel iskeleti, Zallar & Masalar | 1, 8, 13–14 |
| `/tutorial` interaktif dersler + HTTP Lab | 1–4 (her gün) |
| QR Menü (render türleri, cache) | 7, 40–42 |
| Terminal: masa aç, sipariş, "Mətbəxə göndər" | 8, 10, 20–21, 27 |
| İşçiler & Roller (RBAC) | 15–17 |
| Dashboard & Hesabatlar (ciro, en çok satan) | 19, 37, 43 |
| Menü (MongoDB, modifier) | 35–38 |
| Menü arama (Elasticsearch) | 60 |
| **Anbar** (mədaxil/məxaric, stok) | 20–21 (transaction), 51–52 (outbox/saga) |
| **Texnoloji kart** → satışta anbardan otomatik düşme | 48–52 (Kafka stock-worker) |
| **İnventarlaşdırma** (sayım, fark raporu) | 19, 38 |
| Z raporu (cron) | 45 |
| Mutfak ekranı (KDS) | 53–54 |
| Kiosk + ödeme | 55 |
| Restoran ayarları: timezone, release kanalı | 9, 72–73 |
| Terminal offline | 87 |

## Opsiyonel Modül 15 — Mobil (Gün 92–96)

| Gün | Konu |
|---|---|
| 92 | React Native vs web; Expo kurulumu; telefonda Expo Go ile çalıştırma |
| 93 | Garson modu: aynı order-service API'sini mobilden kullanmak; token'ı güvenli saklama |
| 94 | Manager modu: canlı ciro, push notification |
| 95 | Mobilde offline, kötü ağ koşulları |
| 96 | Build & dağıtım (EAS), app store süreci kavramı |

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
