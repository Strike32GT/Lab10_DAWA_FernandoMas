export interface RickMortyInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RickMortyLocationRef {
  name: string;
  url: string;
}

export interface RickMortyCharacter {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: RickMortyLocationRef;
  location: RickMortyLocationRef;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface RickMortyCharacterResponse {
  info: RickMortyInfo;
  results: RickMortyCharacter[];
}

export interface RickMortyCharacterFilters {
  page?: number;
  name?: string;
  status?: string;
  type?: string;
  gender?: string;
}
