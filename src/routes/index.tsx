import {
  Resource,
  component$,
  useResource$,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { server$, type DocumentHead, Link } from "@builder.io/qwik-city";

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
          <div class="flex items-center justify-around">
            <input
              value={query.search}
              onChange$={(_, element) => (query.search = element.value)}
              class="m-4 w-2/3 border bg-blue-500"
              placeholder="keywords"
            />

            <button
              class="w-1/5 bg-blue-400 text-blue-950"
              onClick$={() => (dropdownState.value = !dropdownState.value)}
            >
              Advanced
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
                <option value={727}>All</option>
                <option value={1}>Ranked</option>
                <option value={2}>Approved</option>
                <option value={3}>Qualified</option>
                <option value={4}>Loved</option>
                <option value={0}>Pending</option>
                <option value={-1}>WIP</option>
                <option value={-2}>Graveyard</option>
              </select>
            </div>
            <div>
              <h1>Mode</h1>
              <select
                value={query.mode}
                onChange$={(event) =>
                  (query.status = parseInt(
                    (event.target as HTMLSelectElement).value,
                    10,
                  ))
                }
              >
                <option value={727}>All</option>
                <option value={0}>Standard</option>
                <option value={1}>Taiko</option>
                <option value={2}>Catch</option>
                <option value={3}>Mania</option>
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
                  class="m-4 flex h-40 w-1/3 flex-col bg-blue-300"
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
                  <div class="flex items-center">
                    <Link
                      class="w-full border text-center"
                      href={`/api/download/${map.SetId}?name=${map.Title}`}
                      target="_blank"
                    >
                      Download
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
