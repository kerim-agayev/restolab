# RestoLab — Ürün Tanıtımı

RestoLab, Clopos'un küçük ve sahte bir kopyası: bir **restoran yönetim sistemi**. Tek bir uygulama değil, aynı backend'i
kullanan bir **uygulama ailesi**. Clopos'taki gibi: admin panel, terminal, QR menü, kiosk, mutfak ekranı, mobil uygulamalar.

> **En önemli ders:** Bu uygulamaların hepsi **aynı backend servislerine** konuşur. Garson terminalden sipariş girer →
> mutfak ekranına düşer → admin panelde satış raporunda görünür → anbardan malzeme düşer. Bir backend, birçok "client".
> Şirketinde "client", "terminal", "kiosk" ekipleri ayrı olsa da hepsi aynı API'leri kullanıyor.

## 1. Uygulamalar

| RestoLab | Clopos'taki karşılığı | Kim kullanır | Teknoloji | Ne zaman başlıyoruz |
|---|---|---|---|---|
| `apps/web` — **Admin Panel** | client (client.clopos.menu) | Restoran sahibi, müdür | Next.js | Gün 1 (şu an bu var) |
| `apps/terminal` — **Terminal (POS)** | Terminal | Kasiyer, garson (tablet) | Next.js PWA (offline) | Gün 9 |
| `apps/qr-menu` — **QR Menü** | QR menü | Müşteri (telefon) | Next.js (statik + cache) | Gün 8 |
| `apps/kds` — **Mutfak Ekranı** | Kitchen display | Aşçı | Next.js + WebSocket | Gün 54 |
| `apps/kiosk` — **Kiosk** | Kiosk (Subway gibi self-servis) | Müşteri | Next.js + Stripe | Gün 56 |
| `apps/mobile` — **Garson + Manager mobil** | Ofisiant app, Clopos Manager | Garson, sahip | Expo (React Native) | Opsiyonel Modül 16 |

Her uygulama ayrı deploy edilir (ayrı Vercel projesi, ayrı URL). Hepsi aynı monorepo'da yaşar ve ortak kodu
`packages/` altından paylaşır (tipler, API client, para/saat yardımcıları, UI parçaları).

## 2. Admin Panel (`apps/web`) — sekmeler

| Sekme | Ne yapar | Öğreteceği konu |
|---|---|---|
| **Dashboard** | Bugünkü ciro, sipariş sayısı, en çok satanlar | SQL aggregation, window function, Redis cache, Mongo aggregation |
| **Menü** | Kategori, ürün, modifier (boyut, ekstra peynir, sos) | MongoDB (iç içe doküman), cache invalidation, Elasticsearch arama |
| **Anbar (Depo / Stok)** | Malzemeler (xammal), mədaxil (giriş), məxaric (çıkış), stok seviyesi | **Transaction**, locking, race condition |
| **Texnoloji kart (Reçete)** | "1 burger = 150 g et + 1 ekmek + 20 g sos" | Satılınca anbardan otomatik düşme → event-driven (Kafka) |
| **İnventarlaşdırma (Sayım)** | Gerçek sayım vs sistemdeki stok → fark raporu | Uzun transaction, snapshot, isolation level |
| **Satışlar / Hesabatlar** | Gün/hafta/ay raporları, **Z raporu** | Cron, background job, materialized view |
| **Zallar & Masalar** | Salon planı, masa sayısı | Basit CRUD, migration |
| **İşçiler & Roller** | Owner / manager / waiter, yetkiler | **RBAC**, auth |
| **QR Menü ayarları** | Masa başına QR kodu | URL tasarımı, public vs private API |
| **Restoran ayarları** | Saat dilimi, para birimi, **release kanalı** (alpha/beta/rc/prod) | Timezone, feature flag, multi-tenancy |

## 3. Terminal (`apps/terminal`) — POS

- Masa planı → masa aç → ürün ekle (modifier seç) → **"Mətbəxə göndər"** (mutfağa gönder) → hesap → ödeme (nakit/kart, hesap bölme)
- Kasa növbəsi (shift) aç/kapat
- **İnternet kesilince çalışmaya devam et** (offline-first, Gün 88)
- Öğreteceği: idempotency (çift basma), transaction (aynı masayı iki garson açması), WebSocket, offline senkronizasyon

## 4. QR Menü (`apps/qr-menu`)
- Müşteri masadaki QR'ı okutur → `qr.restolab…/<restoran>/<masa>` → menüyü görür → (sonra) sipariş verir
- Herkese açık, çok trafik alır, hızlı olmalı → **SSG/ISR, CDN cache, Redis** konularının sahnesi
- Öğreteceği: render türleri, SEO, cache, rate limiting (bot trafiği)

## 5. Mutfak Ekranı (`apps/kds`)
- Sipariş gelince **anında** ekrana düşer, aşçı "hazırlanıyor → hazır" yapar → terminale bildirim gider
- Öğreteceği: Kafka consumer, WebSocket, reconnect, tenant başına room

## 6. Kiosk (`apps/kiosk`)
- Subway / McDonald's tipi self-servis ekran: müşteri seçer, öder, numara alır
- Öğreteceği: Stripe ödeme, webhook, saga (ödeme başarısızsa sipariş iptali), tam ekran/dokunmatik UI

## 7. Mobil (`apps/mobile`, opsiyonel)
- **Garson modu:** telefondan masa/sipariş (terminalin mobil hâli)
- **Manager modu:** sahip için canlı ciro, bildirimler (Clopos Manager gibi)
- Öğreteceği: React Native/Expo, push notification, mobil auth (token saklama), API'yi farklı client'tan kullanmak

## 8. Domain modeli (ana kavramlar)

```
Restaurant (tenant) ─┬─ Staff (role: owner | manager | waiter | cook)
                     ├─ Hall (zal) ── Table ── QR code
                     ├─ Category ── Product ── Modifier group ── Modifier
                     │                 └── Recipe (texnoloji kart) ──▶ Ingredient
                     ├─ Warehouse (anbar) ── StockMovement (mədaxil / məxaric / satış / fire)
                     │                    └── InventoryCount (inventarlaşdırma) ── count lines
                     ├─ Shift (növbə) ── Order ── OrderItem ── Payment
                     └─ Settings (timezone, currency, release_channel, feature flags)
```

Nerede saklanır:
- **control_db (Postgres):** Restaurant, Staff, Settings, tenant → DB eşlemesi
- **tenant_<slug> DB (Postgres, her restorana ayrı):** Hall, Table, Order, Payment, Warehouse, StockMovement, InventoryCount, Shift
- **MongoDB:** Category, Product, Modifier, Recipe (menü — iç içe ve restorandan restorana farklı)
- **Elasticsearch:** menü arama indeksi · **Redis:** cache, rate limit, session, kanal lookup

## 9. Uçtan uca örnek: "Garson burgeri mutfağa gönderdi"

```
Terminal ──POST /orders──▶ order-service ──(tenant DB'ye transaction: order + items + outbox)
                                │
                                └─ Kafka "order.created"
                                      ├─▶ kitchen-worker ──WebSocket──▶ Mutfak Ekranı (KDS)
                                      ├─▶ stock-worker: reçeteye göre anbardan 150 g et düş
                                      └─▶ report-worker: Dashboard cirosunu güncelle
Admin Panel ◀── Dashboard'da ciro artar · Anbar'da et stoğu azalır
```
