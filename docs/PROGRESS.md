# İlerleme Günlüğü

Claude her ders sonunda buraya bir satır ekler. Zorlanılan yerler bir sonraki dersin başında tekrar edilir.

| Gün | Tarih | Konu | Öğrenilen terimler | Zorlandığı / tekrar edilecek |
|---|---|---|---|---|
| 0 | 2026-11-08 | Hazırlık: CLAUDE.md, ROADMAP (90 gün), .env.example, TOKENS, GLOSSARY, ARCHITECTURE, PRODUCT. Clopos pratikleri eklendi; proje RestoLab oldu | — | — |
| 1 | 2026-11-08 | `gh` CLI, GitHub repo (public), pnpm+Turborepo monorepo, Next.js 16.4, Vercel deploy, branch protection, ilk PR (#1) + preview + merge | Git, commit, push, repo, monorepo, build, deploy, branch, PR, preview, QA, merge, squash, branch protection, env variable, Secret vs Config, build-time env, affected builds, LF/CRLF | Vercel env ekranı (ortam seçimi) kafa karıştırdı; hızlı anlatımda kayboldu → junior seviyesinde, benzetmeli tekrar anlatım istedi. Quiz: 3/3 doğru |

| 2 | 2026-11-09 | Git derin: kendi branch'ini açtı (`day-02/karim-title`), 4 durağı (status/add/commit/push) kendi yürüdü, PR #4 açtı; PR #3 merge sonrası **gerçek merge conflict** çıktı, `git pull --no-rebase origin main` + VS Code "Accept Current" ile çözdü, merge etti. `/tutorial/1` ve `/tutorial/2` yayında | staging, pull, HEAD, merge conflict, current/incoming, merge vs rebase, code review, Conventional Commits, lint | Çözülmüş conflict'i review beklemeden merge etti → çözülmüş conflict her zaman yeniden review/QA ister (anlatıldı). Doğru çalıştı, adımları sorunsuz takip etti |
| 3 | 2026-11-09 | HTTP: `/api/tutorial/http` lab endpoint'i (status/delay/crash, requestId'li JSON log) + `/tutorial/3` HTTP Lab (raw request/response, log paneli), DevTools Network ve Vercel Logs görevleri | request, method, header, body, status code aileleri, 401 vs 403, 405, client timeout, requestId | (kullanıcının lab görevleri sonrası doldurulacak) |

## Gün 1'de yaşanan gerçek bug (Gün 2 başında 1 dk tekrar)
"Ortam: unknown" → (1) Turbo strict env modu değişkeni gizledi → `turbo.json` `env` listesi; (2) Vercel env ilk eklemede 3 ortama birden uygulandı;
(3) env build anında gömülür → değişince redeploy; (4) boş commit "Skipped - Not affected" (affected builds).

## Canlı adresler
- Production: https://restolab-kappa.vercel.app (`main`)
- Repo: https://github.com/kerim-agayev/restolab
- Preview: `restolab-git-<branch>-kerimagayevs-projects.vercel.app` (Vercel Deployment Protection açık — sadece giriş yapmış hesap görür)

## Kullanıcı hakkında notlar
- Clopos'ta frontend; MSSQL'de junior seviye SELECT / window function biliyor.
- **Anlatım tercihi:** Adım adım, her adımda tam buton/menü adı, beklenen ekran çıktısı. Bir seferde tek iş. Restoran benzetmeleri iyi çalışıyor.
  Her dersin sonunda "UI'da ne görmelisin" bölümü olsun.
- Hesaplar: GitHub ✅, Vercel ✅ (proje: restolab, root: `apps/web`, env: `RELEASE_CHANNEL` prod/preview).
- Vercel MCP eklendi (`claude mcp add … https://mcp.vercel.com`) — kullanıcı `/mcp` ile **authenticate etmeli**; sonrasında deploy/log kontrolünü Claude yapabilir.

## Sıradaki ders
**Gün 4** — Ağ temeli: IP, port, localhost, TCP/UDP, DNS (`nslookup`, `curl -v`, `netstat`); kır: EADDRINUSE (port zaten kullanımda).
Açılış: Gün 3 quiz'i (401 vs 403, 4xx vs 5xx, requestId ile log bulma).
