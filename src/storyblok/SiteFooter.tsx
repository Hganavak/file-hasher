import { storyblokEditable } from "@storyblok/react";
import type { SiteFooterBlok } from "@/storyblok/types";

export interface SiteFooterProps {
  blok: SiteFooterBlok;
}

export function SiteFooter({ blok }: SiteFooterProps) {
  return (
    <footer
      {...storyblokEditable(blok)}
      className="border-ink bg-ink text-paper mt-auto border-t-3"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-6">
        <p className="brut-label text-paper">
          {blok.credit_prefix}
          <a href={blok.credit_url} className="text-lime underline">
            {blok.credit_label}
          </a>
        </p>
        <a
          href={blok.source_url}
          className="brut-label text-lime underline"
        >
          {blok.source_label}
        </a>
      </div>
    </footer>
  );
}
