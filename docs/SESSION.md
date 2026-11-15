# SESSION.md — Kaldığımız yer (Claude'un kalıcı notu)

> **Claude: her oturumun İLK işi bu dosyayı okumak.** Oturum kaybolsa da (klasör adı değişse, `/clear`, yeni pencere)
> buradan devam edilir. Her önemli adımdan sonra (branch açıldı, PR açıldı, ders bitti, kullanıcı bir yerde takıldı)
> **"Adım günlüğü"ne bir satır ekle** ve "Şu an" bölümünü güncelle.
> Ders bazlı özet [PROGRESS.md](PROGRESS.md)'de, bu dosya ise **adım adım** "nerede kaldık" kaydıdır.

---

## Şu an (son güncelleme: 2026-11-15)

| | |
|---|---|
| **Tamamlanan son ders** | **Gün 13** (PR #12 merge ✅). Gün 1–12 merge ✅ |
| **Devam eden ders** | **Gün 14** — branch `day-14/prisma-erd` (main'den, stacked DEĞİL). Kullanıcı preview'da yapacak → merge |
| **Neon MCP** | `~/.claude.json` user scope, `projectId=summer-sunset-24930758`. Durum: kullanıcı `/mcp` → neon → Authenticate yapmalı, sonra YENİ sohbet. Sohbette araçlar yoksa `claude mcp get neon` çalıştır; **yeniden `mcp add` yapma** (sadece auth/yeni sohbet gerekir) |
| **Dikkat** | PR #12, fra1 commit'leri (79c8917, 1f17199) girmeden merge edildi → **production hâlâ iad1**. Bu dosyalar Gün 14 PR'ına taşındı (commit 1793700): #13 merge olunca production fra1'e geçer |
| **Cevap bekleyen sorular** | Gün 5: (1) ipconfig IP ≠ ifconfig.me IP neden? (2) exit 7 vs exit 28. Gün 4: TIMEOUT ama logda 200. Gün 7: CORS açık soru |
| **Sonra** | **Gün 15** — migrations: `prisma migrate dev`, migration dosyasını oku, Neon branch (PR başına DB), drift'i kır. Plan: [HAFTA-3.md](HAFTA-3.md) |
| **Commit'lenmemiş** | `ogrenilecekler.txt` (kullanıcının kişisel notu — bilerek commit edilmedi, untracked kalıyor) |
| **Canlı** | https://restolab-kappa.vercel.app · repo: https://github.com/kerim-agayev/restolab |

### Bir sonraki oturumda sırayla yapılacaklar
1. [ ] Kullanıcı Gün 14 PR'ını (#13) preview'da test edip **Squash and merge** yapsın.
2. [ ] Merge sonrası production'da `x-vercel-id` sonu `::fra1` mi kontrol et (Vercel MCP veya curl).
3. [ ] TeachBack cevapları gelirse PROGRESS "zorlandığı" sütunu (Gün 4–14).
4. [ ] `git switch main` → `git pull` → `git switch -c day-15/migrations` (⚠️ kullanıcının terminali de değişir — söyle).

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
| 2026-11-12 | Kullanıcı: Gün 5 zor, ekonomi okudu, ezber istemiyor → Feynman. `/tutorial/5/kolay` eklendi (PR #8'e). **CLAUDE.md kural #13**: her ders önce sade (Feynman), sonra `/teknik`. Gün 6 yapıldı: `/tutorial/6` + `/tutorial/6/teknik`, PR #9 (stacked). Kullanıcı Gün 6+7'yi bugün istedi | #8 merge → #9 rebase `git rebase --onto origin/main day-05/network-1 day-06/network-2` |
| 2026-11-12 | Gün 7 yapıldı: `/tutorial/7` + `/teknik`, `/api/tutorial/cache` (gerçek CDN cache lab), PR #10 (stacked, base day-06). Komutlar (curl HIT/age, CORS, OPTIONS) kullanıcının makinesinde doğrulandı | #8 → #9 → #10 sırayla merge; her merge'den sonra bir üstteki PR `git rebase --onto origin/main <alt-branch> <üst-branch>` |
| 2026-11-15 | Kullanıcı #8'i squash merge etti → #9'da 4 dosyada conflict (squash yeni commit üretir, eski commit'ler 'farklı' görünür). Çözüm: `git rebase --onto origin/main day-05/network-1 day-06/network-2` + `git rebase --onto day-06/network-2 <eski-day06-sha> day-07/...` + force-with-lease. #9 CLEAN | #9 → #10 merge bekleniyor |
| 2026-11-15 | #9, #10 merge ✅ (her birinde squash sonrası rebase --onto). Kullanıcı Pazar günü Gün 8–12'nin hepsini istedi → tek branch `week-02/days-08-12`, 5 commit (gün başına 1), zod eklendi. Lab API'leri (masa, cart) ve /tutorial/8/lab (use cache donuk, connection() taze) local'de doğrulandı. findstr minified HTML'de 'Line too long' → Select-String. HAFTA-3.md yazıldı | PR merge bekleniyor → Pzt Gün 13 |
| 2026-11-15 | Kullanıcı Neon hesabı açtı, bağlantı adresini `.env.example`'a yapıştırdı (commit YOK). → `apps/web/.env.local`'e taşındı (git-ignored), şablon geri alındı, şifre hiçbir tracked dosyada yok (kontrol edildi). `neon init/deploy` kullanılmadı. Neon'da `CREATE DATABASE control_db`; sslmode=verify-full. Gün 13: `pg` + `lib/db.ts` + `/api/tutorial/db` + sayfalar. Local'de Neon'a uçtan uca test ✅ (cold start 2088 ms → 84 ms; 28P01/3D000/ENOTFOUND; leak check ✅) | PR #12 stacked; kullanıcı Vercel env eklemeli |
| 2026-11-15 | Kullanıcı Vercel env ekleyemedi: talimatım eski terim ('Sensitive') kullanıyordu, güncel panel 'Secret / Config' diyor; ayrıca 'neden'i önce anlatmamıştım (kural 11 ihlali). Kullanıcı onayıyla Vercel MCP `create_project_env` (type sensitive → visibility secret) + redeploy. Preview: /api/tutorial/db 200 (control_db), compare ok, 28P01 ✅. **Bulgu:** fonksiyon bölgesi iad1 (ABD), Neon fra (Frankfurt) → her sorgu ~90 ms okyanus aşırı; fra1'e taşıma önerildi (kullanıcı kararı) | Gün 13 + bölge kararı bekleniyor |
| 2026-11-15 | Kullanıcı onayıyla bölge taşındı: `apps/web/vercel.json` → `regions: ["fra1"]` (kod olarak, PR'da). Ölçüm (preview, ısınmış): ÖNCE iad1 sorgu ~92 ms / bağlantı ~565 ms → SONRA fra1 sorgu ~2 ms / bağlantı ~22–47 ms. x-vercel-id `fra1:iad1::iad1` → `fra1:iad1::fra1`. Gün 13 teknik sayfasına vaka olarak eklendi. Production merge'e kadar iad1'de | #12 merge bekleniyor |
| 2026-11-15 | Kullanıcı #12'yi merge etti, 'gün 14 ile devam et'. Fark edildi: fra1 commit'leri squash'a girmemiş → `git checkout origin/day-13/postgres-neon -- <4 dosya>` ile Gün 14 branch'ine taşındı. Gün 14: Prisma **7.10.1** (npm `latest` = 8.0.0-rc → stabil sabitlendi), `prisma init` repoda ÇALIŞTIRILMADI (ajan skill klasörleri ekliyor) → dosyalar elle. prisma.config.ts `process.loadEnvFile('.env.local')` + UNPOOLED; lib/prisma.ts adapter-pg POOLED. Migration `init_users_restaurants` control_db'ye uygulandı, seed.sql (sahte, idempotent). Lab `/api/tutorial/erd` local'de 5/5 ✅ (200 rollback, 23503×2, 23505, 23001); veri 5 satırda kaldı. Studio Prisma 7'de rastgele port. lint/tsc/build ✅ | PR #13 açıldı → kullanıcı test |
| 2026-11-15 | Kullanıcı Neon MCP istedi (rehber: neon.com/guides/claude-code-mcp-neon). `claude mcp add --transport http neon "https://mcp.neon.tech/mcp?projectId=summer-sunset-24930758"` → local scope, proje kilitli, read-only DEĞİL (kullanıcı 'idare edebilesin' dedi; yazma işlemleri onaylı). Durum: Needs authentication → kullanıcı `/mcp` ile OAuth yapacak. TOKENS.md §Neon 6 eklendi | OAuth bekleniyor; org hesabıysa API key yolu |
| 2026-11-15 | İkinci sohbette 'neon bağlı değil' denmiş. Sebep: local scope tek klasör yoluna bağlı + araçlar sohbet başında yükleniyor. `claude mcp remove neon -s local` + `add --scope user` → her klasörde görünür. Giriş yeniden gerekiyor (token eski kayda bağlıydı). TOKENS.md güncellendi | kullanıcı Authenticate → yeni sohbet → `control_db` tablolarını listele |

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
