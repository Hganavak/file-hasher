import { storyblokEditable } from "@storyblok/react";
import type { HeroBlok } from "@/storyblok/types";

export interface HeroProps {
  blok: HeroBlok;
}

export function Hero({ blok }: HeroProps) {
  return (
    <section {...storyblokEditable(blok)} className="grid gap-5 text-center">
      <h1 className="font-display text-[clamp(2.9rem,10vw,5.8rem)] leading-[0.95] uppercase">
        {blok.heading_line_1}
        <br />
        <span className="text-bubble" style={{ WebkitTextStroke: "3px #111111" }}>
          {blok.heading_line_2}
        </span>
      </h1>
      <p className="mx-auto max-w-xl font-medium text-balance sm:text-lg">
        {blok.subheading}
      </p>
    </section>
  );
}
