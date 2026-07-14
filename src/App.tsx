import { useState } from "react";
import { FileDropzone } from "@/components/FileDropzone";
import { VerifyField } from "@/components/VerifyField";
import { HashProgress } from "@/components/HashProgress";
import { HashResult } from "@/components/HashResult";
import { HashError } from "@/components/HashError";
import { useFileHash } from "@/hooks/useFileHash";

export interface AppProps {
  createWorker?: () => Worker; // Used to mock the worker for testing
}

const TICKER =
  "No uploads ★ No cloud ★ No tracking ★ SHA-256 ★ Web Worker ★ WASM ★ Works offline ★ ";

const BLURBS = [
  {
    color: "bg-sun",
    tilt: "-rotate-1",
    title: "Nothing gets uploaded",
    body: "Your file is read straight from disk with the File API. Not a single byte of it goes over the network — kill your Wi-Fi mid-hash and it keeps going.",
  },
  {
    color: "bg-bubble",
    tilt: "rotate-1",
    title: "Big files, flat memory",
    body: "The file streams through a WASM hasher in 8 MB chunks, so memory stays flat whether it's 8 KB or 10 GB. Verified against shasum on a 10 GB file.",
  },
  {
    color: "bg-grape",
    tilt: "-rotate-1",
    title: "The page never freezes",
    body: "Hashing runs in a Web Worker, off the main thread. Scroll, type, paste a checksum — the UI stays butter while the worker crunches.",
  },
] as const;

function App({ createWorker }: AppProps) {
  const { state, startHashing, retry } = useFileHash(createWorker);
  const [expectedHash, setExpectedHash] = useState("");

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      {/* Drifting background shapes */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <svg
          viewBox="0 0 100 100"
          className="text-grape animate-float absolute -top-10 -left-16 w-72 opacity-80"
        >
          <path
            d="M10 70 Q 30 10 55 45 T 95 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
        <svg
          viewBox="0 0 64 64"
          className="text-grape animate-float-late absolute top-1/4 -right-10 w-44 opacity-75"
        >
          <path
            d="M32 6 V58 M6 32 H58 M13 13 L51 51 M51 13 L13 51"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <div className="border-grape animate-float absolute bottom-24 -left-14 size-52 rounded-full border-8 opacity-70" />
        <svg
          viewBox="0 0 100 100"
          className="text-bubble animate-float-late absolute -right-20 bottom-4 w-80 opacity-80"
        >
          <path
            d="M5 55 Q 25 95 50 55 T 95 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Ticker */}
      <div
        aria-hidden="true"
        className="bg-ink text-lime border-ink overflow-hidden border-b-3 py-2 whitespace-nowrap"
      >
        <div className="animate-marquee flex w-max">
          <span className="font-display px-2 text-sm tracking-wider uppercase">
            {TICKER.repeat(4)}
          </span>
          <span className="font-display px-2 text-sm tracking-wider uppercase">
            {TICKER.repeat(4)}
          </span>
        </div>
      </div>

      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 pt-8">
        <a
          href="https://icy.dev"
          className="brut-chip bg-sun -rotate-2 transition-transform hover:rotate-0"
          title="Back to icy.dev"
        >
          file—hasher<span className="text-alarm">#</span>
        </a>
        <a
          href="https://icy.dev"
          className="brut-chip rotate-2 transition-transform hover:rotate-0"
        >
          by icy.dev ↗
        </a>
      </header>

      <main className="mx-auto grid w-full max-w-3xl gap-10 px-5 pt-14 pb-20">
        <section className="grid gap-5 text-center">
          <h1 className="font-display text-[clamp(2.9rem,10vw,5.8rem)] leading-[0.95] uppercase">
            Drop file.
            <br />
            <span
              className="text-lime"
              style={{ WebkitTextStroke: "3px #111111" }}
            >
              Get hash.
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg font-medium text-balance">
            SHA-256 for files of any size, computed entirely in your browser.
            Your file never leaves your machine — there is no server to send it
            to.
          </p>
        </section>

        <FileDropzone onFileSelect={startHashing} />

        <VerifyField value={expectedHash} onChange={setExpectedHash} />

        {state.status === "hashing" && (
          <HashProgress
            bytesHashed={state.bytesHashed}
            totalBytes={state.totalBytes}
          />
        )}

        {state.status === "done" && (
          <HashResult
            hash={state.hash}
            fileName={state.file.name}
            fileSize={state.file.size}
            expectedHash={expectedHash}
          />
        )}

        {state.status === "error" && (
          <HashError message={state.message} onRetry={retry} />
        )}

        <section className="grid gap-6 pt-6 sm:grid-cols-3">
          {BLURBS.map((blurb) => (
            <article
              key={blurb.title}
              className={`brut-card ${blurb.tilt} grid content-start gap-3 p-5 transition-transform hover:rotate-0`}
            >
              <div
                className={`${blurb.color} border-ink size-8 rounded-md border-3 shadow-[3px_3px_0_0_#111111]`}
              />
              <h2 className="font-display text-base uppercase">
                {blurb.title}
              </h2>
              <p className="text-sm leading-relaxed font-medium">
                {blurb.body}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-ink bg-ink text-paper border-t-3">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-6">
          <p className="brut-label text-paper">
            Built by{" "}
            <a href="https://icy.dev" className="text-lime underline">
              icy.dev
            </a>
          </p>
          <a
            href="https://github.com/Hganavak/file-hasher"
            className="brut-label text-lime underline"
          >
            source ↗
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
