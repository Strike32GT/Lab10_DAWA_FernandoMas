import {
  RickMortyCharacter,
  RickMortyCharacterFilters,
  RickMortyCharacterResponse,
} from "@/types/rick-morty";

const API_URL = "https://rickandmortyapi.com/api/character";
export const TEN_DAYS = 60 * 60 * 24 * 10;

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
  const pageNumbers = Array.from(
    { length: firstPage.info.pages - 1 },
    (_, index) => index + 2
  );

  const remainingPages = await Promise.all(
    pageNumbers.map((page) =>
      getCharacters({ page }, { next: { revalidate: TEN_DAYS } })
    )
  );

  return [firstPage, ...remainingPages].flatMap((page) =>
    page.results.map((character) => ({ id: String(character.id) }))
  );
}
