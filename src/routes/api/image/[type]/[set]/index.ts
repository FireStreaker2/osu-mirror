import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ send, url, headers }) => {
  const info = url.pathname.split("/");

  const category = info[3];
  const id = info[4];
  const size = url.searchParams.get("size");

  let response = await fetch(
    `https://assets.ppy.sh/beatmaps/${id}/covers/${category}${
      size === "2" ? "@2x" : ""
    }.jpg`,
  );

  if (!response.ok)
    response = await fetch(
      "https://upload.wikimedia.org/wikipedia/en/4/48/Blank.JPG",
    );

  const data = await response.arrayBuffer();

  const array = new Uint8Array(data);

  headers.set("Content-Type", "image/jpeg");

  send(response.status, array);
};
