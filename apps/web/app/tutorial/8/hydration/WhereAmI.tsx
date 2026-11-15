"use client";

/**
 * BİLEREK BOZUK (Gün 8 "kır" görevi): sunucuda ve tarayıcıda FARKLI metin üretir.
 * Sunucu HTML'i "sunucuda" yazar; tarayıcı canlandırırken "tarayıcıda" bekler → hydration mismatch.
 * Düzeltmesi: tarayıcıya özel değeri useEffect içinde (sayfa canlandıktan sonra) okumak.
 */
export function WhereAmI() {
  const where = typeof window === "undefined" ? "sunucuda" : "tarayıcıda";
  return <p className="font-mono text-lg">Bu yazı {where} üretildi.</p>;
}
