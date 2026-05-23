import {
  RickMortyCharacter,
  RickMortyCharacterFilters,
  RickMortyCharacterResponse,
} from "@/types/rick-morty";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const API_URL = "https://rickandmortyapi.com/api/character";
export const TEN_DAYS = 60 * 60 * 24 * 10;
const CHARACTER_COUNT = 826;
const BATCH_SIZE = 100;
const BUILD_CACHE_DIR = path.join(process.cwd(), ".next", "cache");
const BUILD_CACHE_FILE = path.join(
  BUILD_CACHE_DIR,
  "rick-morty-characters.json"
);

let allCharactersPromise: Promise<Map<number, RickMortyCharacter>> | null = null;

function buildCharacterUrl(filters: RickMortyCharacterFilters = {}) {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.gender) params.set("gender", filters.gender);

  const query = params.toString();
  return query ? `${API_URL}?${query}` : API_URL;
}

export async function getCharacters(
  filters: RickMortyCharacterFilters = {},
  init?: RequestInit
): Promise<RickMortyCharacterResponse> {
  const url = buildCharacterUrl(filters);
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(
      `No se pudieron cargar los personajes (${res.status}) desde ${url}`
    );
  }

  return res.json();
}

export async function getCharacterById(
  id: string,
  init?: RequestInit
): Promise<RickMortyCharacter> {
  if (process.env.NODE_ENV === "production") {
    const characters = await getAllCharactersMap();
    const character = characters.get(Number(id));

    if (!character) {
      throw new Error("Personaje no encontrado");
    }

    return character;
  }

  const res = await fetch(`${API_URL}/${id}`, init);

  if (!res.ok) {
    throw new Error("Personaje no encontrado");
  }

  return res.json();
}

export async function getAllCharacterIds() {
  const characters = await getAllCharactersMap();

  return Array.from(characters.keys()).map((id) => ({ id: String(id) }));
}

async function getAllCharactersMap() {
  allCharactersPromise ??= loadAllCharactersMap();
  return allCharactersPromise;
}

async function loadAllCharactersMap() {
  const cached = await readCharactersCache();

  if (cached) {
    return cached;
  }

  const characterIds = Array.from(
    { length: CHARACTER_COUNT },
    (_, index) => index + 1
  );
  const chunks = Array.from(
    { length: Math.ceil(characterIds.length / BATCH_SIZE) },
    (_, index) => characterIds.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE)
  );
  const entries = new Map<number, RickMortyCharacter>();

  for (const chunk of chunks) {
    const data = await fetchCharacterBatch(chunk);
    data.forEach((character) => entries.set(character.id, character));
  }

  await writeCharactersCache(entries);

  return entries;
}

async function fetchCharacterBatch(ids: number[]) {
  const url = `${API_URL}/${ids.join(",")}`;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      next: { revalidate: TEN_DAYS },
    });

    if (res.ok) {
      return (await res.json()) as RickMortyCharacter[];
    }

    if (res.status === 429 && attempt < maxAttempts) {
      await wait(1000 * attempt);
      continue;
    }

    throw new Error(
      `No se pudieron cargar los personajes (${res.status}) desde ${url}`
    );
  }

  return [];
}

async function readCharactersCache() {
  try {
    const cache = await readFile(BUILD_CACHE_FILE, "utf-8");
    const characters = JSON.parse(cache) as RickMortyCharacter[];

    return new Map(characters.map((character) => [character.id, character]));
  } catch {
    return null;
  }
}

async function writeCharactersCache(characters: Map<number, RickMortyCharacter>) {
  await mkdir(BUILD_CACHE_DIR, { recursive: true });
  await writeFile(
    BUILD_CACHE_FILE,
    JSON.stringify(Array.from(characters.values())),
    "utf-8"
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
