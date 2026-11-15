"use client";

/** Gün 11: localStorage sepeti + sunucuda fiyat kontrolü, optimistic UI, server vs client state, layout shift (CLS). */
import { useState, useSyncExternalStore } from "react";
import { CATALOG } from "@/lib/tutorial/catalog";

const btn = "rounded-lg border border-zinc-400 px-3 py-1.5 text-sm hover:bg-zinc-500/10 disabled:opacity-40";
const btnMain = "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40";
const fmt = (q: number) => `${Math.floor(q / 100)}.${String(q % 100).padStart(2, "0")} ₼`;

/* ───────────── 1. Sepet: localStorage (tarayıcının bloknotu) ───────────── */

type Line = { id: string; name: string; qty: number; price_minor: number };
const KEY = "restolab.cart.v1";
const EVT = "restolab-cart-change";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVT, cb);
  };
}
function getSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
const getServerSnapshot = () => "[]"; // sunucuda localStorage yok → boş sepet (hydration güvenli)

function parse(raw: string): Line[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? (v as Line[]).filter((l) => l && typeof l.id === "string" && typeof l.qty === "number") : [];
  } catch {
    return [];
  }
}
function save(lines: Line[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* gizli sekme vb. */
  }
  window.dispatchEvent(new Event(EVT));
}

type Checkout = { serverTotal_minor: number; clientTotal_minor: number; tampered: string[]; requestId: string } | { error: string };

export function CartLab() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const cart = parse(raw);
  const [result, setResult] = useState<Checkout | null>(null);
  const [busy, setBusy] = useState(false);
  const total = cart.reduce((s, l) => s + l.price_minor * l.qty, 0);

  function add(id: string) {
    const item = CATALOG.find((c) => c.id === id);
    if (!item) return;
    const existing = cart.find((l) => l.id === id);
    save(existing ? cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...cart, { id, name: item.name, qty: 1, price_minor: item.price_minor }]);
    setResult(null);
  }

  function tamper() {
    save(cart.map((l) => ({ ...l, price_minor: 1 })));
    setResult(null);
  }

  async function checkout() {
    setBusy(true);
    try {
      const r = await fetch("/api/tutorial/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: cart.map(({ id, qty, price_minor }) => ({ id, qty, price_minor })) }),
      });
      setResult((await r.json()) as Checkout);
    } catch {
      setResult({ error: "İstek başarısız" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {CATALOG.map((c) => (
          <button key={c.id} className={btn} onClick={() => add(c.id)}>
            + {c.name} ({fmt(c.price_minor)})
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-zinc-300 p-3 text-sm dark:border-zinc-700">
        <p className="mb-1 font-semibold">🛒 Sepet (tarayıcının hafızasında: localStorage)</p>
        {cart.length === 0 ? (
          <p className="text-zinc-500">Boş. Ürün ekle, sonra sayfayı F5 ile yenile: sepet kaybolmuyor mu?</p>
        ) : (
          <ul className="space-y-0.5 font-mono text-xs">
            {cart.map((l) => (
              <li key={l.id}>
                {l.qty} × {l.name} @ {fmt(l.price_minor)} = {fmt(l.qty * l.price_minor)}
              </li>
            ))}
            <li className="pt-1 font-semibold">Tarayıcının hesapladığı toplam: {fmt(total)}</li>
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={btnMain} disabled={cart.length === 0 || busy} onClick={checkout}>
          {busy ? "⏳" : "📨 Sipariş ver (sunucuya gönder)"}
        </button>
        <button className={btn} disabled={cart.length === 0} onClick={tamper}>
          😈 Fiyatları 0.01 ₼ yap (DevTools ile yapılabilecek şey)
        </button>
        <button className={btn} onClick={() => { save([]); setResult(null); }}>
          🗑️ Sepeti boşalt
        </button>
      </div>
      {result && "error" in result && <p className="rounded-lg bg-rose-500/15 p-3 text-sm">🚫 {result.error}</p>}
      {result && !("error" in result) && (
        <div className={`space-y-1 rounded-lg p-3 text-sm ${result.tampered.length ? "bg-amber-500/15" : "bg-emerald-500/15"}`}>
          <p>
            Tarayıcının iddiası: <b>{fmt(result.clientTotal_minor)}</b> · Sunucunun hesabı: <b>{fmt(result.serverTotal_minor)}</b>
          </p>
          {result.tampered.length > 0 ? (
            <p>
              🕵️ Sunucu değiştirilmiş fiyatı fark etti ({result.tampered.join(", ")}) ve <b>kendi fiyat listesini</b> kullandı. Müşteri 0.01 ₼ değil{" "}
              {fmt(result.serverTotal_minor)} öder. Olay loglandı.
            </p>
          ) : (
            <p>✅ Fiyatlar uyuşuyor.</p>
          )}
          <p className="font-mono text-xs">requestId: {result.requestId}</p>
        </div>
      )}
    </div>
  );
}

/* ───────────── 2. Optimistic UI (gerçek gecikme, gerçek hata) ───────────── */

export function OptimisticLab() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [optimistic, setOptimistic] = useState(true);
  const [fail, setFail] = useState(false);
  const [pending, setPending] = useState(0);

  async function add() {
    const before = count;
    if (optimistic) setCount((c) => c + 1);
    setPending((p) => p + 1);
    setLog((l) => [optimistic ? "⚡ Ekranda hemen +1 (iyimser: ‘nasılsa başarılı olur’)" : "⏳ Sunucuyu bekliyorum, ekran değişmedi…", ...l]);
    try {
      const r = await fetch(`/api/tutorial/http?status=${fail ? 503 : 200}&delay=1200`, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      if (!optimistic) setCount((c) => c + 1);
      setLog((l) => ["✅ Sunucu onayladı (200)", ...l]);
    } catch (e) {
      if (optimistic) setCount((c) => Math.max(before, c - 1));
      setLog((l) => [`❌ Sunucu reddetti (${(e as Error).message}) → ${optimistic ? "geri aldım (rollback), kullanıcıya haber ver" : "ekran zaten değişmemişti"}`, ...l]);
    } finally {
      setPending((p) => p - 1);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={optimistic} onChange={(e) => setOptimistic(e.target.checked)} /> İyimser (optimistic) mod
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} /> 💥 Sunucu hata versin (503)
        </label>
      </div>
      <button className={btnMain} onClick={add}>
        🍵 Sepete çay ekle — sepette: {count} {pending > 0 ? "⏳" : ""}
      </button>
      <ol className="space-y-0.5 text-xs">
        {log.slice(0, 6).map((l, i) => (
          <li key={`${i}-${l}`}>{l}</li>
        ))}
      </ol>
      <p className="text-xs text-zinc-500">İstekler gerçek: Gün 3’teki lab endpoint’ine 1.2 sn gecikmeyle gidiyor. Network sekmesinde görebilirsin.</p>
    </div>
  );
}

/* ───────────── 3. Bu veri kimin? (server state vs client state) ───────────── */

const DATA = [
  { name: "Menü fiyatları", answer: "server", tool: "TanStack Query (sunucudan çek, önbellekte tut, bayatlayınca yenile)" },
  { name: "Açık masalar listesi (başka garsonlar da değiştiriyor)", answer: "server", tool: "TanStack Query + yenileme (refetch / gerçek zamanlı: Gün 50’ler)" },
  { name: "Henüz gönderilmemiş sepet", answer: "client", tool: "useState / Zustand / Redux (+ localStorage’da kalıcı)" },
  { name: "Açılır menü açık mı kapalı mı", answer: "client", tool: "useState (bileşenin içinde, global olmasına gerek yok)" },
  { name: "Giriş yapmış kullanıcının rolü", answer: "server", tool: "Sunucuda oturum (httpOnly cookie) — Gün 17. Tarayıcıdaki kopya sadece gösterim." },
  { name: "Karanlık mod tercihi", answer: "client", tool: "localStorage ya da cookie (sunucu da okusun istersen cookie)" },
] as const;

export function WhoseData() {
  const [picked, setPicked] = useState<Record<number, string>>({});
  return (
    <div className="space-y-2">
      {DATA.map((d, i) => {
        const p = picked[i];
        return (
          <div key={d.name} className="space-y-1 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex-1">{d.name}</span>
              {(["server", "client"] as const).map((k) => (
                <button
                  key={k}
                  disabled={p !== undefined}
                  onClick={() => setPicked((s) => ({ ...s, [i]: k }))}
                  className={`rounded border px-2 py-1 text-xs ${p === k ? (k === d.answer ? "border-emerald-500 bg-emerald-500/20" : "border-rose-500 bg-rose-500/20") : "border-zinc-400"}`}
                >
                  {k === "server" ? "📒 Resmî kayıt (server state)" : "📝 Garsonun bloknotu (client state)"}
                </button>
              ))}
            </div>
            {p !== undefined && (
              <p className="text-xs">
                {p === d.answer ? "✅ " : "🤔 "}
                <b>Araç:</b> {d.tool}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── 4. Sayfa kayması (CLS) ───────────── */

export function LayoutShift() {
  const [reserved, setReserved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");

  function load() {
    setLoaded(false);
    setPhase("loading");
    setTimeout(() => {
      setLoaded(true);
      setPhase("done");
    }, 1500);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={reserved} onChange={(e) => setReserved(e.target.checked)} /> Görselin yeri önceden ayrılsın (width/height)
        </label>
        <button className={btnMain} onClick={load}>
          🔄 Sayfayı yükle
        </button>
      </div>
      {phase !== "idle" && (
        <div className="space-y-2 rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">
          <p className="font-semibold">🍛 Bugünün yemeği: Plov</p>
          {loaded ? (
            <div className="flex h-28 items-center justify-center rounded bg-amber-400/40 text-sm">🖼️ (geç yüklenen büyük görsel)</div>
          ) : reserved ? (
            <div className="flex h-28 items-center justify-center rounded bg-zinc-500/10 text-xs text-zinc-500">görsel yükleniyor… (yeri hazır)</div>
          ) : null}
          <div className="flex gap-2">
            <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white">✅ Sipariş ver</button>
            <button className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white">❌ Siparişi iptal et</button>
          </div>
        </div>
      )}
      {phase === "done" && (
        <p className={`rounded-lg p-3 text-sm ${reserved ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
          {reserved
            ? "✅ Hiçbir şey yerinden oynamadı: görselin yeri baştan ayrılmıştı. CLS ≈ 0."
            : "💥 Görsel gelince butonlar ~120 px aşağı kaydı. Kullanıcı tam o an ‘Sipariş ver’e basacakken parmağının altına başka şey gelebilir. Buna layout shift (CLS) denir."}
        </p>
      )}
    </div>
  );
}
