import {
  LoaderFunction,
  MetaFunction,
  ActionFunction,
  redirect
} from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { Pokemon, PokemonStructure } from "lib/pokemon";
import { useEffect, useMemo, useState } from "react";
import { getPokemonImage, getAllPokemons } from "../endpoints/pokemon-fetch";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import SearchBar from "./searchBar";

export const loader: LoaderFunction = async ({ request }: { request: any }) => {
  const result = await getAllPokemons();
  return result;
};

export const action: ActionFunction = async ({ request }: { request: any }) => {
  const formData = await request.formData();
  const searchedPokemon = formData.get("filtered");
  return redirect(`/${searchedPokemon}`);
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Pokémon App!",
  viewport: "width=device-width,initial-scale=1"
});

// If you want to download images from api, you can use this function:
function usePokemonImage(name: string) {
  const [image, setImage] = useState<string>("");

  useMemo(() => {
    getPokemonImage(name).then(setImage);
  }, [name]);

  return image;
}

export const PokemonElements = ({ pokemons }: { pokemons: Pokemon[] }) => {
  const location = useLocation();
  // const image = usePokemonImage(poke.name);

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {pokemons?.map(poke => (
        <li key={poke.url} className="relative">
          <Link
            to={{ pathname: `/pokemon/${poke.name}`, search: location.search }}
          >
            <div className="div-img-list">
              <img
                src={`/pokemonSVG/${poke.id}.svg`}
                // src={`${image}`}
                alt={""}
              />
            </div>
            <p className="standard-p">{poke.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default function Index() {
  const pokemonData = useLoaderData<PokemonStructure>();

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  const handlePagination = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const button: HTMLButtonElement = e.currentTarget;
    const op = button.getAttribute("data-nav-operation");

    if (op === "next") {
      setOffset(offset + 20);
      setLimit(limit + 20);
    } else {
      setOffset(offset - 20);
      setLimit(limit - 20);
    }
    window.scrollTo(0, 0);
  };

  let memoizedPokemonList = useMemo(
    () => pokemonData.results.slice(offset, limit),
    [pokemonData, offset, limit]
  );

  return (
    <div className="grid grid-flow-row gap-y-4">
      <SearchBar />

      <PokemonElements pokemons={memoizedPokemonList} />

      <div className="flex flex-row justify-between space-x-8 items-center py-8 mt-4 border-t-2 border-indigo-100 dark:border-btn-dark">
        <button
          className="btn-pagination"
          data-nav-operation="previous"
          onClick={handlePagination}
          disabled={offset === 0}
        >
          <ChevronLeftIcon className="w-6 h-6 mr-2" aria-hidden="true" />
          Previous
        </button>
        <button
          className="btn-pagination"
          data-nav-operation="next"
          onClick={handlePagination}
          disabled={limit >= pokemonData.results.length}
        >
          Next
          <ChevronRightIcon className="w-6 h-6 ml-2" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
