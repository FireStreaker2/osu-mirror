import { component$, $, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  FaPauseSolid,
  FaPlaySolid,
  FaShareSolid,
} from "@qwikest/icons/font-awesome";
import { IoDownloadSolid, IoShareSolid } from "@qwikest/icons/ionicons";

export const Set = component$(({ map }) => {
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
    <div class="m-4 flex h-48 w-1/3 scale-100 transform flex-col bg-blue-300 duration-300 hover:scale-110 active:bg-blue-400">
      <Link
        href={`/set/${map.SetId}`}
        class="relative line-clamp-2 h-full overflow-hidden text-ellipsis border text-center"
      >
        <div class="flex justify-center">
          <img
            src={`/api/image/card/${map.SetId}`}
            class="h-20 w-auto"
            width={200}
            height={70}
          />
        </div>
        <h1>
          {map.Title} - {map.Artist} ({map.Creator})
        </h1>
      </Link>

      <button
        onClick$={play}
        class="flex h-10 w-full items-center justify-center border-l border-r bg-blue-400 text-blue-950 hover:bg-blue-500 active:bg-blue-400"
      >
        {playing.value ? <FaPauseSolid /> : <FaPlaySolid />}
      </button>

      <audio ref={audioElement} onEnded$={() => (playing.value = false)}>
        <source src={`/api/audio/${map.SetId}`} type="audio/mp3" />
      </audio>

      <div class="flex h-14 items-center justify-around border">
        <Link
          href={`/api/download/${map.SetId}?name=${encodeURIComponent(
            map.Title,
          )}`}
          target="_blank"
          title="Download Map"
          class="hover:text-blue-600 active:text-blue-400"
        >
          <IoDownloadSolid />
        </Link>

        <Link
          href={`osu://b/${map.SetId}`}
          title="osu! direct"
          class="hover:text-blue-600 active:text-blue-400"
        >
          <IoShareSolid />
        </Link>

        <Link
          href={`https://osu.ppy.sh/beatmapsets/${map.SetId}`}
          target="_blank"
          title="Original"
          class="hover:text-blue-600 active:text-blue-400"
        >
          <FaShareSolid />
        </Link>
      </div>
    </div>
  );
});
