import { storyblokEditable } from "@storyblok/react";
import type { SiteHeaderBlok } from "@/storyblok/types";

export interface SiteHeaderProps {
  blok: SiteHeaderBlok;
}

export function SiteHeader({ blok }: SiteHeaderProps) {
  return (
    <header
      {...storyblokEditable(blok)}
      className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 pt-8"
    >
      <a
        href={blok.left_url}
        className="brut-chip bg-sun -rotate-2 transition-transform hover:rotate-0"
        title={blok.left_title}
      >
        {blok.left_label}
        <span className="text-alarm">#</span>
      </a>
      <a
        href={blok.right_url}
        className="brut-chip rotate-2 transition-transform hover:rotate-0"
      >
        {blok.right_label}
      </a>
    </header>
  );
}
