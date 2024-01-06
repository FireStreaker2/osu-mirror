import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import { api } from "~/data";

export default component$(() => {
  return (
    <div class="flex h-full w-full justify-center">
      <div class="mt-20 flex w-2/3 flex-col items-center">
        <h1 class="m-8 text-5xl">API Routes</h1>

        <div class="flex h-96 w-full flex-col items-center justify-center gap-4 bg-blue-200">
          {api.map((item) => (
            <Link
              key={item.route}
              class="w-1/2 bg-blue-300"
              href={item.route.split("{")[0]}
              target="_blank"
            >
              <div class="flex h-12 flex-row items-center gap-2">
                <div class="ml-4 flex h-8 w-24 items-center justify-center bg-blue-400">
                  <h1>{item.method}</h1>
                </div>
                <h1>{item.route}</h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "API Documentation | osu! mirror",
  meta: [
    {
      name: "description",
      content: "API Documentation - osu! mirror",
    },
  ],
};
