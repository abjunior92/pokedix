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

export const PokemonElement = ({ poke }: { poke: Pokemon }) => {
  const location = useLocation();
  // const image = usePokemonImage(poke.name);
  return (
    <li key={poke.url} className="relative">
      <Link to={{ pathname: `/pokemon/${poke.name}`, search: location.search }}>
        <div className="hover:scale-110 transition duration-500 group block w-full aspect-w-10 aspect-h-8 rounded-lg overflow-hidden">
          <img
            src={`/pokemonSVG/${poke.id}.svg`}
            // src={`${image}`}
            alt={""}
            className="pointer-events-none group-hover:opacity-75 object-contain bg-transparent"
          />
        </div>
        <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none text-center">
          {poke.name}
        </p>
      </Link>
    </li>
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
    <div className="flex flex-col gap-y-4">
      <SearchBar />
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {memoizedPokemonList?.map((poke, index) => (
          <PokemonElement poke={poke} key={index} />
        ))}
      </ul>

      <div className="flex flex-row justify-between gap-x-4 items-center py-8 border-t-2">
        <button
          className="flex items-center bg-white text-indigo-900 rounded-lg hover:scale-105 transition duration-200 hover:shadow-sm border-2 border-indigo-900 hover:bg-slate-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-900 h-14 sm:w-1/2 justify-center font-semibold sm:text-md disabled:bg-gray-200 disabled:border-none disabled:text-gray-500"
          data-nav-operation="previous"
          onClick={handlePagination}
          disabled={offset === 0}
        >
          <ChevronLeftIcon className="w-6 h-6 mr-2" aria-hidden="true" />
          Previous
        </button>
        <div>
          <span></span>
        </div>
        <button
          className="flex items-center bg-white text-indigo-900 rounded-lg hover:scale-105 transition duration-200 hover:shadow-sm border-2 border-indigo-900 hover:bg-slate-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-900 h-14 sm:w-1/2 justify-center font-semibold sm:text-md disabled:bg-gray-200 disabled:border-none disabled:text-gray-500"
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
