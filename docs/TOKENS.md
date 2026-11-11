# Token & Hesap Rehberi

**Kural:** Hepsini bugün alma; sadece o günün bölümünü yap. Aldığın her değeri `.env`'ye yaz
(önce: `Copy-Item .env.example .env`). `.env`'yi kimseyle paylaşma, ekran görüntüsü atma.

> **Neden token?** Servisler "sen kimsin?" diye sorar. Token = uygulamanın kimlik kartı. Sızarsa başkası senin adına
> DB'ni silebilir. Bu yüzden `.env` gitignore'da ve canlı ortamda panelden girilir.

| Gün | Servis | Ne için | Kart? |
|---|---|---|---|
| 1 | GitHub + `gh` CLI | repo, PR, CI | Hayır |
| 1 | Vercel | web + preview deploy | Hayır |
| 13 | Neon | PostgreSQL (control_db + tenant DB'leri) | Hayır |
| 16 | (kendin üret) | auth secret'ları, internal token | — |
| 34 | Render | NestJS servis hosting | Hayır |
| 36 | MongoDB Atlas | menü DB'si | Hayır |
| 42 | Upstash | Redis | Hayır |
| 45 | Resend | e-posta | Hayır |
| 47 | Aiven | Kafka | Hayır |
| 56 | Stripe | ödeme (test mode) | Hayır |
| 57 | Docker Desktop | local container | Hayır |
| 71 | Neon API key | PR başına DB branch (CI) | Hayır |
| 77 | Sentry | hata takibi | Hayır |
| 76 | Grafana Cloud | log/metric/trace | Hayır |

---

## Gün 1

### GitHub + `gh` CLI
1. Hesap: hazır ✅
2. Kurulum: `winget install --id GitHub.cli` → VS Code terminalini kapat/aç.
3. Giriş: `gh auth login` → GitHub.com → HTTPS → "Login with a web browser" → ekrandaki kodu tarayıcıya gir.
   Token'ı `gh` kendisi saklar; `.env`'ye yazmana gerek yok.

### Vercel
1. Hesap (GitHub'a bağlı): hazır ✅ — Plan: Hobby.
2. 1. günde: Vercel → **Add New → Project** → GitHub repo'nu seç → Root Directory: `apps/web` → Deploy.
3. (Gün 71, CI için) Account Settings → **Tokens** → `VERCEL_TOKEN` → **GitHub Secrets**'a (`.env`'ye değil).

## Gün 13–16

### Neon (PostgreSQL)
1. https://neon.tech → **Sign up with GitHub**.
2. Create project → `restolab`, region: **Frankfurt (eu-central-1)**.
3. Database adı: `control_db`.
4. Dashboard → **Connect**:
   - Connection pooling **açık** → `DATABASE_URL`
   - Connection pooling **kapalı** → `DATABASE_URL_UNPOOLED`
5. (Gün 31) Aynı ekranda database'i `postgres` seç, pooling **kapalı** → `TENANT_ADMIN_DATABASE_URL`.
   Aynı URL'in pooled hâlinde DB adının yerine `{db}` yaz → `TENANT_DATABASE_URL_TEMPLATE`.

### Kendi ürettiğin secret'lar
PowerShell'de her secret için bir kez çalıştır:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
→ `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`, (gün 24) `INTERNAL_SERVICE_TOKEN`.

## Gün 34

### Render
1. https://render.com → GitHub ile giriş. Token gerekmez.
2. 34. günde: New → Web Service → repo → Root: `services/order-service`. Env değişkenleri Render panelinden.
3. Free servis 15 dk boşta kalınca uyur (ilk istek ~30 sn) — bunu bilerek inceleyeceğiz.

## Gün 36–45

### MongoDB Atlas
1. https://www.mongodb.com/cloud/atlas/register → GitHub/Google ile kayıt.
2. **Create cluster → Free (M0)** → provider fark etmez, region: **Frankfurt**.
3. **Database Access** → Add user (username/password) — şifreyi not al.
4. **Network Access** → Add IP → `0.0.0.0/0` (öğrenme için; Render IP'leri sabit değil. Neden riskli olduğunu güvenlik modülünde konuşacağız).
5. Cluster → **Connect → Drivers → Node.js** → `mongodb+srv://...` → DB adı olarak `restolab_menu` ekle → `MONGODB_URI`.

### Upstash Redis
1. https://console.upstash.com → GitHub ile giriş → **Create Database** → `restolab-cache`, Regional, **eu-central-1**, Free.
2. **REST API** → `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
3. **Connect → ioredis** → `rediss://…:6379` → `REDIS_URL`

### Resend
1. https://resend.com/signup → **API Keys → Create** (Sending access) → `RESEND_API_KEY`
2. Domain'in yoksa `EMAIL_FROM=onboarding@resend.dev` kalsın (sadece kendi mail adresine gönderebilir — yeterli).

## Gün 47–56

### Aiven Kafka (Free)
> Upstash Kafka 2025'te kapatıldı.
1. https://console.aiven.io/signup → **Create service → Apache Kafka → Free plan**, Avrupa region.
2. "Running" olunca **Overview → Connection information** → SASL sekmesi (kapalıysa birlikte açacağız):
   Host:Port → `KAFKA_BROKERS`, User → `KAFKA_USERNAME`, Password → `KAFKA_PASSWORD`
3. **CA Certificate → Download** → proje kökünde `certs/kafka-ca.pem` (`certs/` gitignore'da).
4. Free limit: 5 topic; boşta kapanır → konsoldan "Power on".

### Stripe (test mode)
1. https://dashboard.stripe.com/register → kayıt. İşletme bilgisi istemeye başlarsa geç; **Test mode** açık kalsın.
2. Developers → **API keys** → `pk_test_…` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `sk_test_…` → `STRIPE_SECRET_KEY`
3. `STRIPE_WEBHOOK_SECRET`: 56. günde Stripe CLI (`stripe listen`) ile birlikte alacağız.

## Gün 57

### Docker Desktop (Windows 10 Home)
1. PowerShell'i **Yönetici olarak** aç → `wsl --install` → yeniden başlat.
2. https://www.docker.com/products/docker-desktop → kur → "Use WSL 2 based engine".
3. Kontrol: `docker run hello-world`. Elasticsearch için **en az 8 GB RAM** önerilir.
4. Kubernetes: `winget install Kubernetes.kind` ve `winget install Kubernetes.kubectl`.

## Gün 71

### Neon API key
1. Neon Console → Account settings → **API keys → Create** → `NEON_API_KEY` (GitHub Secrets'a da ekle).
2. Proje Settings → Project ID → `NEON_PROJECT_ID`.
   (Alternatif: Vercel Marketplace → Neon entegrasyonu her preview için otomatik DB branch açar — birlikte karşılaştıracağız.)

## Gün 76–80

### Sentry
1. https://sentry.io/signup → **Developer (free)** → Create Project → Next.js → DSN → `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`
2. Org slug → `SENTRY_ORG`, proje slug → `SENTRY_PROJECT`
3. Settings → **Auth Tokens** → `SENTRY_AUTH_TOKEN`

### Grafana Cloud
1. https://grafana.com/auth/sign-up → **Free** → EU stack.
2. Stack → **OpenTelemetry → Configure** → Endpoint → `OTEL_EXPORTER_OTLP_ENDPOINT`; "Generate token" → `Authorization=Basic …` → `OTEL_EXPORTER_OTLP_HEADERS`

`LAB_MODE=true` sadece kendi bilgisayarındaki `.env`'de, sadece lab günlerinde.
