"use client";

import { useMemo, useState } from "react";

type MediaSelectorAsset = {
  altText: string | null;
  fileName: string;
  id: string;
  title: string | null;
};

type MediaSelectorProps = {
  mediaAssets: MediaSelectorAsset[];
};

function getMediaLabel(asset: MediaSelectorAsset) {
  return asset.title ?? asset.fileName;
}

export function MediaSelector({ mediaAssets }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [primaryMediaAssetId, setPrimaryMediaAssetId] = useState("");

  const selectedAssets = mediaAssets.filter((asset) =>
    selectedIds.includes(asset.id),
  );

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return mediaAssets;
    }

    return mediaAssets.filter((asset) => {
      const searchableText = [
        asset.fileName,
        asset.title ?? "",
        asset.altText ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [mediaAssets, query]);

  function toggleAsset(assetId: string) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(assetId)) {
        const nextIds = currentIds.filter((id) => id !== assetId);

        if (primaryMediaAssetId === assetId) {
          setPrimaryMediaAssetId(nextIds[0] ?? "");
        }

        return nextIds;
      }

      if (!primaryMediaAssetId) {
        setPrimaryMediaAssetId(assetId);
      }

      return [...currentIds, assetId];
    });
  }

  return (
    <fieldset className="rounded-md border border-[var(--border)] p-4">
      <legend className="px-1 text-sm font-medium">Médias associés</legend>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
        Recherchez par nom de fichier, titre ou texte alternatif. Les médias
        sélectionnés seront associés à la fiche source.
      </p>

      {mediaAssets.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Aucun média disponible. Ajoutez d’abord des médias dans la bibliothèque.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {selectedIds.map((assetId) => (
            <input
              key={assetId}
              name="media_asset_ids"
              type="hidden"
              value={assetId}
            />
          ))}

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setIsOpen(true);
              }}
              placeholder="Rechercher un média par nom ou texte alternatif"
              type="search"
              value={query}
            />
            <button
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium"
              onClick={() => setIsOpen((current) => !current)}
              type="button"
            >
              {isOpen ? "Masquer la liste" : "Afficher la liste"}
            </button>
          </div>

          <p className="text-xs text-[var(--muted)]">
            {selectedIds.length} média{selectedIds.length > 1 ? "s" : ""} sélectionné{selectedIds.length > 1 ? "s" : ""}
          </p>

          {isOpen ? (
            <div className="max-h-72 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
              {filteredAssets.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-[var(--muted)]">
                  Aucun média ne correspond à cette recherche.
                </p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedIds.includes(asset.id);

                    return (
                      <label
                        className="flex cursor-pointer items-start gap-3 px-4 py-3 text-sm hover:bg-[var(--background)]"
                        key={asset.id}
                      >
                        <input
                          checked={isSelected}
                          onChange={() => toggleAsset(asset.id)}
                          type="checkbox"
                        />
                        <span>
                          <span className="block font-medium">
                            {getMediaLabel(asset)}
                          </span>
                          <span className="mt-1 block text-xs text-[var(--muted)]">
                            Fichier : {asset.fileName}
                          </span>
                          <span className="mt-1 block text-xs text-[var(--muted)]">
                            Texte alternatif : {asset.altText ?? "Non renseigné"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {selectedAssets.length > 0 ? (
            <div className="rounded-md border border-[var(--border)] p-4">
              <p className="text-sm font-medium">Médias sélectionnés</p>
              <div className="mt-3 space-y-2">
                {selectedAssets.map((asset) => (
                  <label
                    className="flex items-center gap-3 text-sm"
                    key={asset.id}
                  >
                    <input
                      checked={primaryMediaAssetId === asset.id}
                      name="primary_media_asset_id"
                      onChange={() => setPrimaryMediaAssetId(asset.id)}
                      type="radio"
                      value={asset.id}
                    />
                    <span>
                      {getMediaLabel(asset)}
                      <span className="ml-2 text-xs text-[var(--muted)]">
                        média principal
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </fieldset>
  );
}
