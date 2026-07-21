import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";
import type { SiteFooterBlok } from "@/storyblok/types";

const blok: SiteFooterBlok = {
  _uid: "footer-test",
  component: "site_footer",
  credit_prefix: "Built by ",
  credit_label: "icy.dev",
  credit_url: "https://icy.dev",
  source_label: "source ↗",
  source_url: "https://github.com/Hganavak/file-hasher",
};

describe("SiteFooter", () => {
  it("renders the credit and source links with their hrefs", () => {
    render(<SiteFooter blok={blok} />);

    const credit = screen.getByRole("link", { name: "icy.dev" });
    expect(credit).toHaveAttribute("href", "https://icy.dev");

    const source = screen.getByRole("link", { name: "source ↗" });
    expect(source).toHaveAttribute(
      "href",
      "https://github.com/Hganavak/file-hasher",
    );
  });
});
