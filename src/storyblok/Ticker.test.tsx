import { render } from "@testing-library/react";
import { Ticker } from "./Ticker";
import type { TickerBlok } from "@/storyblok/types";

const blok: TickerBlok = {
  _uid: "ticker-test",
  component: "ticker",
  text: "No uploads ★ ",
};

describe("Ticker", () => {
  it("repeats the phrase across duplicated marquee spans", () => {
    const { container } = render(<Ticker blok={blok} />);

    const spans = container.querySelectorAll("span");
    expect(spans).toHaveLength(2);
    spans.forEach((span) =>
      expect(span.textContent).toBe(blok.text.repeat(4)),
    );
  });
});
