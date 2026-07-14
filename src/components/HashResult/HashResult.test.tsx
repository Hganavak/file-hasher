import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashResult } from "./HashResult";

const SHA256_EMPTY =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

describe("HashResult", () => {
  it("renders hash, file name and size", () => {
    render(
      <HashResult
        hash={SHA256_EMPTY}
        fileName="empty.bin"
        fileSize={0}
        expectedHash=""
      />,
    );

    expect(screen.getByText(SHA256_EMPTY)).toBeInTheDocument();
    expect(screen.getByText("empty.bin")).toBeInTheDocument();
    expect(screen.queryByText(/match/i)).not.toBeInTheDocument();
  });

  it("shows a match stamp when the expected hash matches", () => {
    render(
      <HashResult
        hash={SHA256_EMPTY}
        fileName="empty.bin"
        fileSize={0}
        expectedHash={`  ${SHA256_EMPTY.toUpperCase()}  `}
      />,
    );

    expect(screen.getByText(/✓ match/i)).toBeInTheDocument();
  });

  it("shows a no-match stamp when the expected hash differs", () => {
    render(
      <HashResult
        hash={SHA256_EMPTY}
        fileName="empty.bin"
        fileSize={0}
        expectedHash="deadbeef"
      />,
    );

    expect(screen.getByText(/✗ no match/i)).toBeInTheDocument();
  });

  it("copies the hash to the clipboard", async () => {
    const user = userEvent.setup();
    render(
      <HashResult
        hash={SHA256_EMPTY}
        fileName="empty.bin"
        fileSize={0}
        expectedHash=""
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /copy hash to clipboard/i }),
    );

    expect(await navigator.clipboard.readText()).toBe(SHA256_EMPTY);
  });
});
