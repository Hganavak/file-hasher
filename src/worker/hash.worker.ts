/**
 * Thin worker shell: receives a HashRequest, runs the pure hashFile loop,
 * posts throttled progress and the final result back to the main thread.
 */
import { hashFile } from "./hashFile";
import type { HashRequest, HashWorkerMessage } from "./protocol";

const post = (message: HashWorkerMessage) => self.postMessage(message);
const THROTTLE_INTERVAL = 100;

// The hook can terminate the worker if a new file is hashed.
self.onmessage = async (event: MessageEvent<HashRequest>) => {
  if (event.data.type !== "hash") return;
  let lastProgressPost = Date.now();

  try {
    const hash = await hashFile(event.data.file, {
      // Throttle progress posts to avoid flooding the main thread.
      onProgress: (bytesHashed, totalBytes) => {
        const now = Date.now();
        if (now - lastProgressPost >= THROTTLE_INTERVAL) {
          lastProgressPost = now;
          post({ type: "progress", bytesHashed, totalBytes });
        }
      },
    });

    // Send the final result to the main thread.
    post({ type: "done", hash });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "NotReadableError"
        ? "Could not read the file. It may have been moved or modified since it was selected."
        : error instanceof Error
          ? error.message
          : "Unknown error";
    post({ type: "error", message });
  }
};
