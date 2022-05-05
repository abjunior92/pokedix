import { Form } from "@remix-run/react";

export default function SearchBar() {
  return (
    <Form method="post" className="flex flex-col sm:flex-row mb-10">
      <input
        type={"text"}
        name="filtered"
        className="shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-900 dark:focus:border-indigo-400 w-full rounded-lg h-14 mt-2 sm:mt-0 dark:bg-slate-500 dark:text-white dark:placeholder:text-slate-100"
        placeholder="Search a Pokémon..."
      />
      <button
        type={"submit"}
        className="sm:ml-4 mt-2 sm:mt-0 inline-flex items-center px-3.5 py-3.5 bg-indigo-900 text-white rounded-lg shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-900 h-14 sm:w-1/6 justify-center font-semibold sm:text-xl"
      >
        Search
      </button>
    </Form>
  );
}
