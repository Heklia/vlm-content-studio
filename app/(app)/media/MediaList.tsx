"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MediaAsset } from "@/modules/media/domain/media-asset";
import { deleteSelectedMediaAssetsAction } from "@/services/media/delete-media-assets";
import { ConfirmSubmitButton } from "@/shared/ui/ConfirmSubmitButton";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type MediaListAsset = MediaAsset & {
  previewUrl: string | null;
};

type MediaListProps = {
  mediaAssets: MediaListAsset[];
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} Mo`;
}

export function MediaList({ mediaAssets }: MediaListProps) {
  const [query, setQuery] = useState("");
  const [fileType, setFileType] = useState("all");
  const [status, setStatus] = useState("all");
  const [aiFilter, setAiFilter] = useState("all");
  const [primaryFilter, setPrimaryFilter] = useState("all");

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return mediaAssets.filter((asset) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          asset.fileName,
          asset.title ?? "",
          asset.description ?? "",
          asset.altText ?? "",
          asset.credit ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesType = fileType === "all" || asset.fileType === fileType;
      const matchesStatus = status === "all" || asset.status === status;
      const matchesAi =
        aiFilter === "all" ||
        (aiFilter === "yes" && asset.isAiGenerated) ||
        (aiFilter === "no" && !asset.isAiGenerated);
      const matchesPrimary =
        primaryFilter === "all" ||
        (primaryFilter === "yes" && asset.isPrimary) ||
        (primaryFilter === "no" && !asset.isPrimary);

      return (
        matchesQuery &&
        matchesType &&
        matchesStatus &&
        matchesAi &&
        matchesPrimary
      );
    });
  }, [aiFilter, fileType, mediaAssets, primaryFilter, query, status]);

  return (
    <form action={deleteSelectedMediaAssetsAction} className="space-y-4">
      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">
              Recherche
            </span>
            <input
              className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Nom, titre, texte alternatif, crédit..."
              type="search"
              value={query}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">Type</span>
            <select
              className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
              onChange={(event) => setFileType(event.currentTarget.value)}
              value={fileType}
            >
              <option value="all">Tous</option>
              <option value="image">Image</option>
              <option value="video">Vidéo</option>
              <option value="document">Document</option>
              <option value="other">Autre</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">Statut</span>
            <select
              className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
              onChange={(event) => setStatus(event.currentTarget.value)}
              value={status}
            >
              <option value="all">Tous</option>
              <option value="active">Actif</option>
              <option value="archived">Archivé</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">IA</span>
            <select
              className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
              onChange={(event) => setAiFilter(event.currentTarget.value)}
              value={aiFilter}
            >
              <option value="all">Tous</option>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">
              Principal
            </span>
            <select
              className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
              onChange={(event) => setPrimaryFilter(event.currentTarget.value)}
              value={primaryFilter}
            >
              <option value="all">Tous</option>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            {filteredAssets.length} média{filteredAssets.length > 1 ? "s" : ""} affiché{filteredAssets.length > 1 ? "s" : ""}
          </p>
          <ConfirmSubmitButton
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            confirmMessage="Supprimer les médias cochés ? Cette action supprimera aussi les fichiers stockés."
            pendingLabel="Suppression..."
          >
            Supprimer les médias cochés
          </ConfirmSubmitButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-[1400px] text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Sélection</th>
              <th className="px-4 py-3 font-medium">Média</th>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Texte alternatif</th>
              <th className="px-4 py-3 font-medium">Crédit</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Poids</th>
              <th className="px-4 py-3 font-medium">Principal</th>
              <th className="px-4 py-3 font-medium">IA</th>
              <th className="px-4 py-3 font-medium">Mention IA</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Ajouté le</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={13}>
                  Aucun média ne correspond aux filtres.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => (
                <tr className="border-t border-[var(--border)]" key={asset.id}>
                  <td className="px-4 py-3">
                    <input
                      aria-label={`Sélectionner ${asset.title ?? asset.fileName}`}
                      name="media_asset_ids"
                      type="checkbox"
                      value={asset.id}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {asset.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={asset.altText ?? asset.title ?? asset.fileName}
                          className="h-12 w-12 rounded-md object-cover"
                          src={asset.previewUrl}
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--background)] text-xs text-[var(--muted)]">
                          {asset.fileType}
                        </div>
                      )}
                      <div>
                        <Link
                          className="font-medium hover:text-[var(--accent)]"
                          href={`/media/${asset.id}`}
                        >
                          {asset.fileName}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">
                          Modifier la fiche
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{asset.title ?? "Non renseigné"}</td>
                  <td className="max-w-xs px-4 py-3 text-[var(--muted)]">
                    {asset.description ?? "Non renseignée"}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-[var(--muted)]">
                    {asset.altText ?? "Non renseigné"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {asset.credit ?? "Non renseigné"}
                  </td>
                  <td className="px-4 py-3">{asset.fileType}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatFileSize(asset.fileSize)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={asset.isPrimary ? "success" : "muted"}>
                      {asset.isPrimary ? "Oui" : "Non"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={asset.isAiGenerated ? "muted" : "default"}>
                      {asset.isAiGenerated ? "Oui" : "Non"}
                    </StatusBadge>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-[var(--muted)]">
                    {asset.aiVisualNotice ?? "Non applicable"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={asset.status === "active" ? "success" : "muted"}>
                      {asset.status === "active" ? "Actif" : "Archivé"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      new Date(asset.createdAt),
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </form>
  );
}
