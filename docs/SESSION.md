# SESSION.md — Kaldığımız yer (Claude'un kalıcı notu)

> **Claude: her oturumun İLK işi bu dosyayı okumak.** Oturum kaybolsa da (klasör adı değişse, `/clear`, yeni pencere)
> buradan devam edilir. Her önemli adımdan sonra (branch açıldı, PR açıldı, ders bitti, kullanıcı bir yerde takıldı)
> **"Adım günlüğü"ne bir satır ekle** ve "Şu an" bölümünü güncelle.
> Ders bazlı özet [PROGRESS.md](PROGRESS.md)'de, bu dosya ise **adım adım** "nerede kaldık" kaydıdır.

---

## Şu an (son güncelleme: 2026-11-11)

| | |
|---|---|
| **Tamamlanan son ders** | **Gün 4** — DevTools + curl (PR #7, merge edildi 2026-11-11) |
| **Devam eden ders** | **Gün 5** — Network 1: branch `day-05/network-1` main'in üstüne rebase edildi → **PR #8** açık. Kullanıcı preview'da QA + terminal görevleri + merge |
| **Cevap bekleyen sorular** | Gün 5: (1) ipconfig IP ≠ ifconfig.me IP neden? (2) exit 7 vs exit 28. Gün 4'ten: TIMEOUT ama logda 200 (garson/mutfak) |
| **Sonra** | **Gün 6** — Network 2: DNS, DHCP, ICMP (ping/tracert), TLS, sniffing simülatörü, firewall oyunu, "Enter'a bastın" final animasyonu |
| **Commit'lenmemiş** | `ogrenilecekler.txt` (kullanıcının kişisel notu — bilerek commit edilmedi, untracked kalıyor) |
| **Canlı** | https://restolab-kappa.vercel.app · repo: https://github.com/kerim-agayev/restolab |

### Bir sonraki oturumda sırayla yapılacaklar
1. [ ] Kullanıcı PR #8'i (Gün 5) preview'da test edip **Squash and merge** yapsın.
2. [ ] Cevapları değerlendir → PROGRESS.md Gün 4 + Gün 5 "zorlandığı" sütunu.
3. [ ] `git switch main` → `git pull` → `git switch -c day-06/network-2` (⚠️ kullanıcının terminali de değişir — söyle).
4. [ ] Gün 6 dersi + `/tutorial/6` + lessons.ts → PR → preview → merge. Ders sonu: PROGRESS, GLOSSARY, bu dosya.

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
| 2026-11-11 | PR #7 merge ✅ (kullanıcı). `day-05/network-1` → `git rebase --onto origin/main day-04/devtools-curl` (stacked branch'in gerçek kullanımı), force-with-lease push, **PR #8** açıldı | QA + merge bekleniyor |

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
