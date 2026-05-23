import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-300">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold">Pagina no encontrada</h1>
        <p className="mt-4 text-gray-300">
          La ruta que intentaste abrir no existe o fue movida.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-white/20 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            Ir al inicio
          </Link>
          <Link
            href="/pokemon"
            className="rounded-lg bg-purple-700 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-800"
          >
            Ver Pokemon
          </Link>
        </div>
      </div>
    </main>
  );
}
