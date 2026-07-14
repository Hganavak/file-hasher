import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { formatBytes, normalizeHash } from "@/lib/format";

export interface HashResultProps {
  hash: string;
  fileName: string;
  fileSize: number;
  /** Optional user-pasted checksum to verify against. */
  expectedHash: string;
}

/** Completed-hash summary: the hash on a terminal-style chip, plus a
 * MATCH / NO MATCH stamp when an expected checksum was provided. */
export function HashResult({
  hash,
  fileName,
  fileSize,
  expectedHash,
}: HashResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const expected = normalizeHash(expectedHash);
  const verdict = expected ? (expected === hash ? "match" : "mismatch") : null;

  return (
    <section aria-label="Hash result" className="brut-card grid gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl uppercase">SHA-256 result</h2>
        {verdict === "match" && (
          <span className="brut-chip bg-mint -rotate-2">✓ Match</span>
        )}
        {verdict === "mismatch" && (
          <span className="brut-chip bg-alarm text-paper rotate-2">
            ✗ No match
          </span>
        )}
      </div>

      <p className="bg-ink text-lime rounded-lg border-3 border-ink p-4 font-mono text-sm break-all">
        {hash}
      </p>

      {verdict === "mismatch" && (
        <p className="brut-label text-alarm normal-case">
          The computed hash does not equal the checksum you pasted. Different
          file, or a corrupted download.
        </p>
      )}

      <dl className="brut-label grid gap-1 normal-case">
        <div className="flex gap-2">
          <dt>File:</dt>
          <dd className="break-all">{fileName}</dd>
        </div>
        <div className="flex gap-2">
          <dt>Size:</dt>
          <dd>{formatBytes(fileSize)}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="brut-btn min-w-48 justify-self-start"
        aria-label="Copy hash to clipboard"
        onClick={handleCopy}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy hash"}
      </button>
    </section>
  );
}
