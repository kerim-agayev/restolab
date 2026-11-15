/** Gün 11: menünün "resmî" fiyat listesi (sunucunun doğru kabul ettiği tek kaynak). Fiyatlar qəpik (Gün 10). */
export const CATALOG = [
  { id: "cay", name: "Çay", price_minor: 150 },
  { id: "dolma", name: "Dolma", price_minor: 850 },
  { id: "plov", name: "Plov", price_minor: 1200 },
  { id: "ayran", name: "Ayran", price_minor: 200 },
] as const;

export type CatalogId = (typeof CATALOG)[number]["id"];
export const priceOf = (id: string) => CATALOG.find((c) => c.id === id)?.price_minor;
