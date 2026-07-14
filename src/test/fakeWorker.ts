import { vi } from "vitest";
import type { HashWorkerMessage } from "@/worker/protocol";

/**
 * jsdom has no Worker global, so the worker-consuming code takes an injectable
 * factory instead. The FakeWorker class records postMessage/terminate calls and lets
 * tests push protocol messages into the consumer via the emit() method.
 */
export class FakeWorker {
  onmessage: ((event: MessageEvent<HashWorkerMessage>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();

  emit(data: HashWorkerMessage) {
    this.onmessage?.({ data } as MessageEvent<HashWorkerMessage>);
  }
}

/**
 * Per-test factory: `workers` collects every worker the code under test
 * creates, in creation order.
 */
export function createFakeWorkerFactory() {
  const workers: FakeWorker[] = [];
  const createWorker = (): Worker => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker as unknown as Worker;
  };
  return { workers, createWorker };
}
