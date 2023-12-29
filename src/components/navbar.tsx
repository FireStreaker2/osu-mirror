import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { FaMusicSolid } from "@qwikest/icons/font-awesome";

interface Route {
  route: string;
  name: string;
  newtab?: boolean;
}

export const Navbar = component$(() => {
  const location = useLocation();

  const routes: Route[] = [
    { route: "/", name: "Home" },
    {
      route: "https://github.com/FireStreaker2/osu-mirror",
      name: "GitHub",
      newtab: true,
    },
    { route: "/about/", name: "About" },
    { route: "/support/", name: "Support" },
  ];

  return (
    <div class="fixed top-0 z-20 flex h-12 w-full flex-row justify-around bg-blue-500">
      <div class="flex h-full w-1/3 items-center justify-center">
        <Link href="/" class="flex flex-row items-center">
          <FaMusicSolid />
          <p class="ml-2">osu! mirror</p>
        </Link>
      </div>
      <div class="flex h-full w-1/3 items-center justify-around">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.route}
            target={route.newtab ? "_blank" : ""}
            class={`${location.url.pathname === route.route && "font-bold"}`}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </div>
  );
});
