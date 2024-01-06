import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import { FaGithub } from "@qwikest/icons/font-awesome";
import { MatEmailFilled } from "@qwikest/icons/material";

export default component$(() => {
  return (
    <div class="flex h-full w-full justify-center">
      <div class="mt-20 flex w-2/3 flex-col items-center">
        <h1 class="m-8 text-5xl">Support</h1>

        <div class="flex h-96 w-full justify-around">
          <Link
            href="https://github.com/FireStreaker2/osu-mirror/issues"
            target="_blank"
            class="flex aspect-square h-full scale-100 transform flex-col items-center justify-center bg-blue-400 text-9xl text-blue-950 hover:bg-blue-500 active:bg-blue-400"
          >
            <FaGithub />
            <h1 class="text-4xl">GitHub</h1>
          </Link>
          <Link
            href="mailto:help@firestreaker2.gq"
            class="flex aspect-square h-full scale-100 transform flex-col items-center justify-center bg-blue-400 text-9xl text-blue-950 hover:bg-blue-500 active:bg-blue-400"
          >
            <MatEmailFilled />
            <h1 class="text-4xl">Email</h1>
          </Link>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Support | osu! mirror",
  meta: [
    {
      name: "description",
      content: "Support - osu! mirror",
    },
  ],
};
