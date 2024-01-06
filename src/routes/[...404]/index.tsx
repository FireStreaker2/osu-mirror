import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { Error } from "~/components/ui";

export default component$(() => {
  const location = useLocation();

  return (
    <Error error={`The specified route '${location.url}' was not found.`} />
  );
});

export const head: DocumentHead = {
  title: "404 - Page Not Found | osu! mirror",
  meta: [
    {
      name: "description",
      content: "Page Not Found - osu! mirror",
    },
  ],
};
