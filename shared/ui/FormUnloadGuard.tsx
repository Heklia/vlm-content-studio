"use client";

import { useEffect, useRef } from "react";

type FormUnloadGuardProps = {
  message?: string;
};

export function FormUnloadGuard({
  message = "Des informations sont en cours de saisie. Quitter la page peut les perdre.",
}: FormUnloadGuardProps) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const isDirtyRef = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const form = markerRef.current?.closest("form");

    if (!form) {
      return;
    }

    const markDirty = () => {
      if (!isSubmittingRef.current) {
        isDirtyRef.current = true;
      }
    };

    const markSubmitting = () => {
      isSubmittingRef.current = true;
      isDirtyRef.current = false;
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

    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    form.addEventListener("submit", markSubmitting);
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
      form.removeEventListener("submit", markSubmitting);
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message]);

  return <span ref={markerRef} hidden />;
}
