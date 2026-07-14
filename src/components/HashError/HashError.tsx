export interface HashErrorProps {
  message: string;
  onRetry: () => void;
}

/** Failed-hash card with a retry action. */
export function HashError({ message, onRetry }: HashErrorProps) {
  return (
    <div role="alert" className="brut-card bg-alarm text-paper grid gap-3 p-6">
      <h2 className="font-display text-xl uppercase">Hashing failed</h2>
      <p className="font-mono text-sm">{message}</p>
      <div>
        <button
          type="button"
          className="brut-btn bg-paper text-ink"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
