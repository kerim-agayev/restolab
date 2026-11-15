/**
 * Gün 9: "Masa aç" formunun TEK doğrulama kuralı (zod şeması).
 * Hem Server Action hem Route Handler aynı şemayı kullanır → kural tek yerde, iki kapı.
 */
import { z } from "zod";

export const MasaSchema = z.object({
  masaNo: z.coerce.number({ error: "Masa no sayı olmalı" }).int("Masa no tam sayı olmalı").min(1, "Masa no en az 1").max(50, "Bu restoranda 50 masa var"),
  qonaq: z.coerce.number({ error: "Qonaq sayı olmalı" }).int("Qonaq tam sayı olmalı").min(1, "En az 1 qonaq").max(12, "Bir masaya en fazla 12 qonaq"),
  ofisiant: z.string({ error: "Ofisiant adı gerekli" }).trim().min(2, "Ofisiant adı en az 2 harf").max(40, "Ofisiant adı çok uzun"),
});

export type Masa = z.infer<typeof MasaSchema>;
export type FieldErrors = Partial<Record<keyof Masa, string>>;

/** Demo iş kuralı: 7 numaralı masa zaten açık (çakışma → 409). */
export const BUSY_TABLE = 7;

export function validateMasa(input: unknown): { ok: true; data: Masa } | { ok: false; errors: FieldErrors } {
  const r = MasaSchema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const errors: FieldErrors = {};
  for (const issue of r.error.issues) {
    const key = issue.path[0] as keyof Masa | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
