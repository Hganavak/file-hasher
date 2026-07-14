import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashError } from "./HashError";

describe("HashError", () => {
  it("renders the error message and a retry button", () => {
    render(<HashError message="File could not be read" onRetry={() => {}} />);

    expect(screen.getByText(/file could not be read/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    render(<HashError message="boom" onRetry={onRetry} />);

    await userEvent.click(screen.getByRole("button", { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
