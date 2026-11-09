import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8 space-y-4">
      <h1 className="text-3xl font-bold">RestoLab — Admin Panel</h1>
      <p>Mini restoran yönetim sistemi — senior engineer olma laboratuvarı.</p>
      <p className="text-sm text-zinc-500">
        Ortam: {process.env.RELEASE_CHANNEL ?? "unknown"}
      </p>
      <a
        className="text-sm underline"
        href="https://github.com/kerim-agayev/restolab"
      >
        GitHub repo
      </a>
      <Link className="block text-lg font-semibold underline" href="/tutorial">
        📚 Tutorial — her günün interaktif dersi
      </Link>
    </main>
  );
}
