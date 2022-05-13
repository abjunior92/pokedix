import { EmojiSadIcon } from "@heroicons/react/solid";
import { ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllPokemons } from "~/endpoints/pokemon-fetch";
import { PokemonElements } from ".";
import SearchBar from "./searchBar";

export let loader = async ({ params }: { params: any }) => {
  const res = await getAllPokemons();

  const pokemons = res.results.filter(({ name }) =>
    name.toLowerCase().includes(params.filtered.toLowerCase())
  );
  return { pokemonFiltered: pokemons, pokemons: res };
};

export const action: ActionFunction = async ({ request }: { request: any }) => {
  const formData = await request.formData();
  const searchedPokemon = formData.get("filtered");
  return redirect(`/${searchedPokemon}`);
};

export default () => {
  const { pokemonFiltered, pokemons } = useLoaderData();

  return (
    <div className="grid grid-flow-row gap-y-8">
      <SearchBar allPokemons={pokemons} />
      {pokemonFiltered?.length > 0 ? (
        <PokemonElements pokemons={pokemonFiltered} />
      ) : (
        <div className="w-full flex flex-col items-center justify-center space-y-8">
          <EmojiSadIcon className="w-24 h-24 dark:text-s-dark" />
          <p className="">No results found</p>
        </div>
      )}
    </div>
  );
};
