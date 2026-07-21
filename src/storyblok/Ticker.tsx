import { storyblokEditable } from "@storyblok/react";
import type { TickerBlok } from "@/storyblok/types";

export interface TickerProps {
  blok: TickerBlok;
}

export function Ticker({ blok }: TickerProps) {
  return (
    <div
      {...storyblokEditable(blok)}
      aria-hidden="true"
      className="bg-ink text-lime border-ink overflow-hidden border-b-3 py-2 whitespace-nowrap"
    >
      <div className="animate-marquee flex w-max">
        <span className="font-display px-2 text-sm tracking-wider uppercase">
          {blok.text.repeat(4)}
        </span>
        <span className="font-display px-2 text-sm tracking-wider uppercase">
          {blok.text.repeat(4)}
        </span>
      </div>
    </div>
  );
}
