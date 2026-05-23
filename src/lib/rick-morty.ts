import {
  RickMortyCharacter,
  RickMortyCharacterFilters,
  RickMortyCharacterResponse,
} from "@/types/rick-morty";

const API_URL = "https://rickandmortyapi.com/api/character";
export const TEN_DAYS = 60 * 60 * 24 * 10;
const CHARACTER_COUNT = 826;
const BATCH_SIZE = 100;

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
  const firstPage = await getCharacters(
    {},
    { next: { revalidate: TEN_DAYS } }
  );

  return Array.from({ length: firstPage.info.count }, (_, index) => ({
    id: String(index + 1),
  }));
}

async function getAllCharactersMap() {
  allCharactersPromise ??= loadAllCharactersMap();
  return allCharactersPromise;
}

async function loadAllCharactersMap() {
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
    const res = await fetch(`${API_URL}/${chunk.join(",")}`, {
      next: { revalidate: TEN_DAYS },
    });

    if (!res.ok) {
      throw new Error(
        `No se pudieron cargar los personajes (${res.status}) desde ${API_URL}/${chunk.join(",")}`
      );
    }

    const data = (await res.json()) as RickMortyCharacter[];
    data.forEach((character) => entries.set(character.id, character));
  }

  return entries;
}
