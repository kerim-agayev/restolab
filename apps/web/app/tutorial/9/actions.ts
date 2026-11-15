"use server";

/**
 * Gün 9 Server Action: form verisi tarayıcıdan bu fonksiyona POST ile gelir (sunucuda çalışır).
 * Zararsız: hiçbir yere yazmaz, sadece doğrular ve sonucu geri döner.
 */
import { BUSY_TABLE, validateMasa, type FieldErrors, type Masa } from "@/lib/tutorial/masa";

export type MasaState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors; requestId: string }
  | { status: "conflict"; message: string; requestId: string }
  | { status: "ok"; data: Masa; requestId: string; openedAt: string };

export async function masaAc(_prev: MasaState, formData: FormData): Promise<MasaState> {
  const requestId = crypto.randomUUID();
  await new Promise((r) => setTimeout(r, 600)); // "pending" durumunu görebilmek için

  const result = validateMasa({
    masaNo: formData.get("masaNo"),
    qonaq: formData.get("qonaq"),
    ofisiant: formData.get("ofisiant"),
  });

  if (!result.ok) {
    console.warn(JSON.stringify({ level: "warn", msg: "tutorial.masa.action.invalid", requestId, errors: result.errors }));
    return { status: "invalid", errors: result.errors, requestId };
  }
  if (result.data.masaNo === BUSY_TABLE) {
    console.warn(JSON.stringify({ level: "warn", msg: "tutorial.masa.action.conflict", requestId, masaNo: BUSY_TABLE }));
    return { status: "conflict", message: `Masa ${BUSY_TABLE} zaten açık (başka garson açtı).`, requestId };
  }
  console.log(JSON.stringify({ level: "info", msg: "tutorial.masa.action.ok", requestId, ...result.data }));
  return { status: "ok", data: result.data, requestId, openedAt: new Date().toISOString() };
}
