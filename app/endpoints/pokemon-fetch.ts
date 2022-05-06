import axios from "axios";
import { Pokemon, PokemonDetails, PokemonStructure } from "lib/pokemon";

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

export async function getPokemonDetails(
  pokemonName: string
): Promise<PokemonDetails> {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );

  let pokemonDetails: PokemonDetails = {
    height: response.data.height,
    base_experience: response.data.base_experience,
    id: response.data.id,
    name: response.data.name,
    weight: response.data.weight,
    order: response.data.order,
    abilities: response.data.abilities
      .map((a: { ability: { name: string } }) => a.ability.name)
      .join(", "),
    types: response.data.types
      .map((t: { type: { name: string } }) => t.type.name)
      .join(", ")
  };
  return pokemonDetails;
}

export async function getPokemonImage(pokemonName: string): Promise<string> {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );

  return response.data.sprites.other["official-artwork"].front_default;
}
