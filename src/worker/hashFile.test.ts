import { hashFile } from "./hashFile";

/**
 * Independent implementation: one-shot WebCrypto digest. Fine for small in-memory
 * Used to verify the hashFile implementation.
 */
async function sha256Hex(data: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

describe("hashFile", () => {
  it("hashes an empty file (e3b0c442...)", async () => {
    const file = new File([], "empty.bin");
    const hash = await hashFile(file);
    expect(hash).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  it('hashes "abc" (ba7816bf...)', async () => {
    const file = new File(["abc"], "abc.txt");
    const hash = await hashFile(file);
    expect(hash).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("hashes a file larger than one chunk, crossing the chunk boundary", async () => {
    // Non-uniform bytes so a chunking mistake (skipped/reordered chunk) changes the hash.
    const data = new Uint8Array(1024 * 2 + 1).map((_, i) => i % 256);
    const file = new File([data], "large.bin");

    const expected = await sha256Hex(data);

    const hash = await hashFile(file, { chunkSize: 1024 });
    expect(hash).toBe(expected);
  });

  it("updates progress monotonically up to totalBytes", async () => {
    const chunkSize = 1024;
    const totalBytes = chunkSize * 2 + 1; // 2 full chunks + 1 byte remainder
    const file = new File([new Uint8Array(totalBytes)], "large.bin");
    const progress = vi.fn();

    await hashFile(file, { onProgress: progress, chunkSize });

    expect(progress.mock.calls).toEqual([
      [chunkSize, totalBytes],
      [chunkSize * 2, totalBytes],
      [totalBytes, totalBytes],
    ]);
  });

  it("rejects when a chunk cannot be read", async () => {
    const file = new File(["abc"], "x.bin");
    vi.spyOn(file, "slice").mockReturnValue({
      arrayBuffer: () =>
        Promise.reject(new DOMException("read failed", "NotReadableError")),
    } as unknown as Blob);

    await expect(hashFile(file)).rejects.toThrow("read failed");
  });
});
