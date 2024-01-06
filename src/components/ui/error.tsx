import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Error = component$(({ error }: { error: string }) => {
  return (
    <div class="flex h-full w-full justify-center">
      <div class="mt-20 flex w-2/3 flex-col items-center">
        <h1 class="m-8 text-5xl">Error</h1>
        <p>{error}</p>
        <Link
          href="/"
          class="mt-4 w-1/5 bg-blue-400 text-center text-blue-950 hover:bg-blue-500 active:bg-blue-400"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
});
