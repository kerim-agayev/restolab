# 92 Günlük Yol Haritası — "Garson butona basınca ne olur?"

**Format:** 92 gün × 1 saat. **Her ders:** 10 dk kavram → 35 dk yap → 10 dk kır & log oku → 5 dk özet + quiz.
**Her ders = 1 branch + 1 PR + 1 preview deploy + 1 `/tutorial` sayfası** (Clopos akışı ilk günden itibaren).
Yorgun günlerde "kır & log oku" kısmını ertesi güne at — sorun değil. Her modülün sonunda bir tekrar günü var.

**Proje: RestoLab** — mini restoran yönetim sistemi (Clopos'a benzer): restoran kaydı, roller, menü, masa/sipariş,
mutfak ekranı, ödeme, Z raporu, menü arama.

| Modül | Günler | Konu | Rol |
|---|---|---|---|
| 1 | 1–12 | Web temeli + Git akışı + DevTools/curl + **Network** | `FE` `OPS` `QA` `SEC` |
| 2 | 13–23 | SQL Database (MSSQL'den ileriye) + Auth | `DB` `BE` |
| 3 | 24–35 | NestJS, API tasarımı, Multi-tenancy | `BE` `DB` `SD` |
| 4 | 36–40 | NoSQL — MongoDB | `DB` |
| 5 | 41–46 | Cache (Redis) + Background job + Cron | `BE` |
| 6 | 47–56 | Event-driven (Kafka), Real-time, Webhook | `BE` `SD` |
| 7 | 57–62 | Docker, nginx, Elasticsearch, Kibana | `OPS` |
| 8 | 63–65 | Kubernetes | `OPS` |
| 9 | 66–70 | QA & Test | `QA` |
| 10 | 71–75 | CI/CD + Release kanalları (alpha/beta/rc/prod) | `OPS` `QA` |
| 11 | 76–79 | Observability + Incident | `OPS` |
| 12 | 80–84 | Security / Pentest | `SEC` |
| 13 | 85–89 | System Design, Offline-first, FDE | `SD` |
| 14 | 90–92 | Final | hepsi |

---

## Modül 1 — Web temeli + şirket Git akışı (Gün 1–12)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 1 | Git, GitHub, monorepo, deploy; branch → PR → preview → merge | `gh`, repo, pnpm+Turborepo, Next.js, Vercel ilk deploy, ilk PR + preview URL | Bozuk build → Vercel build log'u |
| 2 | Git derin: branch, merge vs rebase, conflict, PR review, Conventional Commits | İki branch'te aynı satırı değiştir | **Merge conflict** çöz |
| 3 | HTTP: request/response, method, status, header, body | `/tutorial/3` HTTP Lab: status/delay/crash, raw request/response, requestId'li log; Vercel Logs | 400 (bozuk JSON), 405, TIMEOUT, 500 |
| 4 | **DevTools Network derin**: Headers (general/request/response), Payload, Preview vs Response, **Initiator** (isteği hangi kod attı), **Timing** (DNS/TLS/TTFB/download), **Cookies**; filtreler, Preserve log, Disable cache, throttling (Slow 4G), HAR export. **curl**: `-i`, `-v`, `-X`, `-H`, `-d`, `--max-time`; "Copy as cURL"; Bruno/Postman'a giriş | `/tutorial/4`: HTTP Lab isteklerini curl ile tekrar et; tarayıcıdaki bir isteği "Copy as cURL" ile terminalde çalıştır; QA gibi bug report'a curl ekle | Throttling ile timeout; yanlış `content-type` ile 400; `--max-time` ile client timeout |
| 5 | **Network 1 — Paket nasıl yolculuk eder?** Katmanlar (OSI 7 ↔ TCP/IP 4, pratik bakış), **encapsulation** (HTTP → TCP segment → IP paketi → Ethernet frame); IP (public/private, IPv4/IPv6), **subnet/CIDR**; MAC + **ARP**; router, gateway, **NAT**; **port**'lar (80, 443, 22, 53, 1433, 5432, 6379, 9092, 27017…); **TCP vs UDP**, **3-way handshake**, paket kaybı & retransmission | `/tutorial/5`: encapsulation animasyonu, subnet hesaplayıcı, ARP animasyonu, handshake simülatörü (paket kaybı butonu), port eşleştirme oyunu, **port tarama simülatörü** (open / closed / filtered — nmap mantığı). Gerçek: `ipconfig`, `curl ifconfig.me` (private vs public IP), `netstat -ano` | İki uygulamayı aynı porta aç → **EADDRINUSE**; kapalı port → *connection refused* vs firewall → *timeout* farkı (`Test-NetConnection`) |
| 6 | **Network 2 — İsim, yol, güvenlik.** **DNS** derin (recursive çözümleme: cache → resolver → root → TLD → authoritative; A/AAAA/CNAME/MX/TXT/NS, TTL); **DHCP** (DORA); **ICMP** (ping, traceroute, TTL/hop); **TLS handshake** (sertifika, şifreleme); HTTP vs HTTPS'i dinlemek (Wireshark mantığı); **firewall** kuralları; pentest bakışı: recon, subdomain, açık port riski, ARP spoofing/MITM kavramı; tüm araçlar cheat sheet | `/tutorial/6`: DNS çözümleme animasyonu, `Resolve-DnsName`/`nslookup` ile restolab ve clopos.menu kayıtları, `tracert` hop haritası, TLS handshake adım adım, "sniffer" simülatörü (HTTP'de şifre görünür, HTTPS'te görünmez), firewall kural oyunu, **"Enter'a bastın" uçtan uca final animasyonu** (DHCP→ARP→DNS→TCP→TLS→HTTP) | Yanlış DNS → çözülemeyen isim; `0.0.0.0/0`'a açık DB portu (firewall oyunu) |
| 7 | HTTPS uygulamalı (sertifika, HSTS), CDN/edge cache (`x-vercel-cache`, region), CORS | Vercel edge vs server, cache header'ları | CORS hatası |
| 8 | Next.js render: Server/Client Component, SSR/SSG/CSR, hydration | Menü sayfası 3 render türüyle | Hydration error; build-time vs runtime env |
| 9 | Form → Server Action / Route Handler, zod validation | "Masa aç" formu | 400 vs 422 |
| 10 | **Para neden float olmaz**, timezone (UTC), i18n'e giriş | Adisyon toplamı, restoran saati | 0.1 + 0.2 ≠ 0.3; gece yarısı tarih kayması |
| 11 | Tarayıcı state: cookie, localStorage; TanStack Query, optimistic UI; Core Web Vitals | Sipariş sepeti | localStorage'da fiyatı değiştir → neden server'a güvenmeli |
| 12 | Tekrar + quiz | `/tutorial` ana sayfası + Modül 1 haritası | — |

## Modül 2 — SQL Database + Auth (Gün 13–23)

> Database, SELECT ve window function'dan çok daha fazlası: modelleme, constraint, index, execution plan,
> transaction, isolation, locking, migration, pooling, backup, replication.

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 13 | PostgreSQL vs MSSQL, Neon (serverless, branching), connection string; **control plane** fikri | Prisma init, `control_db` | Yanlış şifre → hata mesajı |
| 14 | Modelleme: ERD, normalization, 1-N / N-N, constraint (PK, FK, UNIQUE, CHECK) | `User`, `Restaurant`, `Membership` | FK ihlali |
| 15 | Migration; PR başına Neon branch (preview DB) | `prisma migrate dev` | Migration drift |
| 16 | **Register**: password hashing (argon2/bcrypt) | Restoran sahibi kaydı | Aynı email → unique violation |
| 17 | **Login**: session vs JWT, access/refresh token, httpOnly cookie | Login + korumalı panel | Süresi dolmuş token → 401 |
| 18 | **RBAC**: owner / manager / waiter | Rol bazlı sayfa & aksiyon | Garson rapor sayfasına → 403 |
| 19 | Index (B-tree, composite), `EXPLAIN ANALYZE`, seed | 100.000 sipariş seed | Index'siz yavaş sorgu → index → ölç |
| 20 | İleri SQL (Postgres'te): CTE, window function, JSONB, view, materialized view | Günlük ciro raporu | MSSQL vs Postgres söz dizimi farkları |
| 21 | **Transaction & ACID**, isolation levels, race condition | Aynı masayı iki garson aynı anda açıyor | Stok -1 → transaction ile düzelt |
| 22 | Locking: `FOR UPDATE`, optimistic locking, **deadlock**; N+1; connection pooling | Masa-sipariş-kalem | Deadlock üret; N+1 → 101 sorgu |
| 23 | Backup / PITR, replication'a giriş; tekrar | Neon'da zamanda geri dön | "Yanlışlıkla DELETE" → restore |

## Modül 3 — NestJS, API, Multi-tenancy (Gün 24–35)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 24 | Monolit vs mikroservis; **NestJS**: module, controller, service | `order-service` iskeleti | — |
| 25 | Dependency Injection, provider, ConfigModule; pipe & validation | DTO doğrulama | Provider kaydı unutuldu → DI hatası |
| 26 | Guard, interceptor, exception filter; web ile JWT paylaşımı | Auth guard + süre ölçen interceptor | Token'sız istek → 401 |
| 27 | REST tasarımı, pagination (offset vs cursor), API versioning, Swagger | Sipariş API'si + `/docs` | Offset'in 5000. sayfada yavaşlaması |
| 28 | **Idempotency** | "Mutfağa gönder"e çift basma koruması | Çift sipariş → idempotency key |
| 29 | Structured logging (pino), requestId + tenantId, correlation | Servisler arası log takibi | Hatayı sadece requestId ile bul |
| 30 | **Multi-tenancy** desenleri: shared schema vs schema-per-tenant vs DB-per-tenant | ADR: "Neden DB-per-tenant?" | `tenant_id` filtresi unutulunca veri sızması |
| 31 | **Tenant provisioning**: `CREATE DATABASE tenant_<slug>` → migrate → control_db | Drizzle + kayıt akışı | Yarım kalan provisioning → temizlik |
| 32 | Tenant çözümleme (subdomain/token), dinamik bağlantı, tenant başına pool | Her istek doğru DB'ye | Cross-tenant test |
| 33 | **Migration fan-out** + **expand-contract** | Tüm tenant DB'lerine migration runner | Bir tenant'ta migration patlar → ne yaparsın? |
| 34 | Render deploy, env, health check, cold start | order-service canlıda | Uyuyan servis → 30 sn cold start |
| 35 | BFF; timeout, retry, circuit breaker, graceful degradation; tekrar | web → order-service | order-service kapalı → site çökmesin |

## Modül 4 — NoSQL / MongoDB (Gün 36–40)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 36 | **SQL vs NoSQL**: document, key-value, wide-column, graph; Atlas | Aynı menü: Postgres'te 5 tablo vs Mongo'da 1 doküman | — |
| 37 | `menu-service` (NestJS + Mongoose); embedding vs referencing; schema validation | Modifier'lı menü (Burger → boyut → ekstra peynir) | Şemasız veri karmaşası |
| 38 | Index, `explain()`, **aggregation pipeline** (SQL GROUP BY / window karşılığı) | "En çok satan" hem SQL hem Mongo | Index'siz sorgu |
| 39 | Mongo transaction, replica set, write concern, read preference | Menü + stok güncellemesi | Replica'dan eski veri okuma |
| 40 | Modelleme alıştırması: Mongo ne zaman YANLIŞ seçim?; tekrar | — | — |

## Modül 5 — Cache, Background job, Cron (Gün 41–46)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 41 | Cache katmanları; `Cache-Control`, ETag | HTTP cache header'ları | Cache yüzünden eski sayfa |
| 42 | **Upstash Redis**, cache-aside, TTL, hit/miss | Menüyü cache'le, ms ölç | Cache miss vs hit logda |
| 43 | Cache invalidation, stampede | Fiyat değişince cache temizle | Eski fiyat bug'ı |
| 44 | **Rate limiting**; Redis veri tipleri; distributed lock | Login 5 deneme/dk; "bugün en çok satan" sorted set | 429; lock'suz çift işlem |
| 45 | Background job, queue (BullMQ) vs Kafka vs RabbitMQ, **worker** | E-posta fişini arka planda gönder | Uzun iş request içinde → timeout |
| 46 | **Cron**: gece Z raporu + Resend; tekrar | Gün sonu raporu e-postası | Cron iki kez çalışırsa? (lock) |

## Modül 6 — Event-driven, Real-time, Webhook (Gün 47–56)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 47 | Sync vs async; **Kafka**: broker, topic, partition, offset, consumer group; Aiven | Topic + console'dan mesaj | Yanlış SASL → bağlantı hatası |
| 48 | **Producer**; event şeması ve versiyonlama | order-service → `order.created` | Şema değişince eski consumer bozulur |
| 49 | **Consumer**: kitchen-worker; partition key = tenantId | Sipariş → mutfak fişi | Sıra karışıklığı (yanlış key) |
| 50 | At-least-once, offset commit, idempotent consumer | — | Aynı mesaj 2 kez → çift fiş |
| 51 | Retry, **DLQ**, poison message | Hatalı mesaj DLQ'ya | Worker'ı kilitleyen mesaj |
| 52 | **Outbox pattern** | Sipariş + event atomik | DB'ye yazıldı ama event gitmedi |
| 53 | **Saga** (sipariş → ödeme → stok), compensation; CQRS'e giriş | Sahte ödeme adımı | Ödeme başarısız → geri al |
| 54 | Real-time: polling vs SSE vs **WebSocket**; NestJS gateway | Mutfak ekranı canlı | Bağlantı kopması → reconnect |
| 55 | WebSocket ölçekleme: tenant başına room, Redis pub/sub adapter | 2 gateway instance | Mesaj yanlış instance'ta kalır |
| 56 | **Webhook** & Stripe test: imza, retry, idempotency; tekrar | Ödeme alındı → sipariş "paid" | Sahte webhook → imza reddi |

## Modül 7 — Docker, nginx, Elasticsearch, Kibana (Gün 57–62)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 57 | **Docker** (WSL2 kurulumu), image vs container; temel Linux komutları | İlk container | — |
| 58 | Dockerfile, multi-stage, layer, `.dockerignore` | order-service image'ı | Image'a `.env` sızması |
| 59 | **docker-compose** | Postgres, Mongo, Redis, Kafka + servisler tek komutla | Servis DB'den önce başlar → healthcheck |
| 60 | **nginx**: reverse proxy, load balancer | order-service × 2, round-robin | Replica öldür → **502** |
| 61 | **Elasticsearch**: inverted index, full-text, fuzzy, analyzer (az/tr/ru) | search-service; Kafka ile indeks | "burgr" ile arama |
| 62 | **Kibana / ELK**: log toplama, Discover, dashboard | Tüm servis logları | Hatayı servisler arası takip |

## Modül 8 — Kubernetes (Gün 63–65)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 63 | **Kubernetes** (kind): pod, deployment, service, `kubectl` | order-service K8s'te | **CrashLoopBackOff**, **OOMKilled** |
| 64 | ConfigMap, Secret, Ingress, liveness/readiness probe | — | Readiness yanlış → trafik ölü pod'a |
| 65 | HPA, rolling update, rollback; IaC (Terraform/Helm) kavramı | Yük altında scale | Bozuk versiyon → rollback |

## Modül 9 — QA & Test (Gün 66–70)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 66 | **QA terminolojisi**: test piramidi, smoke, sanity, regression, test case/plan, bug report, severity vs priority; preview'da manuel test | İlk bug report'u yaz | — |
| 67 | Unit test (Vitest / Jest, NestJS testing), TDD fikri | Para hesabı + guard testleri | Kasıtlı bug → test yakalar |
| 68 | Integration test (Neon branch, mongodb-memory-server), mock/stub/fake; flaky test | API + DB testleri | Flaky test üret, sebebini bul |
| 69 | **Playwright e2e** — **PR preview URL'ine karşı** | kayıt → menü → sipariş → ödeme | Trace viewer ile kırık test |
| 70 | **Load test (k6)**: RPS, p95/p99; contract testing kavramı | 100 sanal garson | Çöküş noktası |

## Modül 10 — CI/CD + Release kanalları (Gün 71–75)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 71 | **GitHub Actions CI**: lint, typecheck, test, build; required checks; ESLint/Prettier/husky | PR pipeline | Kırmızı pipeline → merge engeli |
| 72 | CD, environment'lar, secret yönetimi, semver, changelog | Otomatik deploy | Eksik secret → deploy hatası |
| 73 | **Release kanalları**: `alpha/beta/rc/prod` deployment'ları, promotion, release notes | 4 ortam canlıda | Yanlış kanala promote |
| 74 | **Feature flag** + restoranı kanallar arası taşıma (middleware + control_db + Redis) | Admin: "restoranı beta'ya al" | Flag cache'i eski kalır |
| 75 | Canary, blue-green; kanala göre migration; rollback tatbikatı | — | Prod restoranı alpha migration'ı görmüş DB'de |

## Modül 11 — Observability + Incident (Gün 76–79)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 76 | Logs / metrics / traces, **OpenTelemetry** → Grafana Cloud | Bir siparişin tüm servislerdeki trace'i | Yavaş span'i bul |
| 77 | **Sentry**: tenant + release tag'leri, source map | Frontend + backend hataları | Hangi kanal/restoran etkilendi? |
| 78 | Dashboard, alert, **SLI / SLO / SLA** | Hata oranı alarmı | Alarm gürültüsü (alert fatigue) |
| 79 | **Incident** tatbikatı + **postmortem** | "Mutfak ekranı sipariş almıyor!" | Gerçekçi arıza |

## Modül 12 — Security / Pentest (Gün 80–84)

| Gün | Konu | Yapacağımız | Bilinçli kıracağımız |
|---|---|---|---|
| 80 | **OWASP Top 10**, threat modeling, CSP/HSTS | `security-lab/` (sadece local) | — |
| 81 | SQL injection, **NoSQL injection**, XSS | Saldır → düzelt | ✅ saldırı |
| 82 | Brute force, **IDOR / cross-tenant leak**, CSRF, JWT tampering | Başka restoranın siparişini gör → düzelt | ✅ saldırı |
| 83 | SSRF, secret leak, Dependabot, CodeQL, secret scanning, **OWASP ZAP** | Kendi siteni tara | — |
| 84 | Saldırı nasıl görülür: WAF, 401 spike alarmı, audit log; GDPR/PII | Grafana'da saldırı alarmı | ✅ simüle saldırı |

## Modül 13 — System Design, Offline-first, FDE (Gün 85–89)

| Gün | Konu | Yapacağımız |
|---|---|---|
| 85 | Scaling (vertical/horizontal), stateless, replication, read replica, sharding, CAP, consistency | Kendi mimarimizi büyüt |
| 86 | REST vs **gRPC** vs **GraphQL**; API gateway, service mesh kavramı | Küçük gRPC örneği |
| 87 | Tasarım alıştırması: "10.000 restoranlı Clopos"; back-of-the-envelope hesap | Whiteboard |
| 88 | **Offline-first POS**: PWA, service worker, IndexedDB, senkronizasyon çakışması | İnternet kesilince sipariş al, gelince senkronla |
| 89 | **FDE** + ekip pratikleri: Agile, ticket, code review, ADR; OAuth/SSO'ya giriş; şirket reposunu Claude Code ile okumak | PR + code review simülasyonu |

## Modül 14 — Final (Gün 90–92)

| Gün | Konu |
|---|---|
| 90 | Tek bir tıklamanın **uçtan uca izi**: UI → Vercel → Redis → order-service → tenant DB → Kafka → worker → WebSocket → loglar → trace |
| 91 | `/tutorial` final "Büyük Harita" + mock mülakat (her rolden 5 soru) |
| 92 | Sonraki adımlar: hangi alanda derinleşeceksin? |

## Hangi uygulama hangi derste büyüyor? (bkz. [docs/PRODUCT.md](docs/PRODUCT.md))

| Uygulama / sekme | Günler |
|---|---|
| Admin Panel iskeleti, Zallar & Masalar | 1, 9, 14–15 |
| `/tutorial` interaktif dersler + lab'lar | her gün |
| QR Menü (render türleri, cache) | 8, 41–43 |
| Terminal: masa aç, sipariş, "Mətbəxə göndər" | 9, 11, 21–22, 28 |
| İşçiler & Roller (RBAC) | 16–18 |
| Dashboard & Hesabatlar (ciro, en çok satan) | 20, 38, 44 |
| Menü (MongoDB, modifier) | 36–39 |
| Menü arama (Elasticsearch) | 61 |
| **Anbar** (mədaxil/məxaric, stok) | 21–22 (transaction), 52–53 (outbox/saga) |
| **Texnoloji kart** → satışta anbardan otomatik düşme | 49–53 (Kafka stock-worker) |
| **İnventarlaşdırma** (sayım, fark raporu) | 20, 39 |
| Z raporu (cron) | 46 |
| Mutfak ekranı (KDS) | 54–55 |
| Kiosk + ödeme | 56 |
| Restoran ayarları: timezone, release kanalı | 10, 73–74 |
| Terminal offline | 88 |

## Opsiyonel Modül 15 — Mobil (Gün 93–97)

| Gün | Konu |
|---|---|
| 93 | React Native vs web; Expo kurulumu; telefonda Expo Go ile çalıştırma |
| 94 | Garson modu: aynı order-service API'sini mobilden kullanmak; token'ı güvenli saklama |
| 95 | Manager modu: canlı ciro, push notification |
| 96 | Mobilde offline, kötü ağ koşulları |
| 97 | Build & dağıtım (EAS), app store süreci kavramı |

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
