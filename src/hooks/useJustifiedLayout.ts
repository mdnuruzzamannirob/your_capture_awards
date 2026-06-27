'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Global cache for image aspect ratios to avoid recalculating or reloading
const aspectCache = new Map<string, number>();

export interface JustifiedRowItem<T> {
  item: T;
  width: number;
  height: number;
}

export interface JustifiedRow<T> {
  items: JustifiedRowItem<T>[];
  height: number;
}

export function useJustifiedLayout<T extends { url?: string; src?: string; id?: string; isUploadCard?: boolean }>({
  items,
  targetHeight = 350,
  gap = 8,
}: {
  items: T[];
  targetHeight?: number;
  gap?: number;
}) {
  // Use state to hold the DOM element so we can react when it changes
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(
    typeof window !== 'undefined' ? (window.innerWidth || 1000) : 1000
  );
  const [loadedAspects, setLoadedAspects] = useState<Record<string, number>>({});

  // Ref callback — fires immediately when the element mounts/unmounts
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerEl(node);
  }, []);

  // 1. Measure width and set up ResizeObserver whenever the element changes
  useEffect(() => {
    if (!containerEl) return;

    const measure = () => {
      const w = containerEl.clientWidth || containerEl.getBoundingClientRect().width || containerEl.offsetWidth;
      if (w > 0) {
        setContainerWidth(w);
      }
    };

    // Measure immediately
    measure();

    // ResizeObserver keeps it reactive on layout changes / sidebar toggles
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // Use clientWidth to ensure scrollbars are excluded, fallback to contentRect
        const w = containerEl.clientWidth || entries[0].contentRect.width;
        if (w > 0) setContainerWidth(w);
      }
    });
    observer.observe(containerEl);

    // Fallback: re-measure after the browser has painted and when layout settles
    const raf = requestAnimationFrame(measure);
    const timeoutId = setTimeout(measure, 100);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, [containerEl]);

  // Helper: initial aspect ratio guess (before the image loads)
  const getInitialAspect = useCallback((item: T): number => {
    if (item.isUploadCard) return 1.4;

    const url = item.url || item.src;
    if (url && aspectCache.has(url)) return aspectCache.get(url)!;

    const id = item.id || '';
    const hardcoded: Record<string, number> = {
      'sunflower-flight': 1.6,
      'little-king': 0.8,
      'bright-smile': 1.25,
      'soft-llama': 1.5,
      'market-rain': 1.0,
      'coastal-glow': 1.77,
    };
    if (hardcoded[id]) return hardcoded[id];

    if (id) {
      const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const palette = [1.3, 0.8, 1.5, 1.0, 1.8, 1.2, 0.9, 1.6];
      return palette[hash % palette.length] ?? 1.4;
    }

    return 1.4;
  }, []);

  // 2. Asynchronously load exact aspect ratios for real images
  useEffect(() => {
    if (!items || items.length === 0) return;
    let active = true;

    items.forEach((item) => {
      if (item.isUploadCard) return;
      const url = item.url || item.src;
      if (!url) return;

      // Already cached globally — just sync local state
      if (aspectCache.has(url)) {
        const cached = aspectCache.get(url)!;
        setLoadedAspects((prev) => {
          if (prev[url] === cached) return prev;
          return { ...prev, [url]: cached };
        });
        return;
      }

      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (!active) return;
        const aspect = img.naturalWidth / img.naturalHeight || 1.4;
        aspectCache.set(url, aspect);
        setLoadedAspects((prev) => ({ ...prev, [url]: aspect }));
      };
      img.onerror = () => {
        if (!active) return;
        aspectCache.set(url, 1.4);
        setLoadedAspects((prev) => ({ ...prev, [url]: 1.4 }));
      };
    });

    return () => { active = false; };
  }, [items]);

  // 3. Partition items into justified rows
  const rows = useMemo(() => {
    if (!items || items.length === 0 || containerWidth <= 0) return [];

    const computedRows: JustifiedRow<T>[] = [];
    let currentRow: { item: T; aspect: number }[] = [];
    let aspectSum = 0;

    for (const item of items) {
      const url = item.url || item.src || '';
      const aspect = item.isUploadCard ? 1.4 : (loadedAspects[url] || getInitialAspect(item));

      currentRow.push({ item, aspect });
      aspectSum += aspect;

      const k = currentRow.length;
      // Justified layout formula: fill the row when the natural height ≤ target
      const rowHeight = (containerWidth - (k - 1) * gap) / aspectSum;

      if (rowHeight <= targetHeight) {
        computedRows.push({
          items: currentRow.map((x) => ({
            item: x.item,
            width: rowHeight * x.aspect,
            height: rowHeight,
          })),
          height: rowHeight,
        });
        currentRow = [];
        aspectSum = 0;
      }
    }

    // Last partial row — cap at targetHeight, don't stretch
    if (currentRow.length > 0) {
      computedRows.push({
        items: currentRow.map((x) => ({
          item: x.item,
          width: targetHeight * x.aspect,
          height: targetHeight,
        })),
        height: targetHeight,
      });
    }

    return computedRows;
  }, [items, containerWidth, loadedAspects, targetHeight, gap, getInitialAspect]);

  return { containerRef, rows, containerWidth };
}
