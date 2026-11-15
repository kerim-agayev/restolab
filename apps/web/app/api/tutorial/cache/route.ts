/**
 * Gün 7 lab endpoint'i: CDN cache'i canlı görmek için.
 *
 *   GET /api/tutorial/cache?newkey=1          → bu öğrenci için benzersiz bir cache anahtarı üretir (no-store)
 *   GET /api/tutorial/cache?k=<anahtar>&ttl=30 → ttl saniye boyunca CDN'de saklanır (s-maxage). generatedAt değişmiyorsa cevap önbellekten gelmiştir.
 *   GET /api/tutorial/cache?k=<anahtar>&ttl=0  → cache YOK (no-store): her seferinde yeni generatedAt
 *
 * Zararsız: sadece kendi cevabını saklar, veri yazmaz. ttl en fazla 120 sn.
 */
const MAX_TTL = 120;

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.searchParams.get("newkey") === "1") {
    return Response.json({ key: crypto.randomUUID().slice(0, 8) }, { headers: { "cache-control": "no-store" } });
  }

  const ttl = Math.min(Math.max(Number(url.searchParams.get("ttl") ?? 30) || 0, 0), MAX_TTL);
  const cacheControl = ttl === 0 ? "no-store" : `public, max-age=0, s-maxage=${ttl}`;

  console.log(
    JSON.stringify({
      level: "info",
      msg: "tutorial.cache.origin-hit",
      note: "Bu log görünüyorsa istek CDN'de bulunamadı, sunucuya (origin) kadar geldi",
      ttl,
      region: process.env.VERCEL_REGION ?? "local",
    }),
  );

  return Response.json(
    {
      generatedAt: new Date().toISOString(),
      ttl,
      servedFromRegion: process.env.VERCEL_REGION ?? "local",
      explain:
        ttl === 0
          ? "no-store: CDN saklamaz, her istek sunucuya gelir."
          : `s-maxage=${ttl}: CDN bu cevabı ${ttl} saniye saklar. generatedAt aynı kalıyorsa cevap CDN'den geldi.`,
    },
    { headers: { "cache-control": cacheControl } },
  );
}
