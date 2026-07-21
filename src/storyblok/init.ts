import { apiPlugin, storyblokInit } from "@storyblok/react";
import { Page } from "@/storyblok/Page";
import { Ticker } from "@/storyblok/Ticker";
import { SiteHeader } from "@/storyblok/SiteHeader";
import { Hero } from "@/storyblok/Hero";
import { HashTool } from "@/storyblok/HashTool";
import { FeatureGrid } from "@/storyblok/FeatureGrid";
import { Feature } from "@/storyblok/Feature";
import { SiteFooter } from "@/storyblok/SiteFooter";

export const storyblokComponents = {
  page: Page,
  ticker: Ticker,
  site_header: SiteHeader,
  hero: Hero,
  hash_tool: HashTool,
  feature_grid: FeatureGrid,
  feature: Feature,
  site_footer: SiteFooter,
};

let initialized = false;

/** Registers the Storyblok SDK and blok component map. Safe to call repeatedly. */
export function initStoryblok(): void {
  if (initialized) return;
  storyblokInit({
    accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: "eu",
    },
    components: storyblokComponents,
  });
  initialized = true;
}

/**
 * Serve published content on the public site, but draft content inside the
 * Storyblok Visual Editor (detected via the `_storyblok` query param or an
 * iframe context) so editors see live, unpublished changes.
 */
export function getStoryblokVersion(): "draft" | "published" {
  if (typeof window === "undefined") return "published";

  const hasEditorParam = window.location.search.includes("_storyblok");
  const inIframe = window.self !== window.top;

  return hasEditorParam || inIframe ? "draft" : "published";
}
