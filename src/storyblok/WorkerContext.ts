import { createContext } from "react";

export type CreateWorker = () => Worker;

/**
 * Lets tests inject a fake worker factory into the interactive `HashTool` blok,
 * which is rendered dynamically by Storyblok and cannot receive props directly.
 * When undefined, `useFileHash` falls back to the real worker.
 */
export const WorkerContext = createContext<CreateWorker | undefined>(undefined);
