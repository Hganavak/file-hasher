import { useCallback, useEffect, useRef, useState } from "react";
import type { HashState } from "@/types";
import { createHashWorker } from "@/worker/createHashWorker";
import type { HashRequest, HashWorkerMessage } from "@/worker/protocol";

export interface UseFileHashResult {
  state: HashState;
  startHashing: (file: File) => void;
  retry: () => void;
}

/**
 * Owns the hash worker lifecycle and exposes the HashState machine.
 *
 * @param createWorker - A function that creates a new Worker instance.
 * @returns The UseFileHashResult.
 *
 */
export function useFileHash(
  createWorker: () => Worker = createHashWorker,
): UseFileHashResult {
  const [state, setState] = useState<HashState>({ status: "idle" });
  const workerRef = useRef<Worker | null>(null);

  const startHashing = useCallback(
    (file: File) => {
      workerRef.current?.terminate(); // Terminate any old worker

      const worker = createWorker();
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent<HashWorkerMessage>): void => {
        const message = event.data;

        switch (message.type) {
          case "progress":
            setState({
              status: "hashing",
              file: file,
              bytesHashed: message.bytesHashed,
              totalBytes: message.totalBytes,
            });
            break;
          case "done":
            setState({ status: "done", file: file, hash: message.hash });
            break;
          case "error":
            setState({ status: "error", file: file, message: message.message });
            break;
        }
      };

      worker.onerror = (event: ErrorEvent): void => {
        setState({ status: "error", file: file, message: event.message });
      };

      setState({
        status: "hashing",
        file,
        bytesHashed: 0,
        totalBytes: file.size,
      });
      worker.postMessage({ type: "hash", file } satisfies HashRequest);
    },
    [createWorker],
  );

  const retry = useCallback(() => {
    if (state.status === "error") {
      startHashing(state.file);
    }
  }, [startHashing, state]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return {
    state,
    startHashing,
    retry,
  };
}
