/**
 * Worker factory. Kept as a standalone function so useFileHash can accept it
 * as an injectable dependency - jsdom has no Worker global, so tests inject
 * a fake instead.
 */
export function createHashWorker(): Worker {
  return new Worker(new URL("./hash.worker.ts", import.meta.url), {
    type: "module",
  });
}
