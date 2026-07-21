import type { SbBlokData } from "@storyblok/react";

export interface TickerBlok extends SbBlokData {
  component: "ticker";
  text: string;
}

export interface SiteHeaderBlok extends SbBlokData {
  component: "site_header";
  left_label: string;
  left_title: string;
  left_url: string;
  right_label: string;
  right_url: string;
}

export interface HeroBlok extends SbBlokData {
  component: "hero";
  heading_line_1: string;
  heading_line_2: string;
  subheading: string;
}

export type HashToolBlok = SbBlokData & {
  component: "hash_tool";
};

export type FeatureColor = "sun" | "bubble" | "grape";
export type FeatureTilt = "left" | "right";

export interface FeatureBlok extends SbBlokData {
  component: "feature";
  title: string;
  body: string;
  color: FeatureColor;
  tilt: FeatureTilt;
}

export interface FeatureGridBlok extends SbBlokData {
  component: "feature_grid";
  features: FeatureBlok[];
}

export interface SiteFooterBlok extends SbBlokData {
  component: "site_footer";
  credit_prefix: string;
  credit_label: string;
  credit_url: string;
  source_label: string;
  source_url: string;
}

export interface PageBlok extends SbBlokData {
  component: "page";
  body: SbBlokData[];
}
