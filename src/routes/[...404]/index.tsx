import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Error } from "~/components/ui";

export default component$(() => {
  const location = useLocation();

  return (
    <Error error={`The specified route '${location.url}' was not found.`} />
  );
});
