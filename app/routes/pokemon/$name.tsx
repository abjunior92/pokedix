import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Pokemon, PokemonDetails } from "lib/pokemon";
import { useMemo } from "react";
import { getPokemonDetails } from "~/endpoints/pokemon-fetch";

export let handle = {
  title: (params: { name: string }) => params.name,
  breadcrumb: (params: { name: string }) => (
    <Link to={`/pokemon/${params.name}`}>{params.name}</Link>
  )
};

export const loader: LoaderFunction = async ({ params }: { params: any }) => {
  const result = await getPokemonDetails(params.name);
  return result;
};

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return {
    title: data ? `Pokémon: ${data.name}` : "Ooops!"
  };
};

export default () => {
  const data = useLoaderData<PokemonDetails>();

  const attributes = useMemo(
    () => ({
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      order: data.order,
      base_experience: data.base_experience
    }),
    [data]
  );

  return (
    <div className="flex flex-col gap-y-10">
      <div className="grid xl:grid-cols-2 gap-10">
        <div className="hover:scale-105 transition duration-200 group flex justify-center items-center">
          <img
            src={`/pokemonSVG/${data.id}.svg`}
            alt={`${data.name.toLowerCase()}`}
            className="object-contain pointer-events-none group-hover:opacity-75 max-h-96"
          />
        </div>
        <div>
          <div className="flex flex-col">
            <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-900">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                        >
                          Attribute
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                        >
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(attributes).map(([key, value], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {key}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-500">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
