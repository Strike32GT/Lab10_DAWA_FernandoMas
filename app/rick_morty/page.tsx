import { Metadata } from "next";
import RickMortyExplorer from "./RickMortyExplorer";
import { getCharacters } from "@/lib/rick-morty";

export const metadata: Metadata = {
  title: "RickMania - Rick & Morty",
  description: "Registro interdimensional de personajes de Rick and Morty",
};

export default async function RickMortyPage() {
  const initialData = await getCharacters(
    {},
    { cache: "force-cache" }
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#030d18] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,rgba(0,60,40,0.45)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_85%_75%,rgba(10,30,80,0.5)_0%,transparent_55%),radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(30,0,60,0.3)_0%,transparent_50%),#030d18]" />
      <div className="fixed inset-0 bg-[radial-gradient(1px_1px_at_10%_15%,rgba(255,255,255,0.7)_0%,transparent_100%),radial-gradient(1px_1px_at_25%_40%,rgba(255,255,255,0.5)_0%,transparent_100%),radial-gradient(1.5px_1.5px_at_40%_10%,rgba(255,255,255,0.6)_0%,transparent_100%),radial-gradient(1px_1px_at_60%_30%,rgba(255,255,255,0.4)_0%,transparent_100%),radial-gradient(1px_1px_at_75%_60%,rgba(255,255,255,0.6)_0%,transparent_100%),radial-gradient(2px_2px_at_48%_50%,rgba(0,229,160,0.4)_0%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <header className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-emerald-300/80">
            Interdimensional Database
          </p>
          <h1 className="bg-linear-to-br from-white via-emerald-300 to-sky-300 bg-clip-text text-5xl font-black tracking-wide text-transparent drop-shadow-[0_0_24px_rgba(0,229,160,0.35)] md:text-7xl">
            RickMania
          </h1>
          <p className="text-sm tracking-wide text-white/55">
            Character Registry · Rick & Morty Universe
          </p>
          <div className="mt-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-1 text-xs text-white/55">
            <strong className="text-emerald-300">
              {initialData.info.count}
            </strong>{" "}
            entidades registradas en el multiverso
          </div>
        </header>

        <RickMortyExplorer
          initialCharacters={initialData.results}
          initialInfo={initialData.info}
        />

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.055] p-5 text-sm leading-7 text-white/60">
          <h2 className="text-lg font-bold text-white">Justificacion tecnica</h2>
          <p className="mt-2">
            La primera carga usa Server Components con `fetch` y `cache:
            force-cache`, por eso funciona como SSG para servir una lista inicial
            rapida y cacheada. La busqueda queda en CSR porque depende de los
            filtros que el usuario escribe en tiempo real. El detalle usa ISR con
            revalidacion cada 10 dias para mantener rutas estaticas por personaje
            y refrescar datos sin reconstruir todo el sitio manualmente.
          </p>
        </section>
      </div>
    </main>
  );
}
