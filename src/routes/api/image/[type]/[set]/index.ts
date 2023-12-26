import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ send, url, headers }) => {
  const info = url.pathname.split("/");

  /**
   * category can be:
   * list
   * card
   * cover
   */
  const category = info[3];
  const id = info[4];
  const size = url.searchParams.get("size");

  const response = await fetch(
    `https://assets.ppy.sh/beatmaps/${id}/covers/${category}${
      size === "2" ? "@2x" : ""
    }.jpg`,
  );
  const data = await response.arrayBuffer();

  const array = new Uint8Array(data);

  headers.set("Content-Type", "image/jpeg");

  send(response.status, array);
};
