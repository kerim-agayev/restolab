/**
 * Gün 11: "Sipariş ver". Tarayıcı sepeti (fiyatlarıyla birlikte) gönderir.
 * Sunucu tarayıcının yazdığı fiyata GÜVENMEZ: fiyatı kendi kataloğundan okur, toplamı kendisi hesaplar.
 * Fiyat değiştirilmişse (tampered) bunu loglar. Zararsız: hiçbir yere yazmaz.
 */
import { z } from "zod";
import { CATALOG, priceOf } from "@/lib/tutorial/catalog";

const CartSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        qty: z.number().int().min(1).max(50),
        price_minor: z.number().int(), // tarayıcının "iddiası" — sadece karşılaştırmak için okunur
      }),
    )
    .min(1, "Sepet boş")
    .max(20),
});

export async function POST(request: Request): Promise<Response> {
  const requestId = crypto.randomUUID();
  const headers = { "x-request-id": requestId, "cache-control": "no-store" };

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ requestId, error: "Body geçerli JSON değil" }, { status: 400, headers });
  }
  const parsed = CartSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ requestId, error: parsed.error.issues[0]?.message ?? "Geçersiz sepet" }, { status: 422, headers });
  }

  const lines = [];
  const tampered: string[] = [];
  for (const item of parsed.data.items) {
    const real = priceOf(item.id);
    if (real === undefined) {
      return Response.json({ requestId, error: `Menüde olmayan ürün: ${item.id}` }, { status: 422, headers });
    }
    if (real !== item.price_minor) tampered.push(item.id);
    const name = CATALOG.find((c) => c.id === item.id)?.name ?? item.id;
    lines.push({ id: item.id, name, qty: item.qty, unit_minor: real, line_minor: real * item.qty, client_said_minor: item.price_minor });
  }
  const clientTotal = parsed.data.items.reduce((s, i) => s + i.price_minor * i.qty, 0);
  const serverTotal = lines.reduce((s, l) => s + l.line_minor, 0);

  console[tampered.length ? "warn" : "log"](
    JSON.stringify({ level: tampered.length ? "warn" : "info", msg: "tutorial.cart.checkout", requestId, clientTotal, serverTotal, tampered }),
  );

  return Response.json({ requestId, lines, clientTotal_minor: clientTotal, serverTotal_minor: serverTotal, tampered }, { status: 201, headers });
}
