import { useContext, useState } from "react";
import { storyblokEditable } from "@storyblok/react";
import { FileDropzone } from "@/components/FileDropzone";
import { VerifyField } from "@/components/VerifyField";
import { HashProgress } from "@/components/HashProgress";
import { HashResult } from "@/components/HashResult";
import { HashError } from "@/components/HashError";
import { useFileHash } from "@/hooks/useFileHash";
import { WorkerContext } from "@/storyblok/WorkerContext";
import type { HashToolBlok } from "@/storyblok/types";

export interface HashToolProps {
  blok: HashToolBlok;
}

export function HashTool({ blok }: HashToolProps) {
  const createWorker = useContext(WorkerContext);
  const { state, startHashing, retry } = useFileHash(createWorker);
  const [expectedHash, setExpectedHash] = useState("");

  // `contents` keeps these as direct grid children of <main> so the original
  // gap-10 spacing between the dropzone, verify field and results is preserved.
  return (
    <div {...storyblokEditable(blok)} className="contents">
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
    </div>
  );
}
