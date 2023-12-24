import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";

const search = server$(async (query: string) => {
  const response = await fetch(`https://api.chimu.moe/v1/set/${query}`);
  const data = await response.json();

  return data;
});

export default component$(() => {
  const location = useLocation();
  const set = location.params.set;

  const request = useResource$(async ({ track }) => {
    track(() => set);

    return search(set);
  });

  return (
    <div class="mt-12 flex flex-col items-center">
      <Resource
        value={request}
        onPending={() => <p>Loading...</p>}
        onResolved={(set) => <h1>{JSON.stringify(set)}</h1>}
      />
    </div>
  );
});
