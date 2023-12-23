import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Navbar = component$(() => {
  return (
    <div class="fixed top-0 flex h-12 w-full flex-row justify-around bg-gray-400">
      <div class="flex h-full w-1/3 items-center justify-center">
        <Link href="/">osu! mirror</Link>
      </div>
      <div class="flex h-full w-1/3 items-center justify-around">
        <Link href="/">Home</Link>
        <Link href="https://github.com/FireStreaker2/osu-mirror">GitHub</Link>
        <Link href="/about">About</Link>
        <Link href="/support">Support</Link>
      </div>
    </div>
  );
});
