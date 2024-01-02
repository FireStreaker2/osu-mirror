import {
  Resource,
  component$,
  useResource$,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { IoChevronDown, IoSearchSolid } from "@qwikest/icons/ionicons";
import { Set } from "~/components/ui";
import { search } from "~/components/hooks";
import { modes, statuses } from "~/data";

interface Query {
  search: string;
  status: number;
  mode: number;
}

export default component$(() => {
  const query = useStore<Query>({
    search: "",
    status: 727,
    mode: 727,
  });

  const dropdownState = useSignal(false);

  const request = useResource$(async ({ track }) => {
    track(query);

    return search(
      `https://api.chimu.moe/v1/search?status=${
        query.status !== 727 ? query.status : ""
      }&size=40&query=${query.search}&offset=0&mode=${
        query.mode !== 727 ? query.mode : ""
      }`,
    );
  });

  return (
    <div class="flex h-full w-full justify-center">
      <div class="mt-24 flex w-2/3 flex-col items-center bg-blue-200">
        <div class="w-full bg-blue-300">
          <div class="flex items-center">
            <form preventdefault:submit class="flex flex-grow">
              <div class="relative flex w-2/3 items-center justify-center">
                <input
                  value={query.search}
                  onChange$={(_, element) => (query.search = element.value)}
                  class="m-4 w-full border bg-blue-500 p-1 placeholder-blue-200"
                  placeholder="Keywords"
                />
                <button class="absolute right-5">
                  <IoSearchSolid />
                </button>
              </div>
            </form>

            <button
              class="mr-8 flex w-1/5 flex-row items-center justify-center bg-blue-400 text-blue-950 hover:bg-blue-500 active:bg-blue-400"
              onClick$={() => (dropdownState.value = !dropdownState.value)}
            >
              Advanced <IoChevronDown />
            </button>
          </div>
          <div
            class={`${
              !dropdownState.value && "hidden"
            } mb-4 flex flex-row justify-around text-center`}
          >
            <div>
              <h1>Status</h1>
              <select
                value={query.status}
                onChange$={(event) =>
                  (query.status = parseInt(
                    (event.target as HTMLSelectElement).value,
                    10,
                  ))
                }
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h1>Mode</h1>
              <select
                value={query.mode}
                onChange$={(event) =>
                  (query.mode = parseInt(
                    (event.target as HTMLSelectElement).value,
                    10,
                  ))
                }
              >
                {modes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <Resource
          value={request}
          onPending={() => <p>Loading...</p>}
          onResolved={(maps) => (
            <div class="flex flex-row flex-wrap justify-center">
              {maps.data.map((map: any) => (
                <Set map={map} key={map.SetId} />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "osu! mirror",
  meta: [
    {
      name: "description",
      content: "Simple mirror for osu made with qwik",
    },
  ],
};
