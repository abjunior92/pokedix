import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Pokemon, PokemonDetails, PokemonValueUnit } from "lib/pokemon";
import { useMemo } from "react";
import { getPokemonDetails } from "~/endpoints/pokemon-fetch";
import { formatUnits } from "~/utilities/formatUnits";

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
      height: {
        value: data.height,
        unit: "m"
      },
      weight: {
        value: data.weight,
        unit: "kg"
      },
      order: data.order,
      "base experience": data.base_experience,
      abilities: data.abilities,
      types: data.types
    }),
    [data]
  );

  return (
    <div className="grid xl:grid-cols-2 gap-8">
      <div className="div-img-details">
        <img
          src={`/pokemonSVG/${data.id}.svg`}
          alt={`${data.name.toLowerCase()}`}
        />
      </div>
      <div>
        <div className="grid grid-flow-row">
          <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-6">
            <div className="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-x-auto border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-indigo-900">
                    <tr>
                      <th scope="col">Attribute</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(attributes).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={
                          idx % 2 === 0
                            ? "bg-white dark:box-dark"
                            : "bg-slate-50 dark:bg-h-dark"
                        }
                      >
                        <td className="key-td">{key}</td>
                        <td className="value-td">
                          {value?.unit
                            ? formatUnits(value?.value, value?.unit)
                            : value}
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
  );
};
