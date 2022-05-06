import { Form } from "@remix-run/react";

export default function SearchBar() {
  return (
    <Form method="post" className="flex flex-col sm:flex-row mb-10">
      <input
        type={"text"}
        name="filtered"
        className="primary-input"
        placeholder="Search a Pokémon..."
      />
      <button type={"submit"} className="primary-btn">
        Search
      </button>
    </Form>
  );
}
