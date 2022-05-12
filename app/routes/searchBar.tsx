import { SearchIcon } from "@heroicons/react/solid";
import { Form, useFetcher } from "@remix-run/react";
import { memo, useState } from "react";
import isEqual from "react-fast-compare";
import { PokemonStructure } from "lib/pokemon";

const SearchBar = ({ allPokemons }: { allPokemons: PokemonStructure }) => {
  const [search, setSearch] = useState("");

  return (
    <>
      <Form method="post" className="flex flex-col sm:flex-row">
        <input
          type={"text"}
          name="filtered"
          className="primary-input"
          placeholder="Search a Pokémon..."
          onChange={e => setSearch(e.target.value)}
          value={search}
          list="suggestions"
        />
        <datalist id="suggestions">
          {allPokemons?.results.map((item: any) => {
            return <option key={item.url} value={item.name} />;
          })}
        </datalist>
        <button
          type={"submit"}
          className="primary-btn transition hover:scale-105 ease-in-out"
        >
          Search
          <SearchIcon className="w-6 h-6 ml-2" />
        </button>
      </Form>
    </>
  );
};

export default memo(SearchBar, isEqual);
