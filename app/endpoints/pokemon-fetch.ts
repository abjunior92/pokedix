import axios from "axios";
import { Pokemon, PokemonStructure } from "lib/pokemon";

export async function getPokemons(url: string) {
  const response = await axios.get(`${url}`);
  return response.data;
}

export async function getAllPokemons(): Promise<PokemonStructure> {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`
  );

  let pokemons: Pokemon[] = [];

  response.data.results.map((pokemon: Pokemon, index: number) => {
    pokemons.push({
      ...pokemon,
      id: index + 1
    });
  });
  let pokemonsStructure: PokemonStructure = {
    next: response.data.next,
    previous: response.data.previous,
    count: response.data.count,
    results: pokemons
  };

  return pokemonsStructure;
}

export async function getPokemonDetails(pokemonName: string) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  return response.data;
}

export async function getPokemonImage(pokemonName: string): Promise<string> {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );

  return response.data.sprites.other["official-artwork"].front_default;
}
