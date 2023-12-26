import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ send, url, headers }) => {
  const id = url.pathname.split("/audio/")[1];

  const response = await fetch(`https://b.ppy.sh/preview/${id}.mp3`);
  const data = await response.blob();

  const buffer = await new Response(data).arrayBuffer();
  const array = new Uint8Array(buffer);

  headers.set("Content-Type", "audio/mpeg");

  send(response.status, array);
};
