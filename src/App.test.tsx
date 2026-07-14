import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeWorkerFactory } from "@/test/fakeWorker";
import App from "./App";

const SHA256_ABC =
  "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

describe("App", () => {
  it("renders the heading, dropzone and verify field", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /drop file\./i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/choose a file to hash/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/verify against a checksum/i),
    ).toBeInTheDocument();
  });

  it("shows progress while hashing, then the hash result", async () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const user = userEvent.setup();
    render(<App createWorker={createWorker} />);
    const file = new File(["abc"], "notes.txt");

    await user.upload(screen.getByLabelText(/choose a file to hash/i), file);

    expect(
      screen.getByRole("progressbar", { name: /hash computation progress/i }),
    ).toBeInTheDocument();

    act(() => {
      workers[0]!.emit({ type: "progress", bytesHashed: 1, totalBytes: 3 });
    });
    expect(screen.getByText(/1 B of 3 B/)).toBeInTheDocument();

    act(() => {
      workers[0]!.emit({ type: "done", hash: SHA256_ABC });
    });

    expect(screen.getByText(SHA256_ABC)).toBeInTheDocument();
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
    expect(screen.getByText("3 B")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows an error with a working retry button when hashing fails", async () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const user = userEvent.setup();
    render(<App createWorker={createWorker} />);
    const file = new File(["abc"], "notes.txt");

    await user.upload(screen.getByLabelText(/choose a file to hash/i), file);

    act(() => {
      workers[0]!.emit({ type: "error", message: "Could not read the file." });
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Hashing failed");
    expect(screen.getByText("Could not read the file.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(workers).toHaveLength(2);
    expect(workers[1]!.postMessage).toHaveBeenCalledWith({
      type: "hash",
      file,
    });

    act(() => {
      workers[1]!.emit({ type: "done", hash: SHA256_ABC });
    });

    expect(screen.getByText(SHA256_ABC)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps the verify field usable while hashing", async () => {
    const { createWorker } = createFakeWorkerFactory();
    const user = userEvent.setup();
    render(<App createWorker={createWorker} />);
    const file = new File(["abc"], "notes.txt");

    await user.upload(screen.getByLabelText(/choose a file to hash/i), file);

    const verify = screen.getByLabelText(/verify against a checksum/i);
    await user.type(verify, "deadbeef");

    expect(verify).toHaveValue("deadbeef");
  });

  it("stamps the result as a match when the pasted checksum equals the hash", async () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const user = userEvent.setup();
    render(<App createWorker={createWorker} />);
    const file = new File(["abc"], "notes.txt");

    await user.upload(screen.getByLabelText(/choose a file to hash/i), file);
    await user.type(
      screen.getByLabelText(/verify against a checksum/i),
      SHA256_ABC,
    );

    act(() => {
      workers[0]!.emit({ type: "done", hash: SHA256_ABC });
    });

    expect(screen.getByText(/✓ match/i)).toBeInTheDocument();
  });
});
