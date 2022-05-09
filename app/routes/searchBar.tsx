import { SearchIcon } from "@heroicons/react/solid";
import { LoaderFunction } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { useMemo } from "react";

export default function SearchBar() {
  const fetcher = useFetcher();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    fetcher.load(`?index`);
  };

  return (
    <fetcher.Form method="post" className="flex flex-col sm:flex-row mb-10">
      <input
        type={"text"}
        name="filtered"
        className="primary-input"
        placeholder="Search a Pokémon..."
        onChange={handleChange}
        list="suggestions"
      />
      <datalist id="suggestions">
        {fetcher?.data?.results.map((item: any) => {
          return <option key={item.url} value={item.name} />;
        })}
      </datalist>
      <button type={"submit"} className="primary-btn">
        Search
        <SearchIcon className="w-6 h-6 ml-2" />
      </button>
    </fetcher.Form>
  );
}
