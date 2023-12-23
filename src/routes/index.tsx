import {
  Resource,
  component$,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const query = useSignal("");

  const request = useResource$(async ({ track }) => {
    track(() => query.value);

    const response = await fetch(
      `https://api.chimu.moe/v1/search?status=1&size=40&query=${query.value}&offset=0`,
    );
    const data = await response.json();
    return data;
  });

  return (
    <>
      <div class="flex flex-col items-center">
        <input bind:value={query} class="m-4 border bg-gray-500" />
        <Resource
          value={request}
          onPending={() => <p>Loading...</p>}
          onResolved={(maps) => (
            <div class="flex flex-row flex-wrap">
              {maps.data.map((map: any, index: number) => (
                <div key={index} class="h-20 w-1/3 border text-center">
                  <h1>
                    {map.Title} - {map.Artist} ({map.Creator})
                  </h1>
                  <p>{map.SetId}</p>
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </>
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
