"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  RickMortyCharacter,
  RickMortyCharacterResponse,
  RickMortyInfo,
} from "@/types/rick-morty";

type SortMode = "id-asc" | "id-desc" | "name-asc" | "name-desc" | "popularity";

interface RickMortyExplorerProps {
  initialCharacters: RickMortyCharacter[];
  initialInfo: RickMortyInfo;
}

const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Alive", value: "alive" },
  { label: "Dead", value: "dead" },
  { label: "Unknown", value: "unknown" },
];

const genderOptions = ["", "male", "female", "genderless", "unknown"];
const typeOptions = ["", "clone", "robot", "parasite", "toxic", "decoy", "alien"];

function statusClass(status: RickMortyCharacter["status"]) {
  if (status === "Alive") return "bg-emerald-400 shadow-[0_0_10px_#34d399]";
  if (status === "Dead") return "bg-red-400 shadow-[0_0_10px_#f87171]";
  return "bg-violet-300 shadow-[0_0_10px_#c4b5fd]";
}

function sortCharacters(characters: RickMortyCharacter[], sort: SortMode) {
  const sorted = [...characters];

  switch (sort) {
    case "id-desc":
      return sorted.sort((a, b) => b.id - a.id);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "popularity":
      return sorted.sort((a, b) => b.episode.length - a.episode.length);
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}

export default function RickMortyExplorer({
  initialCharacters,
  initialInfo,
}: RickMortyExplorerProps) {
  const [characters, setCharacters] = useState(initialCharacters);
  const [info, setInfo] = useState(initialInfo);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [sort, setSort] = useState<SortMode>("id-asc");
  const [isLoading, setIsLoading] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      const params = new URLSearchParams({ page: String(page) });

      if (name.trim()) params.set("name", name.trim());
      if (status) params.set("status", status);
      if (type.trim()) params.set("type", type.trim());
      if (gender) params.set("gender", gender);

      setIsLoading(true);
      setEmptyMessage("");

      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character?${params.toString()}`
        );

        if (!response.ok) {
          setCharacters([]);
          setInfo({ count: 0, pages: 1, next: null, prev: null });
          setEmptyMessage("No se encontraron personajes en este universo");
          return;
        }

        const data: RickMortyCharacterResponse = await response.json();
        setCharacters(data.results);
        setInfo(data.info);
      } catch {
        setCharacters([]);
        setInfo({ count: 0, pages: 1, next: null, prev: null });
        setEmptyMessage("No se pudo contactar la API interdimensional");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [gender, name, page, status, type]);

  const sortedCharacters = useMemo(
    () => sortCharacters(characters, sort),
    [characters, sort]
  );

  const maxEpisodes = Math.max(
    1,
    ...sortedCharacters.map((character) => character.episode.length)
  );

  function resetToFirstPage(callback: () => void) {
    setPage(1);
    callback();
  }

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/30 backdrop-blur md:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
              &#8981;
            </span>
            <input
              value={name}
              onChange={(event) =>
                resetToFirstPage(() => setName(event.target.value))
              }
              className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.06] pl-10 pr-3 text-sm text-white outline-none transition focus:border-emerald-300/50 focus:bg-white/[0.09]"
              placeholder="Buscar por nombre..."
            />
          </div>

          <div className="hidden h-8 w-px bg-white/10 xl:block" />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              Estado
            </span>
            {statusOptions.map((option) => (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => resetToFirstPage(() => setStatus(option.value))}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  status === option.value
                    ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-300"
                    : "border-white/10 text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="hidden h-8 w-px bg-white/10 xl:block" />

          <label className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              Tipo
            </span>
            <select
              value={type}
              onChange={(event) =>
                resetToFirstPage(() => setType(event.target.value))
              }
              className="h-9 rounded-lg border border-white/10 bg-[#0d1f2d] px-3 text-xs text-white/70 outline-none focus:border-emerald-300/50"
            >
              {typeOptions.map((option) => (
                <option key={option || "all-types"} value={option}>
                  {option ? option : "Todos"}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              Genero
            </span>
            <select
              value={gender}
              onChange={(event) =>
                resetToFirstPage(() => setGender(event.target.value))
              }
              className="h-9 rounded-lg border border-white/10 bg-[#0d1f2d] px-3 text-xs text-white/70 outline-none focus:border-emerald-300/50"
            >
              {genderOptions.map((option) => (
                <option key={option || "all-genders"} value={option}>
                  {option ? option : "Todos"}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
            Ordenar
          </span>
          {[
            ["name-asc", "A-Z"],
            ["name-desc", "Z-A"],
            ["popularity", "Popular"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value as SortMode)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                sort === value
                  ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-300"
                  : "border-white/10 text-white/55 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055]"
              >
                <div className="aspect-square animate-pulse bg-white/[0.06]" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.08]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.08]" />
                </div>
              </div>
            ))
          : null}

        {!isLoading && !sortedCharacters.length ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-16 text-center text-white/45">
            <p className="text-4xl">404</p>
            <p className="mt-3 text-sm">
              {emptyMessage || "No se encontraron personajes"}
            </p>
          </div>
        ) : null}

        {!isLoading &&
          sortedCharacters.map((character) => {
            const episodePercent = Math.round(
              (character.episode.length / maxEpisodes) * 100
            );

            return (
              <Link
                key={character.id}
                href={`/rick_morty/${character.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[0.09]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#030d18]/80 to-transparent" />
                  <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-[#030d18]/60 px-3 py-1 backdrop-blur">
                    <span
                      className={`h-2 w-2 rounded-full ${statusClass(
                        character.status
                      )}`}
                    />
                    <span className="text-[10px] font-semibold text-white/75">
                      {character.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="truncate text-base font-semibold text-white">
                    {character.name}
                  </h2>
                  <p className="mt-1 text-xs text-white/55">
                    {character.species} · {character.gender}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-300 to-sky-300"
                        style={{ width: `${episodePercent}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-[10px] text-white/35">
                      {character.episode.length} ep
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={page <= 1 || isLoading}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="rounded-lg border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white/60 transition hover:border-emerald-300/40 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Anterior
        </button>
        <span className="text-sm text-white/50">
          Pagina <strong className="text-emerald-300">{page}</strong> de{" "}
          <strong className="text-emerald-300">{info.pages}</strong> ·{" "}
          <strong className="text-emerald-300">{info.count}</strong> resultados
        </span>
        <button
          type="button"
          disabled={page >= info.pages || isLoading}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-lg border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white/60 transition hover:border-emerald-300/40 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
