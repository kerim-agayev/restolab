"use client";

/** CSR örneği: sayfa açıldıktan SONRA tarayıcı saati sunucudan ister. İlk HTML'de sadece "Yükleniyor…" vardır. */
import { useEffect, useState } from "react";

export function ClientTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/tutorial/cache?k=day8-csr&ttl=0")
      .then((r) => r.json())
      .then((d: { generatedAt: string }) => {
        if (alive) setTime(d.generatedAt);
      })
      .catch(() => {
        if (alive) setTime("hata: istek başarısız");
      });
    return () => {
      alive = false;
    };
  }, []);

  return <p className="font-mono text-lg">{time ?? "⏳ Yükleniyor… (tarayıcı şimdi istiyor)"}</p>;
}
