import { ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Pokemon } from "lib/pokemon";
import { getAllPokemons } from "~/endpoints/pokemon-fetch";
import { PokemonElements } from ".";
import SearchBar from "./searchBar";

export let loader = async ({ params }: { params: any }) => {
  const res = await getAllPokemons();

  const pokemons = res.results.filter(({ name }) =>
    name.toLowerCase().includes(params.filtered.toLowerCase())
  );
  return pokemons;
};

export const action: ActionFunction = async ({ request }: { request: any }) => {
  const formData = await request.formData();
  const searchedPokemon = formData.get("filtered");
  return redirect(`/${searchedPokemon}`);
};

export default () => {
  const pokemonFiltered = useLoaderData<Pokemon[]>();
  return (
    <>
      <SearchBar />
      <PokemonElements pokemons={pokemonFiltered} />
    </>
  );
};
