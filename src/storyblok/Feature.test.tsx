import { render, screen } from "@testing-library/react";
import { Feature } from "./Feature";
import type { FeatureBlok } from "@/storyblok/types";

const blok: FeatureBlok = {
  _uid: "feature-test",
  component: "feature",
  title: "Nothing gets uploaded",
  body: "Your file never leaves your machine.",
  color: "grape",
  tilt: "right",
};

describe("Feature", () => {
  it("renders the title and body", () => {
    render(<Feature blok={blok} />);

    expect(screen.getByText("Nothing gets uploaded")).toBeInTheDocument();
    expect(
      screen.getByText("Your file never leaves your machine."),
    ).toBeInTheDocument();
  });

  it("maps color and tilt to the matching brutalist classes", () => {
    const { container } = render(<Feature blok={blok} />);

    const article = container.querySelector("article");
    expect(article).toHaveClass("rotate-1");
    expect(container.querySelector(".bg-grape")).toBeInTheDocument();
  });
});
