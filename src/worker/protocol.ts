/**
 * Message protocol between the main thread and the hash worker.
 * Both sides narrow on `type` - keep these unions exhaustive.
 */

/** Main thread -> worker */
export type HashRequest = {
  type: "hash";
  file: File;
};

/** Worker -> main thread */
export type HashWorkerMessage =
  | { type: "progress"; bytesHashed: number; totalBytes: number }
  | { type: "done"; hash: string }
  | { type: "error"; message: string };
