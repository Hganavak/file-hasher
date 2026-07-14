export interface VerifyFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Optional expected-checksum input. Stays usable while a hash runs, which
 * doubles as the proof that hashing never blocks the main thread.
 */
export function VerifyField({ value, onChange }: VerifyFieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor="expected-hash" className="brut-label">
        Verify against a checksum (optional)
      </label>
      <input
        id="expected-hash"
        type="text"
        className="brut-input"
        value={value}
        spellCheck={false}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        placeholder="paste the SHA-256 you were given, e.g. from a release page"
      />
    </div>
  );
}
