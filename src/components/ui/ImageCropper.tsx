'use client';

import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';

type CropShape = 'circle' | 'square' | 'banner';

interface ImageCropperProps {
  src: string;
  aspectRatio: number;
  targetWidth: number;
  targetHeight: number;
  onCrop: (file: File, preview: string) => void;
  onCancel: () => void;
  originalFile: File;
  title?: string;
  description?: string;
  shape?: CropShape;
}

interface CropBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Handle = 'move' | 'nw' | 'ne' | 'sw' | 'se';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const MIN_BOX_W = 0.18;

export function ImageCropper({
  src,
  aspectRatio,
  targetWidth,
  targetHeight,
  onCrop,
  onCancel,
  originalFile,
}: ImageCropperProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [natW, setNatW] = useState(0);
  const [natH, setNatH] = useState(0);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [imageRect, setImageRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [box, setBox] = useState<CropBox>({ x: 0.16, y: 0.16, w: 0.68, h: 0.68 });
  const [processing, setProcessing] = useState(false);
  const [dragSession, setDragSession] = useState<{
    mode: Handle;
    x: number;
    y: number;
    box: CropBox;
  } | null>(null);

  const imageAspect = imageRect.h > 0 ? imageRect.w / imageRect.h : aspectRatio;
  const boxRatio = aspectRatio / imageAspect;

  const boxInitializedRef = useRef(false);

  // ── Stage measurement ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setStage({ w: width, h: height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Reset on src / aspectRatio change ─────────────────────────────────────
  useEffect(() => {
    boxInitializedRef.current = false;
    setNatW(0);
    setNatH(0);
    setBox({ x: 0.16, y: 0.16, w: 0.68, h: 0.68 });
  }, [src, aspectRatio]);

  // ── Compute imageRect + initial box ───────────────────────────────────────
  useEffect(() => {
    if (!natW || !natH || !stage.w || !stage.h) return;

    const imgRatio = natW / natH;
    const stageRatio = stage.w / stage.h;
    let w: number,
      h: number,
      x = 0,
      y = 0;

    if (imgRatio > stageRatio) {
      w = stage.w;
      h = stage.w / imgRatio;
      y = (stage.h - h) / 2;
    } else {
      h = stage.h;
      w = stage.h * imgRatio;
      x = (stage.w - w) / 2;
    }

    setImageRect({ x, y, w, h });

    if (!boxInitializedRef.current) {
      boxInitializedRef.current = true;
      const bRatio = aspectRatio / imgRatio;
      let bw = 1;
      let bh = bw / bRatio;
      if (bh > 1) {
        bh = 1;
        bw = bh * bRatio;
      }
      setBox({ x: (1 - bw) / 2, y: (1 - bh) / 2, w: bw, h: bh });
    }
  }, [natW, natH, stage.w, stage.h, aspectRatio]);

  const onLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNatW(img.naturalWidth);
    setNatH(img.naturalHeight);
  };

  const boxToPx = (next: CropBox) => ({
    x: imageRect.x + next.x * imageRect.w,
    y: imageRect.y + next.y * imageRect.h,
    w: next.w * imageRect.w,
    h: next.h * imageRect.h,
  });

  const clampBox = (next: CropBox): CropBox => {
    let w = clamp(next.w, MIN_BOX_W, 1);
    let h = w / boxRatio;
    if (h > 1) {
      h = 1;
      w = h * boxRatio;
      w = clamp(w, MIN_BOX_W, 1);
      h = w / boxRatio;
    }
    const maxX = Math.max(0, 1 - w);
    const maxY = Math.max(0, 1 - h);
    return { x: clamp(next.x, 0, maxX), y: clamp(next.y, 0, maxY), w, h };
  };

  // ── Wheel zoom ─────────────────────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    // scroll up (deltaY < 0) → enlarge frame; scroll down → shrink
    const factor = e.deltaY < 0 ? 1.06 : 0.94;
    setBox((prev) => {
      const w = prev.w * factor;
      const h = w / boxRatio;
      return clampBox({
        w,
        h,
        x: prev.x + (prev.w - w) / 2,
        y: prev.y + (prev.h - h) / 2,
      });
    });
  };

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const startDrag =
    (mode: Handle) => (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragSession({ mode, x: e.clientX, y: e.clientY, box: { ...box } });
      e.currentTarget.setPointerCapture(e.pointerId);
    };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragSession || !imageRect.w || !imageRect.h) return;
    const dx = (e.clientX - dragSession.x) / imageRect.w;
    const dy = (e.clientY - dragSession.y) / imageRect.h;
    const snap = dragSession.box;

    if (dragSession.mode === 'move') {
      setBox(clampBox({ ...snap, x: snap.x + dx, y: snap.y + dy }));
      return;
    }

    const next = { ...snap };
    const resizeFromCorner = (anchorX: number, anchorY: number, dxSign: number, dySign: number) => {
      const wFromDx = snap.w + dx * dxSign;
      const wFromDy = (snap.h + dy * dySign) * boxRatio;
      next.w = clamp(Math.min(wFromDx, wFromDy), MIN_BOX_W, 1);
      next.h = next.w / boxRatio;
      next.x = anchorX ? snap.x + snap.w - next.w : snap.x;
      next.y = anchorY ? snap.y + snap.h - next.h : snap.y;
    };

    if (dragSession.mode === 'nw') resizeFromCorner(1, 1, -1, -1);
    if (dragSession.mode === 'ne') resizeFromCorner(0, 1, 1, -1);
    if (dragSession.mode === 'sw') resizeFromCorner(1, 0, -1, 1);
    if (dragSession.mode === 'se') resizeFromCorner(0, 0, 1, 1);

    setBox(clampBox(next));
  };

  const onPointerUp = () => setDragSession(null);

  // ── Confirm crop ──────────────────────────────────────────────────────────
  const confirm = async () => {
    setProcessing(true);
    try {
      const img = imgRef.current;
      if (!img || !natW || !natH || !imageRect.w || !imageRect.h) return;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const px = boxToPx(box);
      const sx = ((px.x - imageRect.x) / imageRect.w) * natW;
      const sy = ((px.y - imageRect.y) / imageRect.h) * natH;
      const sw = (px.w / imageRect.w) * natW;
      const sh = (px.h / imageRect.h) * natH;

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

      const mime = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false);
            return;
          }
          const previewUrl = URL.createObjectURL(blob);
          onCrop(
            new File([blob], originalFile.name, { type: mime, lastModified: Date.now() }),
            previewUrl,
          );
          setProcessing(false);
        },
        mime,
        0.94,
      );
    } catch {
      setProcessing(false);
    }
  };

  const pxBox = boxToPx(box);

  return (
    <div className="space-y-3">
      {/* ── Stage ── */}
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden bg-zinc-950 ring-1 ring-white/10"
        style={{ aspectRatio, touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="crop source"
          onLoad={onLoad}
          draggable={false}
          className="absolute select-none"
          style={{
            left: imageRect.x,
            top: imageRect.y,
            width: imageRect.w,
            height: imageRect.h,
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-black/15" />

        {imageRect.w > 0 && (
          <div
            className="absolute cursor-move"
            style={{ left: pxBox.x, top: pxBox.y, width: pxBox.w, height: pxBox.h }}
            onPointerDown={startDrag('move')}
          >
            {/* Frame border + dim overlay */}
            <div className="absolute inset-0 border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />

            {/* Rule-of-thirds grid */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute inset-y-0 left-1/3 w-px bg-white" />
              <div className="absolute inset-y-0 left-2/3 w-px bg-white" />
              <div className="absolute inset-x-0 top-1/3 h-px bg-white" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-white" />
            </div>

            {/* Corner handles */}
            {(['nw', 'ne', 'sw', 'se'] as Handle[]).map((h) => (
              <button
                key={h}
                type="button"
                aria-label={`Resize from ${h}`}
                onPointerDown={startDrag(h)}
                className={cn(
                  'bg-primary absolute size-4 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110',
                  h === 'nw' && '-top-2 -left-2',
                  h === 'ne' && '-top-2 -right-2',
                  h === 'sw' && '-bottom-2 -left-2',
                  h === 'se' && '-right-2 -bottom-2',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-2 pt-0.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-[13px] text-zinc-300 transition hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={processing || !natW}
          className="bg-primary hover:bg-primary/90 rounded-sm px-5 py-2 text-[13px] font-semibold text-white shadow-[0_2px_12px_-3px_rgba(252,102,0,0.5)] transition hover:shadow-[0_2px_16px_-3px_rgba(252,102,0,0.6)] disabled:opacity-50 disabled:shadow-none"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 animate-spin rounded-sm border border-white/30 border-t-white" />
              Applying…
            </span>
          ) : (
            'Apply crop'
          )}
        </button>
      </div>
    </div>
  );
}
