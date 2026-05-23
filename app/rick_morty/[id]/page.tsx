import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  getAllCharacterIds,
  getCharacterById,
  TEN_DAYS,
} from "@/lib/rick-morty";
import EpisodeList from "./EpisodeList";

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 864000;

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
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-5">
        <Link
          href="/rick_morty"
          className="inline-flex rounded-lg border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-white/65 transition hover:border-emerald-300/40 hover:text-emerald-300"
        >
          Volver al registro
        </Link>

        <section className="mt-4 overflow-hidden rounded-2xl border border-emerald-300/20 bg-white/[0.055] shadow-2xl shadow-black/40 backdrop-blur">
          <div className="grid gap-0 md:grid-cols-[210px_1fr]">
            <div className="relative min-h-[210px] md:min-h-0">
              <Image
                src={character.image}
                alt={character.name}
                fill
                sizes="(min-width: 768px) 210px, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#030d18]/85 via-transparent to-transparent md:bg-linear-to-r" />
              <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur">
                #{character.id}
              </div>
            </div>

            <div className="p-4 md:p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300/75">
                Character Profile
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                {character.name}
              </h1>
              <div className="mt-2.5 flex flex-wrap gap-2">
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

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Info label="Id" value={`#${character.id}`} highlight />
                <Info label="Tipo" value={character.type || "N/A"} />
                <Info label="Estado" value={character.status} />
                <Info label="Especie" value={character.species} />
                <Info label="Genero" value={character.gender} />
                <Info label="Creado" value={new Date(character.created).toLocaleDateString("es-PE")} />
                <Info label="Origen" value={character.origin.name} wide />
                <Info label="Locacion actual" value={character.location.name} wide />
              </div>

              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                  Apariciones ({character.episode.length})
                </h2>
                <EpisodeList episodes={character.episode} />
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
      className={`rounded-lg border border-white/10 bg-white/[0.045] p-2.5 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="text-[9px] uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>
      <div
        className={`mt-1 break-words text-sm font-semibold ${
          highlight ? "text-emerald-300" : "text-white/85"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
