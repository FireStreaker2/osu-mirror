import {
  Resource,
  component$,
  useResource$,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { server$, type DocumentHead, Link } from "@builder.io/qwik-city";
import {
  IoChevronDown,
  IoDownloadSolid,
  IoSearchSolid,
  IoShareSolid,
} from "@qwikest/icons/ionicons";
import { FaShareSolid } from "@qwikest/icons/font-awesome";
import { modes, statuses } from "~/data";

const search = server$(async (query: string) => {
  const response = await fetch(`https://api.chimu.moe/v1/search${query}`);
  const data = await response.json();

  return data;
});

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
      `?status=${query.status !== 727 ? query.status : ""}&size=40&query=${
        query.search
      }&offset=0&mode=${query.mode !== 727 ? query.mode : ""}`,
    );
  });

  return (
    <div class="flex h-full w-full justify-center bg-blue-100">
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
                {statuses.map((status, index) => (
                  <option key={index} value={status.value}>
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
                {modes.map((mode, index) => (
                  <option key={index} value={mode.value}>
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
              {maps.data.map((map: any, index: number) => (
                <div
                  key={index}
                  class="m-4 flex h-44 w-1/3 scale-100 transform flex-col bg-blue-300 duration-300 hover:scale-110"
                >
                  <Link
                    href={`/set/${map.SetId}`}
                    class="relative line-clamp-2 h-full overflow-hidden text-ellipsis border text-center"
                  >
                    <div class="flex justify-center">
                      <img
                        src={`/api/image/card/${map.SetId}`}
                        class="h-20 w-auto"
                        width={200}
                        height={70}
                      />
                    </div>
                    <h1>
                      {map.Title} - {map.Artist} ({map.Creator})
                    </h1>
                  </Link>
                  <div class="flex h-14 items-center justify-around border">
                    <Link
                      href={`/api/download/${map.SetId}?name=${map.Title}`}
                      target="_blank"
                      title="Download Map"
                      class="hover:text-blue-600 active:text-blue-400"
                    >
                      <IoDownloadSolid />
                    </Link>

                    <Link
                      href={`osu://b/${map.SetId}`}
                      title="osu! direct"
                      class="hover:text-blue-600 active:text-blue-400"
                    >
                      <IoShareSolid />
                    </Link>

                    <Link
                      href={`https://osu.ppy.sh/beatmapsets/${map.SetId}`}
                      target="_blank"
                      title="Original"
                      class="hover:text-blue-600 active:text-blue-400"
                    >
                      <FaShareSolid />
                    </Link>
                  </div>
                </div>
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
