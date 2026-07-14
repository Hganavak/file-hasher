import { formatBytes, formatEta, normalizeHash } from "./format";

describe("normalizeHash", () => {
  it("trims whitespace and lowercases", () => {
    expect(normalizeHash("  ABC123\n")).toBe("abc123");
  });

  it("returns an empty string for blank input", () => {
    expect(normalizeHash("   ")).toBe("");
  });
});

describe("formatBytes", () => {
  it("formats small values in bytes", () => {
    expect(formatBytes(42)).toBe("42 B");
  });

  it("formats KB / MB / GB with one decimal", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1.0 GB");
  });

  it("formats negative values", () => {
    expect(() => formatBytes(-1)).toThrow("Bytes cannot be negative");
  });
});

describe("formatEta", () => {
  it("formats whole seconds", () => {
    expect(formatEta(9.6)).toBe("10s");
  });

  it("formats negative values", () => {
    expect(() => formatEta(-1)).toThrow("Seconds cannot be negative");
  });

  it("formats minutes and seconds for longer durations", () => {
    expect(formatEta(60)).toBe("1m 0s");
    expect(formatEta(120)).toBe("2m 0s");
    expect(formatEta(180)).toBe("3m 0s");
    expect(formatEta(181)).toBe("3m 1s");
  });
});
