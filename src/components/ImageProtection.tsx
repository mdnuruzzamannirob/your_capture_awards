'use client';

import { useEffect } from 'react';

const ImageProtection = () => {
  useEffect(() => {
    const isImageTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement && target.tagName === 'IMG';

    const blockContextMenu = (e: MouseEvent) => {
      if (isImageTarget(e.target)) {
        e.preventDefault();
      }
    };

    const blockDragStart = (e: DragEvent) => {
      if (isImageTarget(e.target)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('dragstart', blockDragStart);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('dragstart', blockDragStart);
    };
  }, []);

  return null;
};

export default ImageProtection;
