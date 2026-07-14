import { render, screen } from "@testing-library/react";
import { HashProgress } from "./HashProgress";

describe("HashProgress", () => {
  it("renders a progress bar", () => {
    render(<HashProgress bytesHashed={50} totalBytes={100} />);

    expect(
      screen.getByRole("progressbar", { name: /hash computation progress/i }),
    ).toBeInTheDocument();
  });

  it("shows an ETA once throughput is measurable", () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(
        <HashProgress bytesHashed={0} totalBytes={1000} />,
      );
      expect(screen.queryByText(/left\)/)).not.toBeInTheDocument();

      vi.advanceTimersByTime(2000);
      rerender(<HashProgress bytesHashed={200} totalBytes={1000} />);

      // 200 bytes in 2s, 800 remaining: about 8s.
      expect(screen.getByText(/about 8s left/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
