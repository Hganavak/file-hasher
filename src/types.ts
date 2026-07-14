/**
 * Application-level state machine for the hashing flow.
 * Discriminated union - narrow on `status`.
 */
export type HashState =
  | { status: "idle" }
  | { status: "hashing"; file: File; bytesHashed: number; totalBytes: number }
  | { status: "done"; file: File; hash: string }
  | { status: "error"; file: File; message: string };
