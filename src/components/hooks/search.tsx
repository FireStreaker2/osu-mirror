import { server$ } from "@builder.io/qwik-city";

export const search = server$(async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
});
