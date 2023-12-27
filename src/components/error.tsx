import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Error = component$(({ error }: { error: string }) => {
  return (
    <div class="mt-12 flex flex-col items-center bg-gray-500">
      <h1>Error</h1>
      <p>{error}</p>
      <Link href="/">Return Home</Link>
    </div>
  );
});
