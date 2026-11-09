"use client";

import { useState } from "react";

type Scope = "all" | "production";

/**
 * Gün 1'deki "Ortam: unknown" bug'ının simülatörü.
 * Ayarları değiştir → hangi ortamda ekranda ne yazacağını ve NEDEN yazdığını gör.
 */
function compute(target: "production" | "preview", s: {
  turboListed: boolean;
  prodScope: Scope;
  previewVar: boolean;
  rebuilt: boolean;
}): { value: string; why: string; error?: boolean } {
  if (s.previewVar && s.prodScope === "all")
    return {
      value: "—",
      error: true,
      why: "Vercel kaydetmene izin vermez: 'prod' değişkeni zaten Preview'da da var. Aynı ortamda aynı isimde iki değişken olamaz. (Senin dün yaşadığın kırmızı kutu!)",
    };
  if (!s.turboListed)
    return {
      value: "unknown",
      why: "Turbo (kapıdaki güvenlik görevlisi) turbo.json listesinde adı olmayan değişkeni build'e sokmadı. Değişken Vercel'de var ama kod göremedi.",
    };
  if (target === "production")
    return { value: "prod", why: "Production'da RELEASE_CHANNEL=prod var ve Turbo onu build'e geçirdi." };
  if (!s.rebuilt)
    return {
      value: "prod",
      why: "Bu preview, ayarları değiştirmeden ÖNCE build edildi. O zaman 'prod' notu tüm ortamlardaydı. Env build anında gömülür → değişiklik için REDEPLOY gerekir.",
    };
  if (s.previewVar) return { value: "preview", why: "Preview'a özel RELEASE_CHANNEL=preview var ve yeni build onu okudu. ✅ Doğru kurulum!" };
  if (s.prodScope === "all") return { value: "prod", why: "Preview'a özel değişken yok; 'prod' notu tüm ortamlara yapışık olduğu için preview da 'prod' diyor." };
  return { value: "unknown", why: "'prod' sadece Production'da, Preview için hiç değişken yok → kod boş değer görüyor." };
}

export function EnvLab() {
  const [turboListed, setTurboListed] = useState(false);
  const [prodScope, setProdScope] = useState<Scope>("all");
  const [previewVar, setPreviewVar] = useState(false);
  const [rebuilt, setRebuilt] = useState(false);
  const s = { turboListed, prodScope, previewVar, rebuilt };

  const box = (target: "production" | "preview", url: string) => {
    const r = compute(target, s);
    return (
      <div
        className={`space-y-2 rounded-lg border p-3 ${
          r.error ? "border-red-500 bg-red-500/10" : r.value === "unknown" ? "border-amber-500 bg-amber-500/10" : "border-emerald-500 bg-emerald-500/10"
        }`}
      >
        <p className="font-mono text-xs text-zinc-500">{url}</p>
        <p className="text-lg">
          Ortam: <b>{r.value}</b>
        </p>
        <p className="text-sm">{r.why}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={turboListed} onChange={(e) => setTurboListed(e.target.checked)} />
          turbo.json’daki <code>env</code> listesinde <code>RELEASE_CHANNEL</code> var
        </label>
        <label className="flex items-center gap-2">
          <code>RELEASE_CHANNEL=prod</code> hangi ortamlarda?
          <select value={prodScope} onChange={(e) => setProdScope(e.target.value as Scope)} className="rounded border bg-transparent px-2 py-1">
            <option value="all">Production + Preview + Development (Vercel varsayılanı)</option>
            <option value="production">Sadece Production</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={previewVar} onChange={(e) => setPreviewVar(e.target.checked)} />
          Preview için ayrı <code>RELEASE_CHANNEL=preview</code> eklendi
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={rebuilt} onChange={(e) => setRebuilt(e.target.checked)} />
          Ayarlardan sonra preview yeniden build edildi (redeploy / yeni commit)
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {box("production", "restolab-kappa.vercel.app")}
        {box("preview", "restolab-git-<branch>…vercel.app")}
      </div>
      <p className="text-sm text-zinc-500">
        Görev: Dünkü sırayı tekrar oyna. Önce hepsi kapalıyken başla (= ilk deploy), sonra kutucukları teker teker açarak iki kutuyu da yeşil yap.
      </p>
    </div>
  );
}
