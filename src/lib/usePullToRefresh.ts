"use client";

import { useEffect, useRef, useState } from "react";

const THRESHOLD = 70;
const MAX_PULL = 110;
const RESISTANCE = 0.5;

/**
 * Puxar para baixo no topo da área rolável recarrega o app.
 * Só o conteúdo rolável se move — cabeçalho e barra de abas ficam fixos.
 */
export function usePullToRefresh(
  scrollRef: React.RefObject<HTMLElement | null>,
  onRefresh: () => void | Promise<void>,
  enabled = true
) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const pullRef = useRef(0);
  const startYRef = useRef(0);
  const trackingRef = useRef(false);
  const refreshingRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) return;

    const setPullValue = (v: number) => {
      pullRef.current = v;
      setPull(v);
    };

    const onStart = (e: TouchEvent) => {
      if (refreshingRef.current || el.scrollTop > 0) return;
      startYRef.current = e.touches[0].clientY;
      trackingRef.current = true;
    };

    const onMove = (e: TouchEvent) => {
      if (!trackingRef.current) return;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy <= 0 || el.scrollTop > 0) {
        setPullValue(0);
        return;
      }
      if (e.cancelable) e.preventDefault();
      setPullValue(Math.min(MAX_PULL, dy * RESISTANCE));
    };

    const onEnd = async () => {
      if (!trackingRef.current) return;
      trackingRef.current = false;
      if (pullRef.current >= THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPullValue(THRESHOLD);
        try {
          await onRefresh();
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          setPullValue(0);
        }
      } else {
        setPullValue(0);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [scrollRef, onRefresh, enabled]);

  return { pull, refreshing, threshold: THRESHOLD };
}
