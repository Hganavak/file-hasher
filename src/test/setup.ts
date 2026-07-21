import "@testing-library/jest-dom/vitest";
import { storyblokInit } from "@storyblok/react";
import { storyblokComponents } from "@/storyblok/init";

// Register the blok component map so <StoryblokComponent> resolves components in
// tests, without loading the bridge or hitting the network.
storyblokInit({
  bridge: false,
  components: storyblokComponents,
});
