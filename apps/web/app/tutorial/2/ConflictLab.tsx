"use client";

import { useState } from "react";

const CURRENT = '      <h1 className="text-3xl font-bold">RestoLab — Admin Panel</h1>';
const INCOMING = '      <h1 className="text-3xl font-bold">RestoLab — Restoran Paneli</h1>';

const CONFLICTED = [
  "    <main>",
  "<<<<<<< HEAD (Current Change — senin branch'in)",
  CURRENT,
  "=======",
  INCOMING,
  ">>>>>>> main (Incoming Change — arkadaşının merge ettiği kod)",
  "      <p>Mini restoran yönetim sistemi</p>",
].join("\n");

const before = "    <main>\n";
const after = "\n      <p>Mini restoran yönetim sistemi</p>";

/**
 * VS Code’daki merge conflict ekranının simülatörü.
 * Kır: işaretleri (<<<<<<<) dosyada bırakıp "Build et"e bas → build hatası.
 */
export function ConflictLab() {
  const [text, setText] = useState(CONFLICTED);
  const [build, setBuild] = useState<null | { ok: boolean; msg: string }>(null);

  const accept = (which: "current" | "incoming" | "both") => {
    const body = which === "current" ? CURRENT : which === "incoming" ? INCOMING : `${CURRENT}\n${INCOMING}`;
    setText(before + body + after);
    setBuild(null);
  };

  const runBuild = () => {
    if (/^(<<<<<<<|=======|>>>>>>>)/m.test(text)) {
      setBuild({
        ok: false,
        msg: "❌ Build failed: Unexpected token '<<'. Çakışma işaretleri dosyada kaldı! Vercel bu PR'ı deploy edemez. (Gerçek hayatta bu hata Vercel build log'unda görünür.)",
      });
      return;
    }
    const h1Count = (text.match(/<h1/g) ?? []).length;
    if (h1Count > 1) {
      setBuild({
        ok: true,
        msg: "⚠️ Build geçti ama sayfada iki başlık var! 'Accept Both' her zaman doğru değildir — sonucu GÖZÜNLE kontrol et. Code review'da yakalanır.",
      });
      return;
    }
    setBuild({ ok: true, msg: "✅ Build başarılı. Şimdi git add → git commit → git push yapabilirsin." });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        <button onClick={() => accept("current")} className="rounded border border-emerald-500 px-2 py-1">
          Accept Current Change
        </button>
        <button onClick={() => accept("incoming")} className="rounded border border-sky-500 px-2 py-1">
          Accept Incoming Change
        </button>
        <button onClick={() => accept("both")} className="rounded border border-violet-500 px-2 py-1">
          Accept Both Changes
        </button>
        <button
          onClick={() => {
            setText(CONFLICTED);
            setBuild(null);
          }}
          className="rounded border px-2 py-1"
        >
          Çakışmayı geri getir
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setBuild(null);
        }}
        rows={8}
        spellCheck={false}
        className="w-full rounded-lg border border-zinc-300 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 dark:border-zinc-700"
      />
      <p className="text-xs text-zinc-500">
        İpucu: Yukarıdaki butonları kullan ya da metni elle düzenle (VS Code’da da elle düzenleyebilirsin). İkisini birleştirip yeni
        bir başlık da yazabilirsin.
      </p>
      <button onClick={runBuild} className="rounded bg-emerald-600 px-3 py-1 text-sm text-white">
        🔨 Build et
      </button>
      {build && (
        <p className={`rounded-lg border p-3 text-sm ${build.ok ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10"}`}>
          {build.msg}
        </p>
      )}
    </div>
  );
}
