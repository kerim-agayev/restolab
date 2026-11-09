# Terimler Sözlüğü

Her terim: **ne** + **benzetme** + **şirkette nasıl duyarsın**. Dersler ilerledikçe Claude yenilerini ekler.
Konunun hangi gün işlendiğini ROADMAP.md'de bulursun.

## Git (Gün 1–2)
- **Working directory / Staging / Commit / Push** — Değiştirdin / `git add` ile fotoğrafa dahil ettin / `git commit` ile fotoğrafı çektin (sadece senin bilgisayarında) / `git push` ile GitHub'a gönderdin.
- **Pull / Fetch** — GitHub'daki en son kodu alıp kendi branch'ine birleştirmek / sadece indirmek, birleştirmemek.
- **HEAD** — "Şu an üzerinde durduğun yer" (aktif branch'in son commit'i).
- **Merge conflict** — İki kişi aynı satırı farklı değiştirdi; Git karar veremez, sen seçersin. *"Conflict çıktı, çözüyorum."*
- **Current / Incoming change** — Çakışmada senin branch'indeki satır / içeri çektiğin (main'deki) satır.
- **Merge vs Rebase** — main'i branch'ine katıp merge commit oluşturmak (güvenli) / commit'lerini main'in ucuna yeniden yazmak (düz geçmiş, `--force` push gerekir).
- **Code review / Approve / Request changes** — Kodun merge'den önce incelenmesi / "onaylıyorum" / "şunları düzeltmeden merge etme".
- **Conventional Commits** — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` ile başlayan commit mesajları.
- **Lint (ESLint)** — Kodu çalıştırmadan okuyup hata/kötü pratik bulan araç. Otomatik code reviewer.

## Web / Frontend
- **Request (method + URL + headers + body)** — Garsonun mutfağa verdiği fiş: ne istiyorsun + kime + üst bilgi + içerik.
- **Method (GET / POST / PUT / PATCH / DELETE)** — Oku / oluştur / tamamen değiştir / kısmen değiştir / sil.
- **Header** — İsteğin/cevabın üst bilgisi (`content-type`, `authorization`, `x-request-id`…).
- **Body / Payload** — İsteğin/cevabın içeriği (genelde JSON).
- **405 Method Not Allowed** — Bu adres bu method'u desteklemiyor.
- **Client timeout** — Tarayıcı belli bir süre bekleyip vazgeçti; sunucu belki hâlâ çalışıyor.
- **DevTools → Network** — Tarayıcının attığı tüm istekleri, header/body/timing ile gösteren ekran (F12).
- **HTTP request/response** — Tarayıcının sunucuya yazdığı mektup ve gelen cevap. *"Response 500 dönüyor."*
- **Status code** — Cevabın özeti: 2xx başarılı, 3xx yönlendirme, 4xx senin hatan (400 bozuk veri, 401 kimsin?, 403 yetkin yok, 404 yok, 429 çok istek), 5xx sunucunun hatası (500, 502 bad gateway, 503, 504 timeout).
- **DNS** — İnternetin telefon rehberi: domain → IP.
- **CDN** — Dosyaların dünyanın her yerine dağıtılmış kopyaları; sana en yakın depodan gelir.
- **CORS** — Tarayıcının "başka siteden bu API'yi çağırmana izin var mı?" kontrolü.
- **SSR / CSR / SSG** — Sayfa HTML'i sunucuda mı, tarayıcıda mı, build sırasında mı üretiliyor.
- **Hydration** — Sunucudan gelen "ölü" HTML'e React'in can vermesi (event'leri bağlaması).
- **BFF (Backend for Frontend)** — Frontend'e özel küçük backend katmanı; diğer servisleri toplayıp tek cevap verir.

## Backend / API
- **REST** — URL + HTTP method ile kaynak yönetme kuralları (`GET /products`, `POST /orders`).
- **Idempotency** — Aynı isteği 10 kez göndersen de sonuç 1 kez olur. Ödeme butonuna çift tıklamaya karşı.
- **Pagination** — Veriyi sayfa sayfa vermek. Offset (sayfa 3) vs cursor ("şu kayıttan sonrası").
- **Structured logging** — Logları düz metin değil JSON yazmak; aranabilir, filtrelenebilir.
- **Request-id / Correlation-id** — Bir isteğin tüm servislerde taşıdığı takip numarası. Kargo takip no gibi.
- **Monolit** — Tüm uygulama tek parça, tek deploy.
- **Mikroservis** — Uygulama küçük, bağımsız servislere bölünmüş; her biri kendi DB'si ve deploy'u ile.
- **API Gateway** — Tüm isteklerin girdiği tek kapı; kimlik, rate limit, yönlendirme.
- **Timeout / Retry / Circuit breaker** — Bekleme sınırı / tekrar dene / sürekli hata veren servisi bir süre hiç çağırma (sigorta gibi atar).
- **Health check** — `/health` endpoint'i; "yaşıyor musun?" sorusu.
- **Cold start** — Uyuyan sunucunun ilk istekte uyanma gecikmesi.

## Database
- **Schema / Migration** — Tabloların yapısı / bu yapının versiyonlu değişiklik dosyaları (DB için git commit'i).
- **ORM (Prisma, Drizzle)** — SQL'i TypeScript koduyla yazdıran katman.
- **Constraint** — DB seviyesinde kural: PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK, NOT NULL.
- **Index** — Kitabın arkasındaki dizin. Okumayı hızlandırır, yazmayı biraz yavaşlatır.
- **Execution plan / EXPLAIN** — DB'nin sorguyu nasıl çalıştıracağının planı (MSSQL'deki "Show Execution Plan").
- **Transaction** — Ya hepsi ya hiçbiri: "paradan düş + stoktan düş" birlikte olur ya da hiç olmaz.
- **ACID** — Atomicity (bölünmez), Consistency (kurallar korunur), Isolation (eşzamanlı işlemler birbirini bozmaz), Durability (kaydedilen kalıcıdır).
- **Isolation level** — Read Committed, Repeatable Read, Serializable: eşzamanlı işlemlerin birbirini ne kadar "görebileceği".
- **Race condition** — İki işlemin aynı anda aynı veriye dokunup yanlış sonuç üretmesi (son ürünü 2 kişi alır).
- **Lock / Deadlock** — Kilit / iki işlemin birbirinin kilidini beklemesi, kimse ilerleyemez.
- **Optimistic vs pessimistic locking** — "Çakışma olursa fark ederim" (version kolonu) vs "önce kilitlerim" (`FOR UPDATE`).
- **Normalization** — Veriyi tekrarsız tablolara bölmek.
- **N+1 problemi** — 1 sorgu ile liste çekip her satır için 1 sorgu daha atmak (101 sorgu).
- **Connection pooling** — DB bağlantılarını havuzda tutup tekrar kullanmak; her istekte yeni bağlantı açmak pahalı.
- **Replication / Read replica** — DB'nin kopyaları; okumalar kopyalardan yapılır.
- **Sharding** — Veriyi birden fazla DB'ye bölmek (ör. kullanıcı id'ye göre).
- **SQL vs NoSQL** — Tablo+ilişki+katı şema vs doküman/key-value/geniş kolon; esnek ve yatay ölçeklenebilir.

## Cache & Redis
- **Cache** — Pahalı sonucun hızlı bir yerde saklanmış kopyası. Buzdolabı: her seferinde markete gitmezsin.
- **Redis** — RAM'de çalışan süper hızlı key-value veri deposu. Cache, sayaç, kuyruk, session, sıralama için.
- **TTL** — Cache'deki verinin son kullanma süresi.
- **Cache hit / miss** — Cache'de bulundu / bulunamadı (DB'ye gidildi).
- **Cache-aside** — Önce cache'e bak, yoksa DB'den al ve cache'e koy.
- **Cache invalidation** — Veri değişince eski cache'i silmek. Yazılımın en zor iki işinden biri.
- **Cache stampede** — Cache aynı anda bitince binlerce isteğin DB'ye hücum etmesi.
- **Rate limiting** — "Dakikada en fazla 5 deneme." Brute force ve kötüye kullanıma karşı.

## Mesajlaşma / Kafka / Worker
- **Sync vs async** — Cevabı bekleyerek (telefon) vs beklemeden (mesaj bırakmak).
- **Queue (kuyruk)** — İşlerin sıraya konduğu yer; worker'lar sırayla alır.
- **Worker** — Kullanıcıya cevap vermeyen, arka planda iş yapan program (mail at, resim küçült, rapor üret).
- **Kafka** — Event'lerin (olayların) yazıldığı, kalıcı, çok hızlı dağıtık "günlük defteri". Birden fazla servis aynı olayı okuyabilir.
- **Broker / Topic / Partition / Offset** — Kafka sunucusu / olay kategorisi (`order.created`) / topic'in paralel şeritleri / "en son kaçıncı mesajı okudum" numarası.
- **Producer / Consumer / Consumer group** — Yazan / okuyan / işi paylaşan okuyucu ekibi.
- **At-least-once delivery** — Mesaj en az bir kez gelir — iki kez de gelebilir! Consumer idempotent olmalı.
- **Dead Letter Queue (DLQ)** — İşlenemeyen mesajların atıldığı "sorunlu mesajlar" kutusu.
- **Outbox pattern** — Event'i önce DB'deki outbox tablosuna (aynı transaction'da) yaz, sonra Kafka'ya gönder.
- **Saga** — Servisler arası çok adımlı işlem; bir adım başarısızsa önceki adımlar "telafi" edilir.
- **Event-driven architecture** — Servisler birbirini çağırmak yerine olay yayınlar ve dinler.

## Arama & Log
- **Elasticsearch** — Full-text arama ve log analizi motoru. "iphnoe" yazsan da iPhone'u bulur.
- **Inverted index** — "Kelime → geçtiği dokümanlar" listesi; kitap dizini gibi.
- **Kibana** — Elasticsearch'teki verileri (genelde logları) arayıp grafik/dashboard yaptığın ekran.
- **ELK stack** — Elasticsearch + Logstash (log toplama/işleme) + Kibana.

## DevOps / Altyapı
- **DevOps** — Kodun yazıldıktan sonra güvenli, otomatik, tekrarlanabilir şekilde canlıya çıkması ve orada sağlıklı kalması kültürü ve işi.
- **Docker image / container** — Uygulamanın tüm bağımlılıklarıyla paketlenmiş hâli / o paketin çalışan kopyası. Tarif ve yemek.
- **docker-compose** — Birden fazla container'ı tek dosyayla birlikte ayağa kaldırmak.
- **nginx** — Web sunucusu / reverse proxy / load balancer. İstekleri karşılayıp arkadaki servislere dağıtan resepsiyonist.
- **Reverse proxy** — Arkadaki sunucuların önünde duran ve istekleri onlara ileten aracı.
- **Load balancer** — İstekleri birden fazla sunucuya dağıtan bileşen.
- **Kubernetes (K8s)** — Binlerce container'ı yöneten orkestra şefi: başlatır, ölürse yeniden başlatır, yük artınca çoğaltır.
- **Pod** — K8s'te en küçük çalışma birimi; içinde 1 (bazen birkaç) container.
- **Deployment / ReplicaSet** — "Bu uygulamadan 3 kopya çalışsın" talimatı.
- **Service / Ingress** — Pod'lara sabit adres / dışarıdan gelen trafiği içeri alan kapı.
- **ConfigMap / Secret** — K8s'te ayarlar / gizli bilgiler.
- **Liveness / Readiness probe** — "Yaşıyor mu?" / "İstek almaya hazır mı?" kontrolleri.
- **HPA (autoscaling)** — CPU artınca pod sayısını otomatik artırma.
- **CrashLoopBackOff / OOMKilled** — Pod sürekli çöküp yeniden başlıyor / bellek yetmediği için öldürüldü.
- **CI/CD** — Her push'ta otomatik test+build (CI) ve otomatik canlıya çıkış (CD).
- **Rolling update / Rollback** — Pod'ları tek tek yeni versiyona geçirmek / bozuksa eski versiyona dönmek.

## QA
- **Test piramidi** — Çok unit test, orta integration, az e2e.
- **Unit / Integration / E2E test** — Tek fonksiyon / birkaç parça birlikte (API+DB) / gerçek kullanıcı gibi tarayıcıdan uçtan uca.
- **Smoke test** — "Temel şeyler çalışıyor mu?" hızlı kontrol (site açılıyor mu, login oluyor mu).
- **Sanity test** — Küçük bir düzeltmeden sonra o kısmın mantıklı çalıştığının hızlı kontrolü.
- **Regression test** — Yeni değişiklik eski çalışan bir şeyi bozdu mu?
- **Test case / Test plan / Test suite** — Tek senaryo adımları / neyin nasıl test edileceği planı / testler grubu.
- **Bug report, Severity vs Priority** — Hata raporu; ne kadar ciddi (severity) vs ne kadar acil düzeltilmeli (priority).
- **Flaky test** — Bazen geçen bazen kalan güvenilmez test.
- **Mock / Stub / Fake** — Testte gerçek bağımlılığın yerine geçen sahte parçalar.
- **Load / Stress test** — Normal yük altında / sınırları aşan yük altında sistemi test etmek.
- **p95 / p99 latency** — İsteklerin %95'i / %99'u bu süreden hızlı. Ortalama yalan söyler, yüzdelik söylemez.
- **Throughput / RPS** — Saniyede işlenen istek sayısı.

## Observability
- **Logs / Metrics / Traces** — Ne oldu (olay kaydı) / ne kadar (sayılar: CPU, istek sayısı, hata oranı) / bir isteğin servisler arası yolculuğu.
- **OpenTelemetry** — Log/metric/trace toplamanın standart, vendor-bağımsız yolu.
- **Grafana / Prometheus** — Dashboard ekranı / metrik toplayıcı.
- **Sentry** — Hataları stack trace ile yakalayıp gruplayan servis.
- **SLI / SLO / SLA** — Ölçtüğün şey (hata oranı) / hedefin (%99.9 başarı) / müşteriye verilen sözleşmeli söz.
- **Alert / On-call / Incident / Postmortem** — Alarm / nöbetçi mühendis / canlıdaki sorun / sonrasında "neden oldu, bir daha olmasın" raporu.

## Security / Pentest
- **Pentest** — İzinli, kontrollü saldırı ile açık bulma.
- **OWASP Top 10** — En yaygın 10 web güvenlik açığı listesi.
- **SQL Injection** — Kullanıcı girdisinin SQL komutu olarak çalıştırılması.
- **XSS** — Siteye başkasının tarayıcısında çalışacak JavaScript enjekte etmek.
- **CSRF** — Kullanıcının haberi olmadan, onun oturumuyla istek attırmak.
- **IDOR** — URL'deki id'yi değiştirip başkasının verisini görmek (`/orders/124`).
- **Brute force** — Şifreyi deneme-yanılma ile kırmak.
- **SSRF** — Sunucuya senin adına iç ağdaki adreslere istek attırmak.
- **WAF** — Saldırı kalıplarını yakalayıp engelleyen güvenlik duvarı.
- **SAST / DAST** — Kodu okuyarak / çalışan uygulamaya saldırarak açık arama (CodeQL / OWASP ZAP).
- **CSP / HSTS** — Sayfada hangi script'lerin çalışabileceği kuralı / sadece HTTPS zorunluluğu.

## System Design
- **Vertical vs horizontal scaling** — Daha güçlü makine vs daha çok makine.
- **Stateless** — Sunucu kullanıcıya dair hafıza tutmaz; her istek kendi başına anlaşılır → kolay çoğaltılır.
- **CAP teoremi** — Ağ bölünmesinde Consistency (tutarlılık) ile Availability (erişilebilirlik) arasında seçim yapmak zorundasın.
- **Eventual consistency** — Veri bir süre sonra her yerde tutarlı hâle gelir (anında değil).
- **Back-of-the-envelope** — Kaba hesap: "günde 10M kullanıcı × 20 istek = ~2300 RPS".
- **CQRS** — Yazma ve okuma modellerini ayırmak.

## Multi-tenancy & Release (Clopos pratikleri)
- **Tenant** — Sistemi kullanan müşteri; bizde bir restoran. Apartmandaki bir daire gibi.
- **Multi-tenancy** — Tek yazılımın birçok müşteriye hizmet etmesi; verilerinin birbirinden ayrı tutulması.
- **Database-per-tenant** — Her restorana ayrı veritabanı. Her daireye ayrı kilitli depo.
- **Control plane** — Tenant'ların listesi, DB adresleri, kanalları, ayarlarının tutulduğu merkezi DB. Apartman yöneticisinin defteri.
- **Provisioning** — Yeni restoran kaydolunca DB'sini oluşturup hazırlamak.
- **Migration fan-out** — Bir şema değişikliğini tüm tenant DB'lerine uygulamak.
- **Expand-contract** — Geriye uyumlu migration: önce yeni kolonu ekle (expand), kod geçince eskisini sil (contract).
- **Cross-tenant leak** — Bir restoranın başka restoranın verisini görmesi. Multi-tenant sistemin en kritik güvenlik hatası.
- **Preview / ephemeral environment** — Her PR için geçici açılan ortam (`pr-5545.client.clopos.menu`).
- **Branch protection** — `main`'e direkt push'u engelleyen, PR + onay + yeşil test zorunlu kılan kural.
- **Squash merge** — PR'daki tüm commit'leri tek commit olarak `main`'e almak.
- **Conventional Commits** — `feat:`, `fix:`, `chore:` ile başlayan standart commit mesajları.
- **Release channel / ring** — alpha → beta → rc → prod. Yeni özelliğin kademeli olarak daha geniş kitleye açılması.
- **RC (Release Candidate)** — "Bu versiyon prod'a çıkmaya aday; büyük bir hata yoksa bu çıkacak."
- **Promotion** — Bir versiyonu bir üst kanala taşımak (beta → rc).
- **Feature flag** — Kodu deploy edip özelliği bir anahtarla belirli restoranlarda açıp kapamak.
- **Canary / Blue-green deployment** — Yeni versiyonu önce küçük trafik dilimine vermek / iki tam ortam arasında anında geçiş.
- **Blast radius** — Bir hatanın etkileyebileceği alanın büyüklüğü. Kanallar bunu küçültmek için var.
- **Semver** — `MAJOR.MINOR.PATCH` (2.4.1) versiyonlama.

## NoSQL & MongoDB
- **NoSQL** — Tablo dışı veri modelleri: document (MongoDB), key-value (Redis), wide-column (Cassandra), graph (Neo4j).
- **Document / Collection** — MongoDB'de satır yerine JSON benzeri doküman, tablo yerine collection.
- **Embedding vs Referencing** — İlgili veriyi dokümanın içine gömmek vs id ile başka dokümana bağlamak (SQL'deki JOIN'in karşılığı).
- **Aggregation pipeline** — MongoDB'de veriyi adım adım işleme (`$match → $group → $sort`); SQL'deki GROUP BY / window function karşılığı.
- **Schema validation** — Esnek şemalı Mongo'da yine de kural koymak (Mongoose schema, JSON Schema).
- **NoSQL injection** — Girdiye `{"$ne": null}` gibi operatör sokup sorguyu bozmak.

## NestJS
- **NestJS** — Node.js için Angular tarzı, modüler backend framework'ü. Kurumsal projelerde çok yaygın.
- **Module / Controller / Provider (Service)** — Özellik paketi / HTTP isteğini karşılayan katman / iş mantığının yaşadığı sınıf.
- **Dependency Injection (DI)** — Sınıf ihtiyacı olanı kendisi yaratmaz, framework verir. Test ve değiştirme kolaylaşır.
- **Guard / Pipe / Interceptor / Exception filter** — Yetki kontrolü / girdiyi doğrulama-dönüştürme / isteğin öncesi-sonrası (log, süre) / hataları standart cevaba çevirme.

## Real-time, Entegrasyon, Offline
- **Polling / SSE / WebSocket** — Sürekli "yeni bir şey var mı?" diye sormak / sunucudan tek yönlü akış / iki yönlü kalıcı bağlantı.
- **Webhook** — Başka bir sistemin olay olunca senin URL'ine istek atması ("ödeme alındı"). Ters yönde API çağrısı.
- **Webhook signature** — Webhook'un gerçekten o servisten geldiğini kanıtlayan imza.
- **Cron job** — Zamanlanmış iş (her gece 03:00 Z raporu).
- **Z raporu** — POS'ta gün sonu satış raporu.
- **Offline-first / PWA / Service worker / IndexedDB** — İnternet yokken çalışmayı öncelikli tasarlamak / kurulabilir web uygulaması / tarayıcıda arka planda çalışan script / tarayıcı içi veritabanı.
- **RBAC** — Role-Based Access Control: owner, manager, waiter gibi rollere göre yetki.
- **Access / Refresh token** — Kısa ömürlü giriş anahtarı / onu yenilemek için uzun ömürlü anahtar.
- **gRPC / GraphQL** — Servisler arası hızlı ikili protokol / istemcinin istediği alanları seçtiği sorgu dili.

## Şirket & Rol
- **FDE (Forward Deployed Engineer)** — Müşterinin yanında (sahada) çalışıp ürünü onların gerçek problemine uyarlayan, kod da yazan mühendis. Palantir'le popüler oldu, AI şirketleriyle yaygınlaştı.
- **ADR** — Architecture Decision Record: "Neden Kafka seçtik?" kararının yazılı kaydı.
- **Code review / PR** — Kodun merge edilmeden önce başka bir developer tarafından incelenmesi.
