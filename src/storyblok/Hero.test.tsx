import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import type { HeroBlok } from "@/storyblok/types";

const blok: HeroBlok = {
  _uid: "hero-test",
  component: "hero",
  heading_line_1: "Drop file.",
  heading_line_2: "Get hash.",
  subheading: "SHA-256 for files of any size.",
};

describe("Hero", () => {
  it("renders both heading lines and the subheading", () => {
    render(<Hero blok={blok} />);

    expect(
      screen.getByRole("heading", { name: /drop file\./i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Get hash.")).toBeInTheDocument();
    expect(
      screen.getByText("SHA-256 for files of any size."),
    ).toBeInTheDocument();
  });
});
