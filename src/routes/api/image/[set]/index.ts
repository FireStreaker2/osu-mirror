import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ send, url, headers }) => {
  const id = url.pathname.split("/image/")[1];

  const response = await fetch(
    `https://assets.ppy.sh/beatmaps/${id}/covers/card.jpg`,
  );
  const data = await response.arrayBuffer();
  const array = new Uint8Array(data);

  headers.set("Content-Type", "image/jpeg");

  send(response.status, array);
};
