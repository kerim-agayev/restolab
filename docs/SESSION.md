# SESSION.md — Kaldığımız yer (Claude'un kalıcı notu)

> **Claude: her oturumun İLK işi bu dosyayı okumak.** Oturum kaybolsa da (klasör adı değişse, `/clear`, yeni pencere)
> buradan devam edilir. Her önemli adımdan sonra (branch açıldı, PR açıldı, ders bitti, kullanıcı bir yerde takıldı)
> **"Adım günlüğü"ne bir satır ekle** ve "Şu an" bölümünü güncelle.
> Ders bazlı özet [PROGRESS.md](PROGRESS.md)'de, bu dosya ise **adım adım** "nerede kaldık" kaydıdır.

---

## Şu an (son güncelleme: 2026-11-11)

| | |
|---|---|
| **Tamamlanan son ders** | **Gün 3** — HTTP Lab (PR #5, merge edildi) |
| **Devam eden ders** | **Gün 4** PR #7 açık (kullanıcı merge etmedi, Gün 4 soruları cevapsız) · **Gün 5** kodu hazır: branch `day-05/network-1` (day-04 branch'inin ÜSTÜNDE — stacked). PR henüz yok |
| **Yapılacak** | PR #7 merge olunca: `git fetch` → `git rebase --onto origin/main day-04/devtools-curl day-05/network-1` → `git push --force-with-lease` → PR #8 (base main) |
| **Sonra** | **Gün 6** — Network 2: DNS, DHCP, ICMP (ping/tracert), TLS, sniffing simülatörü, firewall oyunu, "Enter'a bastın" final animasyonu |
| **Açık PR** | **#6** `day-05/network-plan` — sadece doküman: network Gün 5–6, plan 92 gün + `ogrenilecekler.txt` eklemeleri (Modül 15 Derinleşme) + SESSION.md. **Kullanıcı merge etmeli** (QA rolü). |
| **Lokal branch** | `day-05/network-plan` |
| **Commit'lenmemiş** | `ogrenilecekler.txt` (kullanıcının kişisel notu — bilerek commit edilmedi, untracked kalıyor) |
| **Canlı** | https://restolab-kappa.vercel.app · repo: https://github.com/kerim-agayev/restolab |

### Bir sonraki oturumda sırayla yapılacaklar
1. [ ] Kullanıcı PR #6'yı GitHub'da kontrol edip **Squash and merge** yapsın (sadece docs, preview testi gerekmez).
2. [ ] `git switch main` → `git pull` (⚠️ kullanıcının terminali de main'e geçer — söyle).
3. [ ] Gün 3 tekrarı (2 cümle + 3 soru). Odak: **client timeout ≠ server error** (Vercel log: `status 200, durationMs 5001`, tarayıcıda TIMEOUT).
4. [ ] `git switch -c day-04/devtools-curl`
5. [ ] Gün 4 dersi (ROADMAP Modül 1, satır "4"): DevTools Network sekmeleri (Headers, Payload, Preview vs Response, Initiator,
       Timing, Cookies, filtre, Preserve log, Disable cache, Slow 4G, HAR) + curl (`-i -v -X -H -d --max-time`, Copy as cURL) + QA bug report'a curl.
6. [ ] `/tutorial/4` sayfası + `lessons.ts`'e ekle → PR → preview → kullanıcı QA → merge.
7. [ ] Ders sonu: PROGRESS.md satırı, GLOSSARY.md yeni terimler, **bu dosyayı güncelle**.

---

## Adım günlüğü (en yeni en altta)

| Tarih | Ne oldu | Sonuç / not |
|---|---|---|
| 2026-11-08 | Gün 0: hazırlık dokümanları (CLAUDE, ROADMAP, TOKENS, GLOSSARY, ARCHITECTURE, PRODUCT) | commit `1a55858` |
| 2026-11-08 | Gün 1: monorepo, Next.js 16.4, Vercel deploy, branch protection, PR #1, #2 | merge ✅. Bug: "Ortam: unknown" (turbo env, Vercel env, redeploy) |
| 2026-11-09 | Gün 2: tutorial sayfaları PR #3; kullanıcı kendi PR #4'ünü açtı, **gerçek merge conflict** çözdü | merge ✅ |
| 2026-11-09 | Gün 3: HTTP Lab (`/api/tutorial/http`, `/tutorial/3`) PR #5 | merge ✅, quiz iyi |
| 2026-11-09 | Kullanıcı DevTools+curl için ayrı gün istedi → Gün 4 eklendi; network'ü çok önemli dedi → Gün 5–6'ya bölündü (92 gün). PR #6 | **açık, merge bekliyor** |
| 2026-11-09 → 11 | Eski oturum kayboldu: proje klasörü `senior_enginer` → `1_senior_enginer` olarak yeniden adlandırıldı; Claude Code oturumları klasör yoluna göre sakladığı için eski oturum yeni klasörde görünmüyor. Eski kayıt: `~/.claude/projects/c--Users-Karim-Desktop-senior-enginer/` | Bu SESSION.md bu yüzden açıldı |
| 2026-11-11 | Durum analizi yapıldı, SESSION.md + CLAUDE.md §3 kuralı eklendi | Sıradaki: PR #6 merge → Gün 4 |
| 2026-11-11 | PR #6 merge ✅. Gün 3 quiz: requestId ✅, 405 + timeout → tekrar edilecek (Gün 4 sayfasının 1. bölümü) | |
| 2026-11-11 | Gün 4 kodu: branch `day-04/devtools-curl`, `/tutorial/4` (TimeoutRace, NetworkPanel, CurlBuilder), route.ts'e 415. Lint/tsc/build/local test ✅ | **PR #7** açıldı, preview READY + `/tutorial/4` 200 (Vercel MCP ile doğrulandı) → kullanıcı QA + merge + görevler |
| 2026-11-11 | Kullanıcı Gün 4 sorularını cevaplamadan Gün 5'e geçmek istedi. Gün 5 kodu (7 bileşen + sayfa) yazıldı; lint/tsc/build/local 200 ✅. Branch push edildi (preview) | PR #7 merge bekleniyor → sonra rebase + PR #8 |
| 2026-11-11 | `ogrenilecekler.txt` işlendi → ROADMAP: Gün 11'e Redux, Gün 76'ya Prometheus, "Claude Code cümleleri" tablosu, okuma eşlikçisi, **Modül 15 Derinleşme (Gün 93–97)**, mobil → Modül 16 (98–102). PR #6'ya eklendi | ana plan 92 gün aynı; kullanıcı PR #6'yı merge edecek |

---

## Kullanıcının kişisel istek listesi (`ogrenilecekler.txt` özeti) → plandaki yeri

| İstek | Planda nerede |
|---|---|
| nginx, proxy | Modül 7 (Gün 57–62); proxy kavramına Gün 7'de (CDN/edge) kısa giriş |
| debugging | Her dersin "kır & log oku" kısmı; Modül 11 (incident) |
| System Design | Modül 13 (Gün 85–89) |
| Prometheus, Grafana, Kibana | Modül 11 (Gün 76–79) + Kibana Modül 7 |
| Testler (backend, frontend) | Modül 9 (Gün 66–70) |
| Redux | ✅ Gün 11'e "TanStack Query vs Redux Toolkit vs Zustand" eklendi + **Gün 94** Redux Toolkit uygulamalı |
| Debugging | ✅ **Gün 93** Debugging derin (VS Code debugger, breakpoint, node --inspect, source map, React DevTools) |
| Prometheus | ✅ Gün 76'ya açıkça eklendi (counter/gauge/histogram, PromQL) |
| Claude Code'un söylediği cümleleri anlamak: index, transaction, N+1, migration, cache katmanı, endpoint optimizasyonu, race condition, connection pool | ✅ ROADMAP'e "Claude Code bana şunu dedi" tablosu (cümle → gün). CLAUDE.md §6: her derste 🤖 kutusu |
| Kitaplar: *Designing Data-Intensive Applications* (Kleppmann, 2. baskı), *Database Internals* (Petrov) | ✅ ROADMAP "Okuma eşlikçisi" (konu → gün) + **Gün 95–97** (storage engine, replication/partitioning, dağıtık sistemler) |
