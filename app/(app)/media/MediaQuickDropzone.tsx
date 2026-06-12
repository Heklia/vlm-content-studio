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
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const totalSelectedSize = selectedFiles.reduce(
    (total, file) => total + file.size,
    0,
  );

  function setFiles(files: File[], options?: { autoSubmit?: boolean }) {
    if (files.length === 0) {
      return;
    }

    setSelectedFiles(files);

    if (!fileInputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();

    for (const file of files) {
      dataTransfer.items.add(file);
    }

    fileInputRef.current.files = dataTransfer.files;

    if (options?.autoSubmit) {
      setIsAutoSubmitting(true);
      window.setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 0);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <form
      action={uploadMediaAsset}
      className="h-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
      ref={formRef}
    >
      <input name="primary_file_index" type="hidden" value="0" />
      <div
        className={`flex min-h-32 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--background)]"
            : "border-[var(--border)]"
        }`}
        onClick={(event) => {
          if (event.target === fileInputRef.current) {
            return;
          }

          openFilePicker();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
          setFiles(Array.from(event.dataTransfer.files), { autoSubmit: true });
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <p className="text-sm font-semibold">Cliquez ou déposez vos médias ici</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Les fichiers sont importés automatiquement dans la bibliothèque. Pour
          compléter les métadonnées avant import, utilisez “Ajouter un média”.
        </p>
        <input
          className="sr-only"
          multiple
          name="files"
          onChange={(event) => {
            setFiles(Array.from(event.currentTarget.files ?? []), {
              autoSubmit: true,
            });
          }}
          onClick={(event) => {
            event.stopPropagation();
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
          {isAutoSubmitting ? (
            <p className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
              Import en cours...
            </p>
          ) : (
            <SubmitButton
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              pendingLabel="Import en cours..."
            >
              Importer la sélection
            </SubmitButton>
          )}
        </div>
      ) : null}
    </form>
  );
}
