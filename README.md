# file-hasher

**[hash.icy.dev](https://hash.icy.dev)** — hash and verify files of any size, entirely in your browser.

Drop a file, get its SHA-256. Optionally paste the checksum you were given (from a release page, a mirror, an email) and get a big MATCH / NO MATCH verdict. Nothing is ever uploaded: the file streams from disk through a WASM hasher inside a Web Worker, so there is no server, no network request carrying your data, and no size limit worth mentioning — memory stays flat whether the file is 8 KB or 10 GB.

## How it works

- **Streaming**: the file is read in 8 MB chunks via `File.slice()` and fed to an incremental SHA-256 hasher ([hash-wasm](https://github.com/Daninet/hash-wasm)). Memory usage is constant regardless of file size. Verified against `shasum -a 256` on a 10 GB file.
- **Off the main thread**: hashing runs in a Web Worker, so the page never blocks — the verify field stays typable mid-hash, which is covered by an integration test.
- **Zero upload**: there is no backend. The site is static files; your data never leaves the `File` API.

## Architecture

Four layers, each testable on its own:

- `src/worker/hashFile.ts` — pure chunked hashing loop (slice file, read chunk, feed hasher, report progress)
- `src/worker/hash.worker.ts` — thin worker shell, receives the file via postMessage, posts back throttled progress and the result
- `src/hooks/useFileHash/` — owns the worker lifecycle and exposes a state machine (idle / hashing / done / error)
- `src/components/` — dumb components that render whatever state the hook is in

The worker protocol is a discriminated union (`src/worker/protocol.ts`), so both sides narrow on `type` and typos are compile errors.

## Design decisions

- WebCrypto's `crypto.subtle.digest` is one-shot and would need the whole file in memory, so hash-wasm's incremental API wins for large files.
- Worker communication is a small typed postMessage protocol — no Comlink, no dependency.
- Single worker: SHA-256 is sequential by construction, so splitting one file across workers can't speed it up.
- Checksum comparison is whitespace- and case-insensitive, because real-world checksum pages disagree about both.

## Testing

- `hashFile` is tested against an independent WebCrypto oracle, plus known SHA-256 vectors (empty file, "abc") and a chunk boundary case.
- jsdom has no Worker, so the hook and App take an injectable worker factory. Tests inject a `FakeWorker` (`src/test/fakeWorker.ts`) and push protocol messages into it.
- App-level integration tests cover the full flows: file → progress → hash, error → retry → success, verify-field match stamp, and typing mid-hash.

## Development

```bash
npm install
npm run dev        # start dev server
npm run test       # run tests in watch mode
npm run test:run   # run tests once
npm run build      # typecheck + production build
```

---

Built by [icy.dev](https://icy.dev).
