"use client";

/** Gün 9: gerçek "Masa aç" formu (Server Action), API lab'ı (Route Handler), 400/422/409 sınıflandırma. */
import { useActionState, useState } from "react";
import { masaAc, type MasaState } from "./actions";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";
const input = "w-full rounded border border-zinc-400 bg-white p-1.5 text-sm dark:bg-zinc-900";

/* ───────────── 1. Gerçek form + Server Action ───────────── */

export function MasaForm() {
  const [state, action, pending] = useActionState<MasaState, FormData>(masaAc, { status: "idle" });
  const [browserCheck, setBrowserCheck] = useState(true);
  const err = state.status === "invalid" ? state.errors : {};

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={browserCheck} onChange={(e) => setBrowserCheck(e.target.checked)} />
        Tarayıcı kontrolü açık (HTML <code>required</code>, <code>min</code>, <code>max</code>)
      </label>
      {!browserCheck && (
        <p className="rounded-lg bg-amber-500/15 p-2 text-xs">
          😈 Tarayıcı kontrolünü kapattın: artık masa 99, qonaq 0, boş ad gönderebilirsin. Bu, kötü niyetli birinin DevTools ile yapabileceği
          şeyin aynısı. Bakalım sunucu ne diyecek.
        </p>
      )}
      <form action={action} noValidate={!browserCheck} className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span>Masa no</span>
          <input name="masaNo" type="number" required min={1} max={50} defaultValue={5} className={input} />
          {err.masaNo && <span className="block text-xs text-rose-600">{err.masaNo}</span>}
        </label>
        <label className="space-y-1 text-sm">
          <span>Qonaq sayı</span>
          <input name="qonaq" type="number" required min={1} max={12} defaultValue={2} className={input} />
          {err.qonaq && <span className="block text-xs text-rose-600">{err.qonaq}</span>}
        </label>
        <label className="space-y-1 text-sm">
          <span>Ofisiant</span>
          <input name="ofisiant" type="text" required minLength={2} maxLength={40} defaultValue="Aysel" className={input} />
          {err.ofisiant && <span className="block text-xs text-rose-600">{err.ofisiant}</span>}
        </label>
        <button type="submit" disabled={pending} className={`${btnMain} sm:col-span-3`}>
          {pending ? "⏳ Sunucu kontrol ediyor…" : "🍽️ Masa aç"}
        </button>
      </form>
      {state.status === "ok" && (
        <p className="rounded-lg bg-emerald-500/15 p-3 text-sm">
          ✅ Masa {state.data.masaNo} açıldı · {state.data.qonaq} qonaq · ofisiant {state.data.ofisiant}
          <span className="block font-mono text-xs">requestId: {state.requestId}</span>
        </p>
      )}
      {state.status === "invalid" && (
        <p className="rounded-lg bg-rose-500/15 p-3 text-sm">
          🚫 <b>Sunucu</b> reddetti (tarayıcı değil!). Kırmızı yazılar sunucudan geldi.
          <span className="block font-mono text-xs">requestId: {state.requestId}</span>
        </p>
      )}
      {state.status === "conflict" && (
        <p className="rounded-lg bg-amber-500/15 p-3 text-sm">
          ⚠️ {state.message} Veri doğru ama iş kuralıyla çakışıyor.
          <span className="block font-mono text-xs">requestId: {state.requestId}</span>
        </p>
      )}
      <p className="text-xs text-zinc-500">Denemeler: masa 7 (zaten açık) · tarayıcı kontrolünü kapatıp masa 99 · boş ofisiant adı.</p>
    </div>
  );
}

/* ───────────── 2. Aynı iş, API olarak (Route Handler) ───────────── */

const CASES = [
  { id: "ok", label: "✅ Doğru JSON", ct: "application/json", body: '{"masaNo":5,"qonaq":2,"ofisiant":"Aysel"}' },
  { id: "broken", label: "🧩 Bozuk JSON", ct: "application/json", body: '{"masaNo":5,"qonaq":' },
  { id: "rule", label: "📏 Kurala uymayan", ct: "application/json", body: '{"masaNo":99,"qonaq":0,"ofisiant":"A"}' },
  { id: "busy", label: "🪑 Masa 7 (dolu)", ct: "application/json", body: '{"masaNo":7,"qonaq":2,"ofisiant":"Aysel"}' },
  { id: "text", label: "📝 JSON değil (text)", ct: "text/plain", body: "masa 5 lutfen" },
] as const;

type ApiResult = { status: number; body: string };

export function ApiLab() {
  const [res, setRes] = useState<Record<string, ApiResult | "…">>({});

  async function send(c: (typeof CASES)[number]) {
    setRes((r) => ({ ...r, [c.id]: "…" }));
    try {
      const r = await fetch("/api/tutorial/masa", { method: "POST", headers: { "content-type": c.ct }, body: c.body });
      const text = await r.text();
      setRes((s) => ({ ...s, [c.id]: { status: r.status, body: text } }));
    } catch {
      setRes((s) => ({ ...s, [c.id]: { status: 0, body: "istek başarısız" } }));
    }
  }

  return (
    <div className="space-y-2">
      {CASES.map((c) => {
        const r = res[c.id];
        return (
          <div key={c.id} className="space-y-1 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-700">
            <div className="flex flex-wrap items-center gap-2">
              <button className={btn} onClick={() => send(c)}>
                {c.label}
              </button>
              <code className="text-xs">{c.body}</code>
            </div>
            {r === "…" && <p className="text-xs">⏳</p>}
            {r && r !== "…" && (
              <pre className={`overflow-x-auto whitespace-pre-wrap rounded p-2 text-xs ${r.status >= 400 ? "bg-rose-500/10" : "bg-emerald-500/10"}`}>
                HTTP {r.status}
                {"\n"}
                {r.body}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── 3. Kasiyer oyunu: 400 / 422 / 409 / 201 ───────────── */

const SLIPS = [
  { text: "Fiş yırtık, yarısı okunmuyor: {\"masaNo\":5,", answer: 400, why: "Biçim bozuk, okunamıyor bile → 400 Bad Request." },
  { text: "Fiş okunuyor: masa 99 (restoranda 50 masa var)", answer: 422, why: "Okunuyor ama içerik kurala aykırı → 422 Unprocessable." },
  { text: "Fiş okunuyor, kurallara uygun: masa 7 — ama masa 7’de başka garsonun müşterisi oturuyor", answer: 409, why: "Veri doğru, mevcut durumla çakışıyor → 409 Conflict." },
  { text: "Masa 12, 4 qonaq, ofisiant Rauf", answer: 201, why: "Her şey yolunda, yeni bir şey oluşturuldu → 201 Created." },
  { text: "Qonaq sayısı: “iki” (sayı yerine yazı)", answer: 422, why: "JSON geçerli, ama alanın tipi yanlış → doğrulama hatası (422)." },
] as const;

export function CashierGame() {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div className="space-y-2">
      {SLIPS.map((s, i) => {
        const p = picked[i];
        return (
          <div key={s.text} className="space-y-1 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-700">
            <p>🧾 {s.text}</p>
            <div className="flex flex-wrap gap-1">
              {[201, 400, 409, 422].map((code) => (
                <button
                  key={code}
                  disabled={p !== undefined}
                  onClick={() => setPicked((x) => ({ ...x, [i]: code }))}
                  className={`rounded border px-2 py-1 font-mono text-xs ${p === code ? (code === s.answer ? "border-emerald-500 bg-emerald-500/20" : "border-rose-500 bg-rose-500/20") : "border-zinc-400"}`}
                >
                  {code}
                </button>
              ))}
            </div>
            {p !== undefined && <p className="text-xs">{p === s.answer ? "✅ " : `🤔 Doğrusu ${s.answer}. `}{s.why}</p>}
          </div>
        );
      })}
    </div>
  );
}
