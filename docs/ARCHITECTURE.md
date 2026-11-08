# Büyük Şirketler Nasıl Kuruyor? (ve RestoLab bunu nasıl ücretsiz taklit ediyor)

## 1. Garson "Mutfağa gönder"e bastığında büyük bir POS sisteminde ne olur?

1. **Tablet (Frontend)** — React/Next.js `onClick` → `POST /orders` isteği. İnternet yoksa sipariş IndexedDB'ye yazılır, gelince gönderilir (offline-first).
2. **DNS** — `client.clopos.menu` → IP (genelde bir **CDN**'in IP'si: Cloudflare, CloudFront…).
3. **CDN / WAF** — Statik dosyalar buradan gelir; **WAF** saldırı gibi görünen isteği keser. *Security ekibinin saldırıyı ilk gördüğü yer.*
4. **Release kanalı yönlendirmesi** — Bu restoran hangi kanalda? (alpha/beta/rc/prod) → istek o kanalın deployment'ına gider.
5. **Load balancer → nginx / Ingress / API Gateway** — token kontrolü, rate limit, isteği doğru **mikroservise** yönlendirme.
6. **Kubernetes** — Servisler **pod**'larda çalışır; yük artınca pod sayısı artar (HPA).
7. **Order service (NestJS)** —
   - token'dan **tenant**'ı (restoran) bulur → control plane'den o restoranın DB'sini öğrenir (Redis'te cache'li),
   - **restoranın kendi DB'sine** siparişi **transaction** içinde yazar (sipariş + kalemler + outbox kaydı),
   - menü/fiyat bilgisini **menu-service**'ten (MongoDB) alır,
   - **Kafka**'ya `order.created` event'i gider.
8. **Kafka'yı dinleyen worker'lar** (asenkron, garson beklemez):
   - kitchen-worker → mutfak fişi → **WebSocket** ile mutfak ekranına anında düşer,
   - stok servisi → malzeme düşer,
   - raporlama → gün sonu (Z) raporu verisi,
   - search indexer → **Elasticsearch**.
9. **Response** aynı yoldan geri döner → tablet "Gönderildi ✓" gösterir.
10. **Her adımda** loglar → **ELK** (Elasticsearch + Logstash + Kibana) / Loki; metrikler → **Prometheus/Grafana**;
    trace'ler → **Jaeger/Tempo**; hatalar → **Sentry** (restoran + release tag'li). Eşik aşılınca **alert** → nöbetçi mühendis.
    *Backend/QA'nın "problem olduğu anda gördüğü" ekranlar bunlar.*

## 2. Clopos'tan bilinen 3 pratik — sektördeki adları

### 2.1 PR başına preview ortamı (`pr-5545.client.clopos.menu`)
Adı: **preview / ephemeral environment**. Her PR'ın kodu ayrı bir URL'de çalışır; QA orada test eder, onay verince `main`'e merge edilir.
Faydası: test edilmemiş kod `main`'e girmez; her özellik izole test edilir.
RestoLab'da: Vercel her PR'a otomatik preview URL verir; Neon her PR'a ayrı DB branch'i açar; 7. haftada Playwright bu URL'de otomatik koşar.

### 2.2 Release kanalları (alpha → beta → rc → prod)
Adı: **release channels / release rings / staged rollout**. Yeni kod önce küçük, riskin kabul edilebildiği bir gruba (alpha = kendi ekibimiz),
sonra daha geniş gruplara açılır. Bir hata varsa sadece küçük grubu etkiler (**blast radius**'u küçültmek).
Yaygın iki uygulama şekli (çoğu şirket ikisini birlikte kullanır):
- **Deployment-per-channel:** her kanalın kendi deploy edilmiş versiyonu var; restoranın kanalına göre istek oraya yönlenir.
- **Feature flag:** kod herkeste aynı, ama özellik bir bayrakla sadece belirli kanal/restoranlarda açılır.
Zorluk: tüm kanallar DB'yi paylaşıyorsa (veya DB şeması kanala göre değişiyorsa) **migration'lar geriye uyumlu** olmalı (expand-contract).

### 2.3 Her restorana ayrı veritabanı
Adı: **multi-tenancy — database-per-tenant**. Üç ana desen:

| Desen | Nasıl | Artı | Eksi |
|---|---|---|---|
| Shared schema | Tek DB, her tabloda `tenant_id` | Ucuz, basit | Bir `WHERE` unutulursa veri sızar; "gürültülü komşu" |
| Schema-per-tenant | Tek DB, her restorana ayrı schema | Orta izolasyon | Çok schema yönetimi |
| **DB-per-tenant** | Her restorana ayrı DB | En güçlü izolasyon, restoran bazlı backup/restore, taşıma kolay | Binlerce DB'ye migration, bağlantı yönetimi, maliyet |

Gerekenler: restoran→DB eşlemesini tutan **control plane** DB, kayıt sırasında **provisioning** (`CREATE DATABASE` + migrate),
tüm DB'lere **migration fan-out**, tenant'a göre **dinamik bağlantı**.

## 3. Tipik büyük şirket yığını

| Katman | Endüstri standardı | RestoLab karşılığı |
|---|---|---|
| Frontend | React / Next.js, micro-frontends, PWA | Next.js on Vercel |
| API girişi | API Gateway (Kong, AWS), nginx, Envoy | Next.js BFF + local nginx |
| Servisler | **NestJS**, Spring (Java/Kotlin), Go, .NET | NestJS servisleri |
| İlişkisel DB | PostgreSQL, MySQL, MSSQL | Neon PostgreSQL (control + tenant DB'leri) |
| NoSQL | **MongoDB**, Couchbase, Cassandra, DynamoDB | MongoDB Atlas |
| Cache | Redis, Memcached | Upstash Redis |
| Mesajlaşma | Kafka, RabbitMQ, SQS | Aiven Kafka / local Kafka |
| Real-time | WebSocket, Socket.IO, SSE | NestJS WebSocket gateway |
| Arama | Elasticsearch, OpenSearch | Elasticsearch (Docker) |
| Log | ELK, Loki, Datadog | Kibana (local) + Grafana Cloud |
| Metric/Trace | Prometheus, Grafana, Jaeger, OpenTelemetry | Grafana Cloud + OTel |
| Hata takibi | Sentry | Sentry |
| Container / Orkestrasyon | Docker / Kubernetes | Docker Desktop / kind |
| CI/CD | GitHub Actions, GitLab CI, Jenkins, ArgoCD | GitHub Actions + Vercel/Render |
| Release | release channels, feature flags (LaunchDarkly, Unleash) | git branch'leri + control_db flag'leri |
| Güvenlik | WAF, SAST/DAST, Vault, SIEM | OWASP ZAP, CodeQL, Dependabot |
| QA | Playwright/Cypress, Jest, k6/JMeter, Postman | Vitest/Jest, Playwright, k6, Bruno |

## 4. SQL vs NoSQL — RestoLab'da neden ikisi birden?

| | PostgreSQL (siparişler) | MongoDB (menü) |
|---|---|---|
| Veri şekli | Tablolar, satırlar, sabit şema | JSON benzeri doküman, esnek şema |
| İlişkiler | JOIN, foreign key | Gömülü (embedding) veya referans |
| Transaction | Güçlü ACID, doğal | Var (4.0+), ama tasarım tek-doküman atomikliğine dayanır |
| Ölçekleme | Genelde dikey + read replica | Yatay (sharding) için tasarlandı |
| RestoLab'da neden | Para, sipariş, stok → tutarlılık şart | "Burger → boyut → ekstra peynir → sos" iç içe ve restorandan restorana farklı |

## 5. RestoLab'ın evrimi

| Hafta | Mimari |
|---|---|
| 1 | Tarayıcı → Next.js (Vercel) + PR preview akışı |
| 2 | + Neon control_db (Prisma), auth, RBAC |
| 3 | + NestJS order-service + database-per-tenant |
| 4 | + MongoDB menu-service + Redis + cron |
| 5 | + Kafka, worker'lar, WebSocket mutfak ekranı, Stripe webhook |
| 6 | + Docker, nginx, Elasticsearch/Kibana, Kubernetes |
| 7 | + testler, CI/CD, alpha/beta/rc/prod kanalları, feature flag'ler |
| 8 | + observability, güvenlik sertleştirme, system design, offline-first |
