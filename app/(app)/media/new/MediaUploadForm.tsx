"use client";

import { useRef, useState } from "react";
import { mandatoryAiVisualNotice } from "@/modules/media/domain/media-asset";
import { uploadMediaAsset } from "@/services/media/upload-media-asset";
import { FormField } from "@/shared/ui/FormField";
import { FormUnloadGuard } from "@/shared/ui/FormUnloadGuard";
import { SubmitButton } from "@/shared/ui/SubmitButton";

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} Mo`;
}

export function MediaUploadForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [primaryFileIndex, setPrimaryFileIndex] = useState("0");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalSelectedSize = selectedFiles.reduce((total, file) => total + file.size, 0);

  function setFiles(files: File[]) {
    setSelectedFiles(files);
    setPrimaryFileIndex("0");

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
      className="space-y-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <FormUnloadGuard draftKey="vlm-content-studio:media:new" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
        <div>
          <h2 className="text-lg font-semibold">Importer des médias</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Vous pouvez importer un ou plusieurs fichiers en une seule fois.
          </p>
        </div>
        <SubmitButton
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          pendingLabel="Import en cours..."
        >
          Importer la sélection
        </SubmitButton>
      </div>

      <FormField
        helpText="Sélectionnez un ou plusieurs fichiers. Les images auront un aperçu dans la bibliothèque ; les autres fichiers seront listés par type."
        label="Fichiers à importer"
      >
        <div
          className={`rounded-md border border-dashed p-6 text-center transition ${
            isDragging
              ? "border-[var(--accent)] bg-[var(--background)]"
              : "border-[var(--border)]"
          }`}
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
        >
          <p className="text-sm font-medium">
            Glissez-déposez vos médias ici
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            ou sélectionnez plusieurs fichiers depuis votre ordinateur.
          </p>
          <input
            className="mt-4 w-full rounded-md border border-[var(--border)] px-3 py-2"
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
      </FormField>

      {selectedFiles.length > 0 ? (
        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4 text-sm">
          <p className="font-medium">
            {selectedFiles.length} fichier{selectedFiles.length > 1 ? "s" : ""} sélectionné{selectedFiles.length > 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-[var(--muted)]">
            Poids total : {formatFileSize(totalSelectedSize)}. Limite actuelle de
            l’import : 50 Mo par envoi.
          </p>
        </div>
      ) : null}

      {selectedFiles.length > 1 ? (
        <fieldset className="rounded-md border border-[var(--border)] p-4">
          <legend className="px-1 text-sm font-medium">
            Média principal de l’import
          </legend>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Choisissez le fichier le plus important du lot. Il servira de repère
            pour retrouver rapidement l’import et préparer les futurs contenus.
          </p>
          <div className="mt-3 space-y-2">
            {selectedFiles.map((file, index) => (
              <label className="flex items-center gap-3 text-sm" key={`${file.name}-${index}`}>
                <input
                  checked={primaryFileIndex === String(index)}
                  name="primary_file_index"
                  onChange={() => setPrimaryFileIndex(String(index))}
                  type="radio"
                  value={index}
                />
                <span>{file.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <input name="primary_file_index" type="hidden" value="0" />
      )}

      <FormField
        helpText="Nom lisible du média ou du média principal. Exemple : “Façade en aluminium thermolaqué”. Si plusieurs fichiers sont importés, ce titre sera appliqué au média principal."
        label="Titre"
      >
        <input
          className="w-full rounded-md border border-[var(--border)] px-3 py-2"
          name="title"
          type="text"
        />
      </FormField>

      <FormField
        helpText="Explique le contexte du média : projet, matière, usage, étape de fabrication. Cette description aidera plus tard à rédiger les fiches sources et contenus."
        label="Description"
      >
        <textarea
          className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
          name="description"
        />
      </FormField>

      <FormField
        helpText="Texte utilisé pour l’accessibilité et le référencement. Décrivez concrètement ce que l’on voit, sans slogan. Exemple : “Détail d’un garde-corps en aluminium découpé sur mesure”."
        label="Texte alternatif"
      >
        <input
          className="w-full rounded-md border border-[var(--border)] px-3 py-2"
          name="alt_text"
          type="text"
        />
      </FormField>

      <FormField
        helpText="Indique l’origine ou les droits du média : photographe, atelier, client, banque d’images, outil IA. Ce champ aide à savoir si l’image peut être publiée."
        label="Crédit"
      >
        <input
          className="w-full rounded-md border border-[var(--border)] px-3 py-2"
          name="credit"
          type="text"
        />
      </FormField>

      <label className="flex items-start gap-3 rounded-md border border-[var(--border)] p-4">
        <input className="mt-1" name="is_ai_generated" type="checkbox" />
        <span>
          <span className="block text-sm font-medium">Visuel généré par IA</span>
          <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
            Cochez cette case si le fichier est une image créée ou fortement
            transformée par IA. La mention obligatoire sera conservée avec le
            média.
          </span>
        </span>
      </label>

      <FormField
        helpText="Mention obligatoire pour tout visuel généré par IA. Elle doit accompagner le média lors des futures publications."
        label="Mention IA"
      >
        <textarea
          className="min-h-20 w-full rounded-md border border-[var(--border)] px-3 py-2"
          defaultValue={mandatoryAiVisualNotice}
          name="ai_visual_notice"
        />
      </FormField>

      <div className="flex justify-end border-t border-[var(--border)] pt-5">
        <SubmitButton
          className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          pendingLabel="Import en cours..."
        >
          Importer la sélection
        </SubmitButton>
      </div>
    </form>
  );
}
