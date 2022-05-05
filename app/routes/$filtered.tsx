import { ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Pokemon } from "lib/pokemon";
import { getAllPokemons } from "~/endpoints/pokemon-fetch";
import { PokemonElement } from ".";
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
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {pokemonFiltered?.map((poke, index) => (
          <PokemonElement poke={poke} key={index} />
        ))}
      </ul>
    </>
  );
};
