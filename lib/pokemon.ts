export interface PokemonStructure {
  results: Pokemon[];
  previous: string;
  next: string;
  count: number;
}

export interface Pokemon {
  name: string;
  url: string;
  id: number;
}

export interface PokemonDetails {
  height: number;
  base_experience: number;
  id: number;
  name: string;
  weight: number;
  order: number;
  abilities: string[];
  types: string[];
}
