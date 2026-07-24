import { readFile } from "node:fs/promises";
import { getEmotes, emoteCachePath } from "../../lib/emotes";

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  gif: "image/gif",
  jpg: "image/jpeg",
};

export async function getStaticPaths() {
  const emotes = await getEmotes();
  return emotes.map((e) => ({ params: { file: e.file } }));
}

export async function GET({ params }: { params: { file?: string } }) {
  const file = params.file ?? "";
  const body = await readFile(emoteCachePath(file));
  const ext = file.split(".").pop() ?? "";
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
