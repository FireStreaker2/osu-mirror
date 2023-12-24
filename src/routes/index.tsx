import {
  Resource,
  component$,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import { server$, type DocumentHead, Link } from "@builder.io/qwik-city";

const search = server$(async (query: string) => {
  const response = await fetch(
    `https://api.chimu.moe/v1/search?status=1&size=40&query=${query}&offset=0`,
  );
  const data = await response.json();

  return data;
});

export default component$(() => {
  const query = useSignal("");

  const request = useResource$(async ({ track }) => {
    track(() => query.value);

    return search(query.value);
  });

  return (
    <div class="mt-12 flex flex-col items-center">
      <input bind:value={query} class="m-4 border bg-gray-500" />
      <Resource
        value={request}
        onPending={() => <p>Loading...</p>}
        onResolved={(maps) => (
          <div class="flex flex-row flex-wrap">
            {maps.data.map((map: any, index: number) => (
              <Link
                href={`/set/${map.SetId}`}
                key={index}
                class="h-20 w-1/3 border text-center"
              >
                <h1>
                  {map.Title} - {map.Artist} ({map.Creator})
                </h1>
                <p>{map.SetId}</p>
              </Link>
            ))}
          </div>
        )}
      />
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
