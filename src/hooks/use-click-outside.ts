"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

// Closes a dropdown/popover when clicking outside `ref`'s subtree or
// pressing Escape — the standard dismissal pattern for non-modal overlays.
export function useClickOutside(ref: RefObject<HTMLElement | null>, onDismiss: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, onDismiss, enabled]);
}
