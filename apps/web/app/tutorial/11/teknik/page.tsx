import type { Metadata } from "next";
import Link from "next/link";
import { TaskList, type Task } from "@/components/tutorial/TaskList";
import { Note, Section } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = { title: "Gün 11 (Teknik) — Storage, sepet API’si, Lighthouse | RestoLab" };

const U = "https://restolab-kappa.vercel.app/api/tutorial/cart";

const tasks: Task[] = [
  {
    title: "Sepeti DevTools’ta gör",
    cmd: "/tutorial/11’de sepete ürün ekle → F12 → Application → Local storage → site adresi",
    expect: "Key: restolab.cart.v1 · Value: [{\"id\":\"cay\",\"name\":\"Çay\",\"qty\":1,\"price_minor\":150}, …]",
    why: "Bölüm 1’deki “bloknot” bu. Value’ya çift tıklayıp price_minor’ı elle değiştirebilirsin; sayfadaki 😈 butonu aynısını yapıyor.",
  },
  {
    title: "Elle değiştir, sonra sipariş ver",
    cmd: "Application’da price_minor değerini 1 yap → Enter → sayfada “Sipariş ver”",
    expect: "Sunucunun hesabı değişmez, sarı uyarı: ‘değiştirilmiş fiyatı fark etti’",
    why: "Her türlü client manipülasyonu (DevTools, curl, Postman) için aynı sonuç: kural sunucuda.",
  },
  {
    title: "Aynı saldırıyı curl ile dene (merge’den sonra canlıda)",
    cmd: `curl.exe -s -X POST ${U} -H "content-type: application/json" -d '{\\"items\\":[{\\"id\\":\\"plov\\",\\"qty\\":2,\\"price_minor\\":1}]}'`,
    expect: "\"clientTotal_minor\":2, \"serverTotal_minor\":2400, \"tampered\":[\"plov\"]",
    why: "Sunucu 2 qəpik değil 24 AZN hesapladı. Vercel Logs’ta tutorial.cart.checkout satırı level: warn.",
  },
  {
    title: "Menüde olmayan ürün",
    cmd: `curl.exe -s -X POST ${U} -H "content-type: application/json" -d '{\\"items\\":[{\\"id\\":\\"kabab\\",\\"qty\\":1,\\"price_minor\\":100}]}'`,
    expect: "{\"error\":\"Menüde olmayan ürün: kabab\"} (422)",
    why: "Sunucu sadece kendi kataloğunu tanır.",
  },
  {
    title: "Optimistic UI’ı Network’te izle",
    cmd: "F12 → Network → Bölüm 3’te “Sepete çay ekle” (iyimser mod açık, hata açık)",
    expect: "Sayaç anında artar → 1.2 sn sonra 503 satırı → sayaç geri düşer",
    why: "Ekrandaki değişiklik ile ağdaki cevabın zamanlaması arasındaki farkı gözle gör.",
  },
  {
    title: "Lighthouse ile Core Web Vitals",
    cmd: "F12 → Lighthouse → Mode: Navigation, Device: Mobile → Analyze page load (canlı adreste /tutorial/11)",
    expect: "Performance skoru + LCP, CLS, TBT değerleri ve ‘öneriler’ listesi",
    why: "INP gerçek kullanıcı tıklamasıyla ölçülür; Lighthouse yerine TBT’yi (ana iş parçacığının ne kadar meşgul olduğu) gösterir.",
  },
];

export default function Day11Technical() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-4 pb-24 sm:p-8">
      <header className="space-y-2">
        <Link href="/tutorial/11" className="text-sm underline">
          ← Sade anlatım (önce bunu yap)
        </Link>
        <p className="text-sm text-zinc-500">Gün 11 · Teknik</p>
        <h1 className="text-3xl font-bold">Storage, sepet API’si ve Lighthouse</h1>
      </header>
      <Section n={1} title="Görevler">
        <TaskList items={tasks} />
      </Section>
      <Section n={2} title="Notlar">
        <Note icon="🤖">
          <p>
            <i>“Sepeti Zustand store’a aldım, persist middleware ile localStorage’a yazıyor.”</i> → Bölüm 1’in kütüphaneli hâli. <i>“useQuery ile
            çekiyorum, staleTime 30 sn.”</i> → Server state 30 sn taze sayılır, sonra yenilenir (Gün 7’deki TTL fikri). <i>“Mutation sonrası
            invalidateQueries.”</i> → Değişiklikten sonra kopyayı bayat say, yeniden çek. <i>“Fiyatı server-side hesaplıyoruz.”</i> → Doğru.
          </p>
        </Note>
        <Note icon="🔐">
          <p>
            <b>Pentest köprüsü:</b> “parametre manipülasyonu / client-side trust” en klasik bulgulardan biri (fiyat, indirim, rol, kullanıcı id’si).
            Kursta Burp Suite ile isteği yakalayıp değiştirmek bu fikrin aracı. Sadece kendi uygulamanda dene.
          </p>
        </Note>
        <Note icon="🏢">
          <p>
            <b>Clopos köprüsü:</b> frontend reposunda <code>createSlice</code>/<code>configureStore</code> (Redux Toolkit), <code>create(</code>{" "}
            (Zustand), <code>useQuery</code> (TanStack Query) ara. Sepet/sipariş toplamının hangi tarafta hesaplandığına bak: backend’de olmalı.
          </p>
        </Note>
      </Section>
    </main>
  );
}
