import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import {
  isPokemonValueUnit,
  PokemonDetails,
  PokemonEvolutionChain,
  PokemonValueUnit
} from "lib/pokemon";
import {
  Fragment,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo
} from "react";
import isEqual from "react-fast-compare";
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

const EvolutionChain = memo(
  ({ chain, pokeId }: { chain: PokemonEvolutionChain; pokeId: number }) => {
    const location = useLocation();
    return (
      <>
        {chain.evolves_to.map((item: PokemonEvolutionChain, index: number) => {
          const idByUrl = item.species.url.split("/").at(-2);
          return (
            <Fragment key={index}>
              <Link
                to={{
                  pathname: `/pokemon/${item.species.name}`,
                  search: location.search
                }}
                className="evolution-card"
              >
                <div className="basis-1/2">
                  <div className="evolution-img-card">
                    <img
                      className="w-16 h-16 lg:w-24 lg:h-24"
                      src={`/pokemonSVG/${idByUrl}.svg`}
                      alt=""
                    />
                  </div>
                </div>
                <div className="basis-1/4 flex justify-start">
                  <h5 className="text-sm lg:text-xl font-medium text-gray-900 dark:text-s-dark">
                    {item.species.name}
                  </h5>
                </div>
                <div className="basis-1/4 flex justify-center">
                  <ArrowNarrowRightIcon className="text-indigo-900 dark:text-indigo-400 w-6 h-6" />
                </div>
              </Link>

              <EvolutionChain
                key={index}
                chain={chain.evolves_to[index]}
                pokeId={pokeId}
              />
            </Fragment>
          );
        })}
      </>
    );
  },
  isEqual
);

export default () => {
  const data = useLoaderData<PokemonDetails>();
  const location = useLocation();

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  const handleOutputValue = (
    value: PokemonValueUnit | string | number | string[] | ReactNode
  ) => {
    if (isPokemonValueUnit(value)) {
      return formatUnits(value?.value, value?.unit);
    } else if (
      Array.isArray(value) &&
      value.every(s => typeof s === "string")
    ) {
      return (
        <>
          <ul role="list">
            {value.map((s: string) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      );
    } else {
      return value;
    }
  };

  const memoizedHandleOutValue = useCallback(
    (val: PokemonValueUnit | string | number | string[] | ReactNode) =>
      handleOutputValue(val),
    [data]
  );

  const idByUrl = useMemo(
    () => data?.evolution_chain.species.url.split("/").at(-2),
    [data]
  );

  const hasEvolutionChain =
    data.evolution_chain && data.evolution_chain.evolves_to.length > 0;

  return (
    <div className="flex flex-col py-10">
      <div className="grid xl:grid-cols-2 gap-8 mb-4">
        <div className="div-img-details">
          <img
            src={`/pokemonSVG/${data.id}.svg`}
            alt={`${data.name.toLowerCase()}`}
          />
        </div>
        <div>
          <div className="grid grid-flow-row">
            <div className="my-2 overflow-x-auto">
              <div className="py-2 align-middle inline-block w-full">
                <div className="shadow overflow-x-auto border-slate-200 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-100 touch-auto">
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
                            {memoizedHandleOutValue(value)}
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
      {hasEvolutionChain && (
        <div className="w-full">
          <h3>🔗 Evolution chain</h3>
          <div className="grid grid-flow-row gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-8">
            <Link
              to={{
                pathname: `/pokemon/${data.evolution_chain.species.name}`,
                search: location.search
              }}
              className="evolution-card"
            >
              <div className="basis-1/2">
                <div className="evolution-img-card">
                  <img
                    className="w-16 h-16 lg:w-24 lg:h-24"
                    src={`/pokemonSVG/${idByUrl}.svg`}
                    alt=""
                  />
                </div>
              </div>
              <div className="basis-1/4 flex justify-start">
                <h5 className="text-sm lg:text-xl font-medium text-gray-900 dark:text-s-dark">
                  {data.evolution_chain.species.name}
                </h5>
              </div>
              <div className="basis-1/4 flex justify-center">
                <ArrowNarrowRightIcon className="text-indigo-900 dark:text-indigo-400 w-6 h-6" />
              </div>
            </Link>
            <EvolutionChain chain={data.evolution_chain} pokeId={data.id} />
          </div>
        </div>
      )}
    </div>
  );
};
