import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useSearchParams
} from "@remix-run/react";
import { Pokemon, PokemonStructure } from "lib/pokemon";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { getPokemonImage, getAllPokemons } from "../endpoints/pokemon-fetch";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import SearchBar from "./searchBar";
import { motion } from "framer-motion";
import isEqual from "react-fast-compare";

const anim_container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3
    }
  }
};

const anim_item = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export const loader: LoaderFunction = async ({ request }: { request: any }) => {
  const result = await getAllPokemons();
  return result;
};

export const action: ActionFunction = async ({ request }: { request: any }) => {
  const formData = await request.formData();
  const searchedPokemon = formData.get("filtered");
  return redirect(`/${searchedPokemon}`);
};

// If you want to download images from api, you can use this function:
function usePokemonImage(name: string) {
  const [image, setImage] = useState<string>("");

  useMemo(() => {
    getPokemonImage(name).then(setImage);
  }, [name]);

  return image;
}

export const PokemonElements = memo(({ pokemons }: { pokemons: Pokemon[] }) => {
  // const image = usePokemonImage(poke.name);

  return (
    <motion.ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      variants={anim_container}
      initial="hidden"
      animate="visible"
    >
      {pokemons?.map(poke => (
        <motion.li key={poke.url} className="relative" variants={anim_item}>
          <Link
            to={{
              pathname: `/pokemon/${poke.name}`
            }}
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
        </motion.li>
      ))}
    </motion.ul>
  );
}, isEqual);

export default function Index() {
  const pokemonData = useLoaderData<PokemonStructure>();

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    elements: "20"
  });
  const pageMultiplier: number = +searchParams.getAll("page")[0];

  const [elementsOnPage, setElementsOnPage] = useState<number>(
    +searchParams.getAll("elements")[0]
  );

  const [limit, setLimit] = useState(elementsOnPage * pageMultiplier);
  const [offset, setOffset] = useState(limit - elementsOnPage);

  const handlePagination = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const button: HTMLButtonElement = e.currentTarget;
    const op = button.getAttribute("data-nav-operation");

    if (op === "next") {
      setSearchParams({ page: `${(limit + elementsOnPage) / elementsOnPage}` });
      setOffset(offset + elementsOnPage);
      setLimit(limit + elementsOnPage);
    } else {
      setSearchParams({ page: `${(limit - elementsOnPage) / elementsOnPage}` });
      setOffset(offset - elementsOnPage);
      setLimit(limit - elementsOnPage);
    }
    window.scrollTo(0, 0);
  };

  const getPokemonElements = () => {
    return pokemonData.results.slice(
      elementsOnPage * pageMultiplier - elementsOnPage,
      elementsOnPage * pageMultiplier
    );
  };

  useEffect(() => {
    setSearchParams({ elements: `${elementsOnPage}` });
    setLimit(elementsOnPage * pageMultiplier);
    setOffset(limit - elementsOnPage);
  }, [elementsOnPage]);

  let memoizedPokemonList = useMemo(
    () => getPokemonElements(),
    [pokemonData, offset, limit, elementsOnPage]
  );

  return (
    <>
      <div className="grid grid-flow-row gap-y-4">
        <SearchBar allPokemons={pokemonData} />

        <div className="flex flex-row space-x-4 justify-start items-center py-6">
          <label>Elements:</label>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`button-side-l-group ${
                elementsOnPage === 20 ? "button-group-active" : ""
              }`}
              onClick={() => setElementsOnPage(20)}
            >
              20
            </button>
            <button
              type="button"
              className={`button-center-group ${
                elementsOnPage === 40 ? "button-group-active" : ""
              }`}
              onClick={() => setElementsOnPage(40)}
            >
              40
            </button>
            <button
              type="button"
              className={`button-side-r-group ${
                elementsOnPage === 60 ? "button-group-active" : ""
              }`}
              onClick={() => setElementsOnPage(60)}
            >
              60
            </button>
          </div>
        </div>

        <PokemonElements pokemons={memoizedPokemonList} />

        <div className="flex flex-row justify-between space-x-8 items-center py-8 mt-4 border-t-2 border-indigo-100 dark:border-btn-dark">
          <button
            className="btn-pagination"
            data-nav-operation="previous"
            onClick={handlePagination}
            disabled={pageMultiplier === 1}
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
    </>
  );
}
