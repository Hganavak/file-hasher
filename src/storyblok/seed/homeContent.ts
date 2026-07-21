import type { PageBlok } from "@/storyblok/types";
import homeContentJson from "./homeContent.json";

/**
 * Canonical content for the `home` story.
 *
 * This is the single source of truth used both to seed the Storyblok space and
 * as the fixture for tests, guaranteeing the rendered site matches the CMS.
 */
export const homeContent = homeContentJson as unknown as PageBlok;
