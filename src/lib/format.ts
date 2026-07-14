/**
 * This function converts a number of bytes into a human-readable string representing the size.
 * It handles up to GB.
 *
 * @param bytes - The number of bytes to convert.
 * @returns A string representing the size in a human-readable format.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 0) {
    throw new Error("Bytes cannot be negative");
  } else if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

/**
 * This function converts a number of seconds into a human-readable string representing the time.
 * It handles up to minutes.
 *
 * @param seconds - The number of seconds to convert.
 * @returns A string representing the time in a human-readable format.
 */
/**
 * Normalizes a user-pasted checksum for comparison: trims whitespace and
 * lowercases, so "ABC123 " matches "abc123".
 *
 * @param value - The raw pasted checksum.
 * @returns The normalized checksum, empty string if nothing was pasted.
 */
export function normalizeHash(value: string): string {
  return value.trim().toLowerCase();
}

export function formatEta(seconds: number): string {
  if (seconds < 0) {
    throw new Error("Seconds cannot be negative");
  }
  const rounded = Math.round(seconds);
  if (rounded < 60) {
    return `${rounded}s`;
  }
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
