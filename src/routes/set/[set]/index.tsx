import { component$, useSignal, useTask$, $, useStore } from "@builder.io/qwik";
import {
  type DocumentHead,
  server$,
  useLocation,
  routeLoader$,
} from "@builder.io/qwik-city";
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
    <div class="mt-12 flex flex-col items-center bg-blue-100">
      <img
        src={`/api/image/cover/${set.value.SetId}`}
        class="h-full w-auto"
        width={2000}
        height={700}
      />
      <select
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

      <button onClick$={play} class="w-1/5 bg-blue-400 text-blue-950">
        {playing.value ? "stop" : "start"}
      </button>

      <audio ref={audioElement} onEnded$={() => (playing.value = false)}>
        <source src={`/api/audio/${set.value.SetId}`} type="audio/mp3" />
        your browser doesnt support the audio element
      </audio>

      <div class="bg-blue-200">
        <h1>{difficulty.value.DiffName}</h1>
        <p>Difficulty: {difficulty.value.DifficultyRating}</p>
        <div>
          <p>BPM: {difficulty.value.BPM}</p>
          <p>AR: {difficulty.value.AR}</p>
          <p>OD: {difficulty.value.OD}</p>
          <p>CS: {difficulty.value.CS}</p>
          <p>HP: {difficulty.value.HP}</p>
          <p>Length: {difficulty.value.TotalLength}</p>
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
