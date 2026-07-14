import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

/**
 * File picker + drag-and-drop target.
 */
export function FileDropzone({ onFileSelect, disabled }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleFileDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleFileDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
    setIsDragOver(false);
  };

  return (
    <div
      className={cn(
        "brut-card relative grid gap-5 border-dashed p-10 text-center transition-colors sm:p-14",
        isDragOver && "bg-sun",
      )}
      role="region"
      onDrop={handleFileDrop}
      onDragOver={handleFileDragOver}
      onDragLeave={handleFileDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-label="Choose a file to hash"
        onChange={handleChange}
        disabled={disabled}
      />

      <div
        aria-hidden="true"
        className="absolute -top-9 -right-7 size-24 sm:-top-11 sm:-right-10 sm:size-28"
      >
        <svg
          viewBox="0 0 64 64"
          className="animate-spin-slow size-full drop-shadow-[3px_3px_0_#111111]"
        >
          <polygon
            points="32,2 39,15 53,9 49,24 64,26 53,36 62,49 47,47 44,62 32,51 20,62 17,47 2,49 11,36 0,26 15,24 11,9 25,15"
            className="fill-bubble stroke-ink"
            strokeWidth="2.5"
          />
        </svg>
        <span className="font-display absolute inset-0 grid place-items-center text-[0.6rem] leading-tight uppercase">
          100%
          <br />
          local
        </span>
      </div>

      <p className="font-display text-2xl uppercase sm:text-3xl">
        Drag a file here
      </p>
      <p className="brut-label">any type · any size · never uploaded</p>
      <div>
        <button
          type="button"
          className="brut-btn px-8 py-4 text-lg"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Browse files
        </button>
      </div>
    </div>
  );
}
