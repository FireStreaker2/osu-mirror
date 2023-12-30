import { component$, useSignal, useTask$, $, useStore } from "@builder.io/qwik";
import {
  type DocumentHead,
  server$,
  useLocation,
  routeLoader$,
  Link,
} from "@builder.io/qwik-city";
import {
  FaPlaySolid,
  FaPauseSolid,
  FaShareSolid,
} from "@qwikest/icons/font-awesome";
import { IoDownloadSolid, IoShareSolid } from "@qwikest/icons/ionicons";
import { Error } from "~/components";

const search = server$(async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
});

export default component$(() => {
  const location = useLocation();

  const error = useSignal(false);
  const difficulty = useStore<any>({ value: {} });
  const set = useStore<any>({ value: {} });

  useTask$(async () => {
    set.value = await search(
      `https://api.chimu.moe/v1/set/${location.params.set}`,
    );

    difficulty.value = set.value.ChildrenBeatmaps[0];

    if (set.value.ChildrenBeatmaps.length <= 0) error.value = true;
  });

  if (error.value) return <Error error="Beatmaps not found" />;

  const audioElement = useSignal<HTMLAudioElement>();
  const playing = useSignal(false);

  const play = $(() => {
    const audio = audioElement.value;

    if (audio && (audio.paused || audio.ended)) {
      audio.play();
      playing.value = true;
    } else if (audio) {
      audio.pause();
      audio.currentTime = 0;
      playing.value = false;
    }
  });

  return (
    <div class="flex h-full w-full justify-center bg-blue-100">
      <div class="mt-24 flex w-2/3 flex-col items-center bg-blue-200">
        <div class="relative flex h-96  w-full flex-row border">
          <div class="z-10 flex flex-grow flex-col justify-center gap-8 bg-blue-950 bg-opacity-50">
            <div class="ml-8 text-blue-50">
              <h1 class="text-4xl">{set.value.Title}</h1>
              <p>{set.value.Artist}</p>
            </div>
            <div class="ml-8 flex flex-row gap-4">
              <Link
                href={`/api/download/${set.value.SetId}?name=${set.value.Title}`}
                target="_blank"
                title="Download Map"
                class="flex h-12 w-32 flex-row items-center justify-center gap-2 bg-blue-400 text-blue-950 hover:bg-blue-500 active:bg-blue-400"
              >
                <IoDownloadSolid />
                <h1>Download</h1>
              </Link>

              <Link
                href={`osu://b/${set.value.SetId}`}
                title="osu! direct"
                class="flex h-12 w-32 flex-row items-center justify-center gap-2 bg-blue-400 text-blue-950 hover:bg-blue-500 active:bg-blue-400"
              >
                <IoShareSolid />
                <h1>osu! direct</h1>
              </Link>

              <Link
                href={`https://osu.ppy.sh/beatmapsets/${set.value.SetId}`}
                target="_blank"
                title="Original"
                class="flex h-12 w-32 flex-row items-center justify-center gap-2 bg-blue-400 text-blue-950 hover:bg-blue-500 active:bg-blue-400"
              >
                <FaShareSolid />
                <h1>Original</h1>
              </Link>
            </div>
          </div>
          <img
            src={`/api/image/cover/${set.value.SetId}?size=2`}
            class="absolute left-0 h-96 w-auto"
            width={2000}
            height={700}
          />
          <div class="z-10 flex w-48 flex-col items-center justify-center gap-2 bg-blue-200">
            <div class="text-center">
              <h1 class="text-4xl">Info</h1>
            </div>
            <select
              class="w-3/4"
              onChange$={(event) =>
                (difficulty.value = set.value.ChildrenBeatmaps.find(
                  (map: any) =>
                    map.BeatmapId ===
                    parseInt((event.target as HTMLSelectElement).value, 10),
                ))
              }
            >
              {set.value.ChildrenBeatmaps &&
                set.value.ChildrenBeatmaps.map((map: any, index: number) => (
                  <option key={index} value={map.BeatmapId}>
                    {map.DiffName}
                  </option>
                ))}
            </select>

            <button
              onClick$={play}
              class="flex h-10 w-3/4 items-center justify-center bg-blue-400 text-blue-950 hover:bg-blue-500 active:bg-blue-400"
            >
              {playing.value ? <FaPauseSolid /> : <FaPlaySolid />}
            </button>

            <audio ref={audioElement} onEnded$={() => (playing.value = false)}>
              <source src={`/api/audio/${set.value.SetId}`} type="audio/mp3" />
            </audio>

            <div class="bg-blue-200">
              <div class="mr-6">
                <p>Difficulty: {difficulty.value.DifficultyRating}</p>
                <p>BPM: {difficulty.value.BPM}</p>
                <p>AR: {difficulty.value.AR}</p>
                <p>OD: {difficulty.value.OD}</p>
                <p>CS: {difficulty.value.CS}</p>
                <p>HP: {difficulty.value.HP}</p>
                <p>Length: {difficulty.value.TotalLength}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex h-72 w-full flex-row gap-8 border p-4">
          <div class="w-1/3">
            <h1 class="whitespace-nowrap text-2xl">Tags</h1>
            <p>{set.value.Tags}</p>
          </div>
          <div class="flex flex-row flex-wrap gap-8">
            <div>
              <h1 class="whitespace-nowrap text-2xl">Last Update</h1>
              <p>{set.value.LastUpdate}</p>
            </div>
            <div>
              <h1 class="whitespace-nowrap text-2xl">Last Checked</h1>
              <p>{set.value.LastChecked}</p>
            </div>
            <div>
              <h1 class="whitespace-nowrap text-2xl">Status</h1>
              <p>{set.value.RankedStatus}</p>
            </div>
            <div>
              <h1 class="whitespace-nowrap text-2xl">Genre</h1>
              <p>{set.value.Genre}</p>
            </div>
            <div>
              <h1 class="whitespace-nowrap text-2xl">Language</h1>
              <p>{set.value.Language}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const useMetadata = routeLoader$(async (event) => {
  return await search(`https://api.chimu.moe/v1/set/${event.params.set}`);
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useMetadata);

  return {
    title: `${data.Title} beatmap info | osu! mirror`,
    meta: [
      {
        name: "description",
        content: `Info for ${data.Title} - osu! mirror`,
      },
    ],
  };
};
