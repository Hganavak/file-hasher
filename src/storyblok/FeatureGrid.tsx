import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import type { FeatureGridBlok } from "@/storyblok/types";

export interface FeatureGridProps {
  blok: FeatureGridBlok;
}

export function FeatureGrid({ blok }: FeatureGridProps) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="grid gap-6 pt-6 sm:grid-cols-3"
    >
      {blok.features?.map((feature) => (
        <StoryblokComponent blok={feature} key={feature._uid} />
      ))}
    </section>
  );
}
