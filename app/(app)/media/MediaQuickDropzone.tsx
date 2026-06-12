"use client";

import { useRef, useState } from "react";
import { uploadMediaAsset } from "@/services/media/upload-media-asset";
import { SubmitButton } from "@/shared/ui/SubmitButton";

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} Mo`;
}

export function MediaQuickDropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const totalSelectedSize = selectedFiles.reduce(
    (total, file) => total + file.size,
    0,
  );

  function setFiles(files: File[]) {
    setSelectedFiles(files);

    if (!fileInputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();

    for (const file of files) {
      dataTransfer.items.add(file);
    }

    fileInputRef.current.files = dataTransfer.files;
  }

  return (
    <form
      action={uploadMediaAsset}
      className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <input name="primary_file_index" type="hidden" value="0" />
      <div
        className={`rounded-md border border-dashed p-6 text-center transition ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--background)]"
            : "border-[var(--border)]"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          setFiles(Array.from(event.dataTransfer.files));
        }}
        role="button"
        tabIndex={0}
      >
        <p className="text-sm font-semibold">Cliquez ou déposez vos médias ici</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Import rapide depuis la bibliothèque. Pour compléter les métadonnées
          avant import, utilisez “Ajouter un média”.
        </p>
        <input
          className="sr-only"
          multiple
          name="files"
          onChange={(event) => {
            setFiles(Array.from(event.currentTarget.files ?? []));
          }}
          ref={fileInputRef}
          required
          type="file"
        />
      </div>

      {selectedFiles.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            {selectedFiles.length} fichier{selectedFiles.length > 1 ? "s" : ""} ·{" "}
            {formatFileSize(totalSelectedSize)}
          </p>
          <SubmitButton
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Import en cours..."
          >
            Importer la sélection
          </SubmitButton>
        </div>
      ) : null}
    </form>
  );
}
