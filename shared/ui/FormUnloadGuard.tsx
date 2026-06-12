"use client";

import { useEffect, useRef } from "react";

type FormUnloadGuardProps = {
  draftKey?: string;
  message?: string;
  preventEnterSubmit?: boolean;
};

export function FormUnloadGuard({
  draftKey,
  message = "Des informations sont en cours de saisie. Quitter la page peut les perdre.",
  preventEnterSubmit = true,
}: FormUnloadGuardProps) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const isDirtyRef = useRef(false);
  const hasRestoredRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const form = markerRef.current?.closest("form");

    if (!form) {
      return;
    }

    const getNamedFields = () =>
      Array.from(form.elements).filter(
        (element): element is
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement =>
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement,
      );

    const saveDraft = (options?: { force?: boolean }) => {
      if (!draftKey || (!options?.force && !isDirtyRef.current)) {
        return;
      }

      const draft: Record<string, string | string[]> = {};

      for (const field of getNamedFields()) {
        if (!field.name || field instanceof HTMLInputElement && field.type === "file") {
          continue;
        }

        if (field instanceof HTMLInputElement && field.type === "checkbox") {
          const values = Array.isArray(draft[field.name])
            ? (draft[field.name] as string[])
            : [];

          if (field.checked) {
            values.push(field.value);
          }

          draft[field.name] = values;
          continue;
        }

        if (field instanceof HTMLInputElement && field.type === "radio") {
          if (field.checked) {
            draft[field.name] = field.value;
          }

          continue;
        }

        if (field instanceof HTMLSelectElement && field.multiple) {
          draft[field.name] = Array.from(field.selectedOptions).map(
            (option) => option.value,
          );
          continue;
        }

        draft[field.name] = field.value;
      }

      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    };

    const scheduleSaveDraft = () => {
      if (!draftKey) {
        return;
      }

      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        saveDraft();
      }, 120);
    };

    const restoreDraft = () => {
      if (!draftKey) {
        return;
      }

      const rawDraft = window.localStorage.getItem(draftKey);

      if (!rawDraft) {
        return;
      }

      try {
        const draft = JSON.parse(rawDraft) as Record<string, string | string[]>;

        for (const field of getNamedFields()) {
          if (!field.name || !(field.name in draft)) {
            continue;
          }

          const value = draft[field.name];

          if (field instanceof HTMLInputElement && field.type === "file") {
            continue;
          }

          if (field instanceof HTMLInputElement && field.type === "checkbox") {
            field.checked = Array.isArray(value) && value.includes(field.value);
            continue;
          }

          if (field instanceof HTMLInputElement && field.type === "radio") {
            field.checked = value === field.value;
            continue;
          }

          if (field instanceof HTMLSelectElement && field.multiple) {
            const values = Array.isArray(value) ? value : [value];

            for (const option of Array.from(field.options)) {
              option.selected = values.includes(option.value);
            }

            continue;
          }

          field.value = Array.isArray(value) ? value[0] ?? "" : value;
        }

        isDirtyRef.current = true;
        hasRestoredRef.current = true;
      } catch {
        window.localStorage.removeItem(draftKey);
      }
    };

    const markDirty = () => {
      if (!isSubmittingRef.current) {
        isDirtyRef.current = true;
        scheduleSaveDraft();
      }
    };

    const markSubmitting = () => {
      isSubmittingRef.current = true;
      isDirtyRef.current = false;

      if (draftKey) {
        window.localStorage.removeItem(draftKey);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current || isSubmittingRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = message;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirtyRef.current || isSubmittingRef.current) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a[href]");

      if (!link || form.contains(link)) {
        return;
      }

      const confirmed = window.confirm(message);

      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!preventEnterSubmit || event.key !== "Enter") {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.type !== "submit" &&
        target.type !== "button" &&
        target.type !== "checkbox" &&
        target.type !== "radio"
      ) {
        event.preventDefault();
      }
    };

    const handlePageShow = () => {
      if (!isDirtyRef.current && !hasRestoredRef.current) {
        restoreDraft();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveDraft({ force: isDirtyRef.current });
      }
    };

    restoreDraft();
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    form.addEventListener("submit", markSubmitting);
    form.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      if (!isSubmittingRef.current) {
        saveDraft({ force: isDirtyRef.current });
      }
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
      form.removeEventListener("submit", markSubmitting);
      form.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [draftKey, message, preventEnterSubmit]);

  return <span ref={markerRef} hidden />;
}
