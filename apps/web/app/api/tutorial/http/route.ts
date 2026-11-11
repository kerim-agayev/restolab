/**
 * Gün 3 — HTTP laboratuvarı endpoint'i.
 *
 * İstediğin cevabı "sipariş edebilirsin":
 *   ?status=404   → o status code ile cevap döner
 *   ?delay=5000   → cevap vermeden önce bekler (timeout'u görmek için)
 *   ?crash=1      → bilerek exception fırlatır (gerçek 500 + Vercel loglarında hata)
 *
 * Her istek bir requestId alır ve JSON log satırı olarak yazılır.
 * Vercel → Project → Logs ekranında requestId ile arayıp bulabilirsin.
 *
 * PATCH bilerek export edilmedi → Next.js otomatik 405 Method Not Allowed döner.
 */

const STATUS_TEXT: Record<number, { text: string; tr: string }> = {
  200: { text: "OK", tr: "Her şey yolunda, istediğin veri burada." },
  201: { text: "Created", tr: "Yeni bir kayıt oluşturuldu (ör. sipariş açıldı)." },
  204: { text: "No Content", tr: "İşlem başarılı ama geri gönderecek içerik yok (ör. silme)." },
  400: { text: "Bad Request", tr: "İsteğin bozuk: eksik/yanlış veri gönderdin. Hata SENDE (client)." },
  401: { text: "Unauthorized", tr: "Kim olduğunu bilmiyorum: giriş yapmamışsın veya token süresi dolmuş." },
  403: { text: "Forbidden", tr: "Kim olduğunu biliyorum ama buna YETKİN yok (ör. garson rapor sayfasına girmeye çalışıyor)." },
  404: { text: "Not Found", tr: "İstediğin kaynak yok (ör. olmayan masa numarası)." },
  405: { text: "Method Not Allowed", tr: "Bu adres bu method'u kabul etmiyor (ör. PATCH desteklenmiyor)." },
  415: { text: "Unsupported Media Type", tr: "Body'nin formatını söylemedin veya desteklemiyorum: content-type: application/json bekliyordum." },
  409: { text: "Conflict", tr: "Mevcut durumla çakışıyor (ör. masa zaten başka garson tarafından açılmış)." },
  422: { text: "Unprocessable Content", tr: "Format doğru ama içerik kurala uymuyor (ör. adet = -3)." },
  429: { text: "Too Many Requests", tr: "Çok hızlı/çok fazla istek attın. Rate limit'e takıldın, biraz bekle." },
  500: { text: "Internal Server Error", tr: "Sunucuda beklenmeyen bir hata oldu. Hata SUNUCUDA, senin isteğin değil." },
  502: { text: "Bad Gateway", tr: "Aradaki kapı (nginx/gateway) arkadaki servise ulaşamadı veya bozuk cevap aldı." },
  503: { text: "Service Unavailable", tr: "Servis şu an hizmet veremiyor (bakım, aşırı yük)." },
};

const MAX_DELAY_MS = 8000;

async function handle(request: Request): Promise<Response> {
  const started = Date.now();
  const requestId = crypto.randomUUID();
  const url = new URL(request.url);
  const status = Number(url.searchParams.get("status") ?? 200);
  const delay = Math.min(Number(url.searchParams.get("delay") ?? 0) || 0, MAX_DELAY_MS);
  const crash = url.searchParams.get("crash") === "1";
  const channel = process.env.RELEASE_CHANNEL ?? "unknown";

  const log = (level: "info" | "warn" | "error", extra: Record<string, unknown>) =>
    console[level === "info" ? "log" : level](
      JSON.stringify({
        level,
        msg: "tutorial.http",
        requestId,
        method: request.method,
        path: url.pathname + url.search,
        channel,
        durationMs: Date.now() - started,
        ...extra,
      }),
    );

  if (delay > 0) await new Promise((r) => setTimeout(r, delay));

  if (crash) {
    log("error", { status: 500, note: "bilinçli crash" });
    throw new Error(`Bilinçli crash (requestId=${requestId}) — Gün 3 'Kır' butonu`);
  }

  // Gövdeyi (body) oku: sadece POST/PUT'ta anlamlı
  let receivedBody: unknown = null;
  if (request.method === "POST" || request.method === "PUT") {
    const raw = await request.text();
    const contentType = request.headers.get("content-type") ?? "";
    if (raw && !contentType.includes("application/json")) {
      log("warn", { status: 415, note: `yanlış content-type: ${contentType || "(yok)"}` });
      return Response.json(
        {
          requestId,
          error: "Unsupported Media Type",
          aciklama: STATUS_TEXT[415].tr,
          receivedContentType: contentType || null,
          hint: "curl'de -H \"content-type: application/json\" ekle.",
        },
        { status: 415, headers: { "x-request-id": requestId, "cache-control": "no-store" } },
      );
    }
    try {
      receivedBody = raw ? JSON.parse(raw) : null;
    } catch {
      log("warn", { status: 400, note: "JSON parse edilemedi" });
      return Response.json(
        { requestId, error: "Body geçerli JSON değil", hint: "Virgül veya tırnak eksik olabilir." },
        { status: 400, headers: { "x-request-id": requestId, "cache-control": "no-store" } },
      );
    }
  }

  const info = STATUS_TEXT[status] ?? { text: "Unknown", tr: "Bu status code'u tanımadım." };
  const headers = {
    "x-request-id": requestId,
    "x-restolab-channel": channel,
    "cache-control": "no-store",
  };

  log(status >= 500 ? "error" : status >= 400 ? "warn" : "info", { status });

  // 204'te body OLAMAZ — HTTP kuralı
  if (status === 204) return new Response(null, { status, headers });

  return Response.json(
    {
      requestId,
      status,
      statusText: info.text,
      aciklama: info.tr,
      method: request.method,
      receivedAt: new Date().toISOString(),
      receivedHeaders: {
        "content-type": request.headers.get("content-type"),
        accept: request.headers.get("accept"),
        "x-client": request.headers.get("x-client"),
        "user-agent": request.headers.get("user-agent"),
      },
      receivedBody,
    },
    { status, headers },
  );
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
