import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import type { PageBlok } from "@/storyblok/types";

export interface PageProps {
  blok: PageBlok;
}

const TOP_CHROME = new Set(["ticker", "site_header"]);
const BOTTOM_CHROME = new Set(["site_footer"]);

export function Page({ blok }: PageProps) {
  const body = blok.body ?? [];
  const topChrome = body.filter((b) => TOP_CHROME.has(b.component ?? ""));
  const bottomChrome = body.filter((b) => BOTTOM_CHROME.has(b.component ?? ""));
  const mainContent = body.filter(
    (b) =>
      !TOP_CHROME.has(b.component ?? "") &&
      !BOTTOM_CHROME.has(b.component ?? ""),
  );

  const render = (b: SbBlokData) => <StoryblokComponent blok={b} key={b._uid} />;

  return (
    <div
      {...storyblokEditable(blok)}
      className="relative flex min-h-dvh flex-col overflow-x-clip"
    >
      {/* Drifting background shapes */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <svg
          viewBox="0 0 100 100"
          className="text-grape animate-float absolute -top-10 -left-16 w-48 opacity-80 sm:w-72"
        >
          <path
            d="M10 70 Q 30 10 55 45 T 95 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
        <svg
          viewBox="0 0 64 64"
          className="text-grape animate-float-late absolute top-1/4 -right-10 w-28 opacity-75 sm:w-44"
        >
          <path
            d="M32 6 V58 M6 32 H58 M13 13 L51 51 M51 13 L13 51"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <div className="border-grape animate-float absolute bottom-24 -left-14 size-36 rounded-full border-8 opacity-70 sm:size-52" />
        <svg
          viewBox="0 0 100 100"
          className="text-lime animate-float-late absolute -right-20 bottom-4 w-52 opacity-80 sm:w-80"
        >
          <path
            d="M5 55 Q 25 95 50 55 T 95 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {topChrome.map(render)}

      <main className="mx-auto grid w-full max-w-3xl gap-10 px-5 pt-14 pb-20">
        {mainContent.map(render)}
      </main>

      {bottomChrome.map(render)}
    </div>
  );
}
