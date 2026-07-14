import { createSHA256 } from "hash-wasm";

export const CHUNK_SIZE = 8 * 1024 * 1024; // 8 MB

export interface HashFileOptions {
  onProgress?: (bytesHashed: number, totalBytes: number) => void;
  chunkSize?: number;
}

/**
 * Incrementally hash `file` and resolve with the lowercase hex SHA-256 digest.
 *
 * @param file - The file to hash.
 * @param options - The options for the hash operation.
 * @param options.onProgress - A callback function that will be called with the current progress of the hash operation.
 * @param options.chunkSize - The size of the chunks to hash. Defaults to 8 MB.
 * @returns The lowercase hex SHA-256 digest of the file.
 */
export async function hashFile(
  file: File,
  options: HashFileOptions = {},
): Promise<string> {
  const chunkSize = options.chunkSize ?? CHUNK_SIZE;
  const totalBytes = file.size;
  let offset = 0;

  const hasher = await createSHA256();
  hasher.init();

  while (offset < totalBytes) {
    const chunk = file.slice(offset, offset + chunkSize);
    const arrayBuffer = await chunk.arrayBuffer();
    hasher.update(new Uint8Array(arrayBuffer));
    offset += chunkSize;
    options.onProgress?.(Math.min(offset, totalBytes), totalBytes);
  }
  return hasher.digest("hex");
}
