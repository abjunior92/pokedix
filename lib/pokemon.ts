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
  evolution_chain: PokemonEvolutionChain;
}

export type PokemonValueUnit = {
  value: number;
  unit: string;
};

export function isPokemonValueUnit(obj: any): obj is PokemonValueUnit {
  return obj && obj?.value && obj?.unit;
}

export interface PokemonEvolutionChain {
  evolves_to: PokemonEvolutionChain[];
  species: Pokemon;
}

export function isPokemonEvolutionChain(
  obj: any
): obj is PokemonEvolutionChain {
  return obj && obj?.evolves_to && obj?.species;
}
