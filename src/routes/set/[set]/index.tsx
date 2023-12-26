import {
  Resource,
  component$,
  useResource$,
  useSignal,
  useTask$,
  $,
} from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";

const search = server$(async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
});

export default component$(() => {
  const location = useLocation();
  const set = location.params.set;

  const difficulty = useSignal<number>();
  useTask$(async () => {
    const initialData = await search(`https://api.chimu.moe/v1/set/${set}`);

    difficulty.value = initialData.ChildrenBeatmaps[0]?.BeatmapId || -727;

    if (difficulty.value === -727) {
      console.log("no beatmaps found");
      // TODO: redirect to custom 404 page
    }
  });

  const setData = useResource$(async ({ track }) => {
    track(() => set);

    return search(`https://api.chimu.moe/v1/set/${set}`);
  });

  // TODO: store data in an object so we dont have to make a new request every time
  const mapData = useResource$(async ({ track }) => {
    track(difficulty);

    return search(`https://api.chimu.moe/v1/map/${difficulty.value}`);
  });

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
    <div class="mt-12 flex flex-col items-center bg-gray-500">
      <Resource
        value={setData}
        onPending={() => <p>Loading...</p>}
        onResolved={(set) => (
          <>
            <img
              src={`/api/image/cover/${set.SetId}`}
              width={2000}
              height={700}
            />
            <select
              value={difficulty.value}
              onChange$={(event) => {
                const target = event.target as HTMLSelectElement;
                difficulty.value = parseInt(target.value, 10);
              }}
            >
              {set.ChildrenBeatmaps.map((map: any, index: number) => (
                <option key={index} value={map.BeatmapId}>
                  {map.DiffName}
                </option>
              ))}
            </select>
            <button onClick$={play}>{playing.value ? "stop" : "start"}</button>

            <audio ref={audioElement} onEnded$={() => (playing.value = false)}>
              <source src={`/api/audio/${set.SetId}`} type="audio/mp3" />
              your browser doesnt support the audio element
            </audio>

            <Resource
              value={mapData}
              onPending={() => <p>Loading...</p>}
              onResolved={(map) => (
                <>
                  <h1>{map.DiffName}</h1>
                  <p>Difficulty: {map.DifficultyRating}</p>
                  <div>
                    <p>BPM: {map.BPM}</p>
                    <p>AR: {map.AR}</p>
                    <p>OD: {map.OD}</p>
                    <p>CS: {map.CS}</p>
                    <p>HP: {map.HP}</p>
                    <p>Length: {map.TotalLength}</p>
                  </div>
                </>
              )}
            />
          </>
        )}
      />
    </div>
  );
});
