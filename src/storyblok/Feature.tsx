import { storyblokEditable } from "@storyblok/react";
import type {
  FeatureBlok,
  FeatureColor,
  FeatureTilt,
} from "@/storyblok/types";

const COLOR_CLASS: Record<FeatureColor, string> = {
  sun: "bg-sun",
  bubble: "bg-bubble",
  grape: "bg-grape",
};

const TILT_CLASS: Record<FeatureTilt, string> = {
  left: "-rotate-1",
  right: "rotate-1",
};

export interface FeatureProps {
  blok: FeatureBlok;
}

export function Feature({ blok }: FeatureProps) {
  const tilt = TILT_CLASS[blok.tilt] ?? TILT_CLASS.left;
  const color = COLOR_CLASS[blok.color] ?? COLOR_CLASS.sun;

  return (
    <article
      {...storyblokEditable(blok)}
      className={`brut-card ${tilt} grid content-start gap-3 p-5 transition-transform hover:rotate-0`}
    >
      <div
        className={`${color} border-ink size-8 rounded-md border-3 shadow-[3px_3px_0_0_#111111]`}
      />
      <h2 className="font-display text-base uppercase">{blok.title}</h2>
      <p className="text-sm leading-relaxed font-medium">{blok.body}</p>
    </article>
  );
}
