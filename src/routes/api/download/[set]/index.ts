import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ send, url, headers }) => {
  const id = url.pathname.split("/download/")[1];
  const response = await fetch(`https://api.chimu.moe/v1/download/${id}`);
  const data = await response.blob();

  const buffer = await new Response(data).arrayBuffer();
  const array = new Uint8Array(buffer);

  headers.set("Content-Type", "application/octet-stream");
  headers.set("Content-Disposition", `attachment; filename="${id}.osz"`);

  send(response.status, array);
};
