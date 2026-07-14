import { useRef } from "react";
import { formatBytes, formatEta } from "@/lib/format";

export interface HashProgressProps {
  bytesHashed: number;
  totalBytes: number;
}

/** Do not show an ETA until at least 1s has elapsed. */
const MIN_ELAPSED_MS = 1000;

/**
 * Progress bar for an in-flight hash computation, with throughput and an
 * ETA based on average speed since the start. A rolling window would track
 * speed changes (cold cache, throttling) better; good enough for now.
 */
export function HashProgress({ bytesHashed, totalBytes }: HashProgressProps) {
  const startTimeRef = useRef(Date.now());
  const lastBytesRef = useRef(bytesHashed);

  if (bytesHashed < lastBytesRef.current) {
    // Progress went backwards, so a new file started: restart the clock.
    startTimeRef.current = Date.now();
  }
  lastBytesRef.current = bytesHashed;

  const elapsedMs = Date.now() - startTimeRef.current;
  const measurable = bytesHashed > 0 && elapsedMs >= MIN_ELAPSED_MS;
  const etaSeconds = measurable
    ? ((totalBytes - bytesHashed) * elapsedMs) / bytesHashed / 1000
    : null;
  const bytesPerSecond = measurable ? (bytesHashed / elapsedMs) * 1000 : null;

  const percent = totalBytes > 0 ? (bytesHashed / totalBytes) * 100 : 0;

  return (
    <div className="brut-card grid gap-4 p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-xl uppercase">Crunching…</p>
        <p className="font-display text-xl tabular-nums">
          {Math.floor(percent)}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Hash computation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.floor(percent)}
        className="border-ink bg-paper h-8 overflow-hidden rounded-lg border-3"
      >
        <div
          className="bg-sun border-ink h-full border-r-3 transition-[width] duration-150"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="brut-label flex flex-wrap justify-between gap-2 normal-case">
        <span>
          Hashing... {formatBytes(bytesHashed)} of {formatBytes(totalBytes)}
          {etaSeconds !== null && <span> (about {formatEta(etaSeconds)} left)</span>}
        </span>
        {bytesPerSecond !== null && (
          <span>{formatBytes(bytesPerSecond)}/s</span>
        )}
      </p>
    </div>
  );
}
