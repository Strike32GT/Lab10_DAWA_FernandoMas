import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  getAllCharacterIds,
  getCharacterById,
  TEN_DAYS,
} from "@/lib/rick-morty";

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = TEN_DAYS;

export async function generateStaticParams() {
  return getAllCharacterIds();
}

export async function generateMetadata({
  params,
}: CharacterDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacterById(id, {
    next: { revalidate: TEN_DAYS },
  });

  return {
    title: `${character.name} - RickMania`,
    description: `Detalle de ${character.name} en RickMania`,
  };
}

function statusClass(status: string) {
  if (status === "Alive") return "border-emerald-300/40 bg-emerald-300/15 text-emerald-300";
  if (status === "Dead") return "border-red-300/40 bg-red-300/15 text-red-300";
  return "border-violet-300/40 bg-violet-300/15 text-violet-300";
}

function getEpisodeNumber(url: string) {
  return url.split("/").pop();
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { id } = await params;
  const character = await getCharacterById(id, {
    next: { revalidate: TEN_DAYS },
  });

  return (
    <main className="min-h-screen bg-[#030d18] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,rgba(0,60,40,0.45)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_85%_75%,rgba(10,30,80,0.5)_0%,transparent_55%),#030d18]" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/rick_morty"
          className="inline-flex rounded-lg border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-white/65 transition hover:border-emerald-300/40 hover:text-emerald-300"
        >
          Volver al registro
        </Link>

        <section className="mt-8 overflow-hidden rounded-3xl border border-emerald-300/20 bg-white/[0.055] shadow-2xl shadow-black/40 backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
            <div className="relative min-h-[360px]">
              <Image
                src={character.image}
                alt={character.name}
                fill
                sizes="(min-width: 1024px) 360px, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#030d18]/85 via-transparent to-transparent lg:bg-linear-to-r" />
              <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold text-emerald-300 backdrop-blur">
                #{character.id}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300/75">
                Character Profile
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                {character.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(
                    character.status
                  )}`}
                >
                  {character.status}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/65">
                  {character.species}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/65">
                  {character.gender}
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Info label="Id" value={`#${character.id}`} highlight />
                <Info label="Tipo" value={character.type || "N/A"} />
                <Info label="Estado" value={character.status} />
                <Info label="Especie" value={character.species} />
                <Info label="Genero" value={character.gender} />
                <Info label="Creado" value={new Date(character.created).toLocaleDateString("es-PE")} />
                <Info label="Origen" value={character.origin.name} wide />
                <Info label="Url origen" value={character.origin.url || "N/A"} wide />
                <Info label="Locacion actual" value={character.location.name} wide />
                <Info label="Url locacion" value={character.location.url || "N/A"} wide />
                <Info label="Endpoint del personaje" value={character.url} wide />
                <Info
                  label="Imagen"
                  value={character.image}
                  wide
                />
              </div>

              <div className="mt-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                  Apariciones ({character.episode.length})
                </h2>
                <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
                  {character.episode.map((episodeUrl) => (
                    <span
                      key={episodeUrl}
                      className="rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-300"
                    >
                      Ep. {getEpisodeNumber(episodeUrl)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
  highlight = false,
  wide = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.045] p-4 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>
      <div
        className={`mt-2 break-words text-sm font-semibold ${
          highlight ? "text-emerald-300" : "text-white/85"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
