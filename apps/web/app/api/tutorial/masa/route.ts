/**
 * Gün 9 Route Handler: aynı "Masa aç" işi, ama başka uygulamaların (terminal, mobil, curl) çağırabileceği bir API olarak.
 *   415 → body JSON değil (content-type yanlış)
 *   400 → JSON bozuk (okunamıyor)
 *   422 → JSON okunuyor ama kurala uymuyor (zod)
 *   409 → kurala uyuyor ama iş kuralıyla çakışıyor (masa 7 zaten açık)
 *   201 → masa açıldı (demo: hiçbir yere yazılmaz)
 */
import { BUSY_TABLE, validateMasa } from "@/lib/tutorial/masa";

export async function POST(request: Request): Promise<Response> {
  const requestId = crypto.randomUUID();
  const headers = { "x-request-id": requestId, "cache-control": "no-store" };
  const log = (level: "info" | "warn", status: number, extra: Record<string, unknown> = {}) =>
    console[level === "info" ? "log" : "warn"](JSON.stringify({ level, msg: "tutorial.masa.api", requestId, status, ...extra }));

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    log("warn", 415);
    return Response.json({ requestId, error: "Content-Type application/json olmalı" }, { status: 415, headers });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    log("warn", 400);
    return Response.json({ requestId, error: "Body geçerli JSON değil (okunamadı)" }, { status: 400, headers });
  }

  const result = validateMasa(body);
  if (!result.ok) {
    log("warn", 422, { errors: result.errors });
    return Response.json({ requestId, error: "Kurala uymayan alanlar var", fields: result.errors }, { status: 422, headers });
  }
  if (result.data.masaNo === BUSY_TABLE) {
    log("warn", 409);
    return Response.json({ requestId, error: `Masa ${BUSY_TABLE} zaten açık` }, { status: 409, headers });
  }

  log("info", 201, { masa: result.data });
  return Response.json({ requestId, masa: result.data, openedAt: new Date().toISOString() }, { status: 201, headers });
}
