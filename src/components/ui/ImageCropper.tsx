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

const shapeClasses: Record<CropShape, string> = {
  circle: 'rounded-full',
  square: '',
  banner: '',
};

const MIN_BOX_W = 0.18; // minimum box.w in normalised image space

export function ImageCropper({
  src,
  aspectRatio,
  targetWidth,
  targetHeight,
  onCrop,
  onCancel,
  originalFile,
  title = 'Crop image',
  description = 'Drag the crop frame. The aspect ratio is locked.',
  shape = 'square',
}: ImageCropperProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [natW, setNatW] = useState(0);
  const [natH, setNatH] = useState(0);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [imageRect, setImageRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // box coords are fractions of imageRect.w (for x/w) and imageRect.h (for y/h)
  const [box, setBox] = useState<CropBox>({ x: 0.16, y: 0.16, w: 0.68, h: 0.68 });
  const [processing, setProcessing] = useState(false);
  const [dragSession, setDragSession] = useState<{
    mode: Handle;
    x: number;
    y: number;
    box: CropBox;
  } | null>(null);

  const frameClass = shapeClasses[shape];

  /**
   * KEY FIX: boxRatio is the w/h ratio in *normalised image space* that
   * produces the correct pixel aspect ratio.
   *
   * pixel_w / pixel_h = aspectRatio
   * (box.w * imageRect.w) / (box.h * imageRect.h) = aspectRatio
   *  => box.w / box.h = aspectRatio * (imageRect.h / imageRect.w)
   *  => box.w / box.h = aspectRatio / imageAspect
   */
  const imageAspect = imageRect.h > 0 ? imageRect.w / imageRect.h : aspectRatio;
  const boxRatio = aspectRatio / imageAspect; // w/h in normalised image space

  // Tracks whether the optimal initial box has been placed for the current src.
  const boxInitializedRef = useRef(false);

  // ── Stage size measurement ──────────────────────────────────────────────────
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

  // ── Reset when src / aspectRatio changes ────────────────────────────────────
  useEffect(() => {
    boxInitializedRef.current = false;
    setNatW(0);
    setNatH(0);
    setBox({ x: 0.16, y: 0.16, w: 0.68, h: 0.68 }); // temporary placeholder
  }, [src, aspectRatio]);

  // ── Compute imageRect and, once, the optimal initial box ────────────────────
  useEffect(() => {
    if (!natW || !natH || !stage.w || !stage.h) return;

    const imgRatio = natW / natH;
    const stageRatio = stage.w / stage.h;
    let w: number;
    let h: number;
    let x = 0;
    let y = 0;

    if (imgRatio > stageRatio) {
      // Image is wider than the stage → letterbox top/bottom
      w = stage.w;
      h = stage.w / imgRatio;
      y = (stage.h - h) / 2;
    } else {
      // Image is taller than the stage → pillarbox left/right
      h = stage.h;
      w = stage.h * imgRatio;
      x = (stage.w - w) / 2;
    }

    setImageRect({ x, y, w, h });

    // Place the initial crop box only once per src (not on every resize).
    if (!boxInitializedRef.current) {
      boxInitializedRef.current = true;

      // bRatio: normalised w/h needed for the desired pixel crop ratio.
      const bRatio = aspectRatio / imgRatio; // same as aspectRatio / (w/h) above

      // Start as large as possible: fill the full width, derive height.
      let bw = 1;
      let bh = bw / bRatio;

      // If height overflows, fill the full height instead.
      if (bh > 1) {
        bh = 1;
        bw = bh * bRatio;
      }

      setBox({
        x: (1 - bw) / 2,
        y: (1 - bh) / 2,
        w: bw,
        h: bh,
      });
    }
  }, [natW, natH, stage.w, stage.h, aspectRatio]);

  const onLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNatW(img.naturalWidth);
    setNatH(img.naturalHeight);
  };

  /** Convert normalised box → absolute screen pixels for rendering. */
  const boxToPx = (next: CropBox) => ({
    x: imageRect.x + next.x * imageRect.w,
    y: imageRect.y + next.y * imageRect.h,
    w: next.w * imageRect.w,
    h: next.h * imageRect.h,
  });

  /**
   * Clamp the box so that:
   *   • w ∈ [MIN_BOX_W, 1]
   *   • h is always derived from w via boxRatio  →  correct pixel ratio
   *   • box stays inside the image rect
   */
  const clampBox = (next: CropBox): CropBox => {
    let w = clamp(next.w, MIN_BOX_W, 1);
    let h = w / boxRatio;

    // If height overflows the image, constrain by height.
    if (h > 1) {
      h = 1;
      w = h * boxRatio;
      w = clamp(w, MIN_BOX_W, 1);
      h = w / boxRatio;
    }

    const maxX = Math.max(0, 1 - w);
    const maxY = Math.max(0, 1 - h);
    const x = clamp(next.x, 0, maxX);
    const y = clamp(next.y, 0, maxY);

    return { x, y, w, h };
  };

  const startDrag =
    (mode: Handle) => (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragSession({ mode, x: e.clientX, y: e.clientY, box: { ...box } });
      e.currentTarget.setPointerCapture(e.pointerId);
    };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragSession || !imageRect.w || !imageRect.h) return;

    const active = dragSession;
    // Normalise deltas to imageRect dimensions so they match box units.
    const dx = (e.clientX - active.x) / imageRect.w;
    const dy = (e.clientY - active.y) / imageRect.h;
    const snap = active.box;

    if (active.mode === 'move') {
      setBox(clampBox({ ...snap, x: snap.x + dx, y: snap.y + dy }));
      return;
    }

    const next = { ...snap };

    /**
     * Resize from a corner while keeping the pixel aspect ratio locked.
     *
     * anchorX/anchorY: 1 = that edge is fixed (opposite moves), 0 = this edge is fixed.
     * dxSign/dySign:   direction of "growing" for this corner.
     */
    const resizeFromCorner = (anchorX: number, anchorY: number, dxSign: number, dySign: number) => {
      // Proposed new width from horizontal drag
      const wFromDx = snap.w + dx * dxSign;
      // Proposed new width derived from vertical drag (using boxRatio to convert h→w)
      const wFromDy = (snap.h + dy * dySign) * boxRatio;
      // Take the more conservative (smaller) change so neither axis overflows.
      next.w = clamp(Math.min(wFromDx, wFromDy), MIN_BOX_W, 1);
      next.h = next.w / boxRatio; // ← always derives h from w via boxRatio
      // Keep the anchor corner stationary.
      next.x = anchorX ? snap.x + snap.w - next.w : snap.x;
      next.y = anchorY ? snap.y + snap.h - next.h : snap.y;
    };

    if (active.mode === 'nw') resizeFromCorner(1, 1, -1, -1);
    if (active.mode === 'ne') resizeFromCorner(0, 1, 1, -1);
    if (active.mode === 'sw') resizeFromCorner(1, 0, -1, 1);
    if (active.mode === 'se') resizeFromCorner(0, 0, 1, 1);

    setBox(clampBox(next));
  };

  const onPointerUp = () => setDragSession(null);

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
      // Map screen-space box back to natural image pixel coordinates.
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
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-zinc-400">{description}</p>
      </div>

      {/* ── Stage ────────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className={cn(
          'relative w-full overflow-hidden bg-zinc-950 ring-1 ring-white/15',
          frameClass,
        )}
        style={{ aspectRatio }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
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

        {/* Dim background outside the crop box */}
        <div className="pointer-events-none absolute inset-0 bg-black/15" />

        {imageRect.w > 0 && (
          <div
            className="absolute cursor-move"
            style={{
              left: pxBox.x,
              top: pxBox.y,
              width: pxBox.w,
              height: pxBox.h,
              // No CSS aspect-ratio here: pxBox already has the correct pixel ratio.
            }}
            onPointerDown={startDrag('move')} // ← FIX: was `startDrag` (missing mode arg)
          >
            {/* Border + dark overlay outside frame */}
            <div className="absolute inset-0 border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />

            {/* Rule-of-thirds grid */}
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute inset-y-0 left-1/3 w-px bg-white" />
              <div className="absolute inset-y-0 left-2/3 w-px bg-white" />
              <div className="absolute inset-x-0 top-1/3 h-px bg-white" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-white" />
            </div>

            {/* Corner handles */}
            <button
              type="button"
              aria-label="Resize crop from top left"
              onPointerDown={startDrag('nw')}
              className="bg-primary absolute -top-2 -left-2 size-4 rounded-full border-2 border-white shadow"
            />
            <button
              type="button"
              aria-label="Resize crop from top right"
              onPointerDown={startDrag('ne')}
              className="bg-primary absolute -top-2 -right-2 size-4 rounded-full border-2 border-white shadow"
            />
            <button
              type="button"
              aria-label="Resize crop from bottom left"
              onPointerDown={startDrag('sw')}
              className="bg-primary absolute -bottom-2 -left-2 size-4 rounded-full border-2 border-white shadow"
            />
            <button
              type="button"
              aria-label="Resize crop from bottom right"
              onPointerDown={startDrag('se')}
              className="bg-primary absolute -right-2 -bottom-2 size-4 rounded-full border-2 border-white shadow"
            />
          </div>
        )}
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-800 bg-zinc-900/55 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={processing || !natW}
          className="bg-primary hover:bg-primary/90 rounded-lg px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
        >
          {processing ? 'Applying...' : 'Apply'}
        </button>
      </div>
    </div>
  );
}
