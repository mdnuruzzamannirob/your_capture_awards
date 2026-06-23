/**
 * Image processing utilities for client-side auto-cropping and resizing.
 */

interface CropResizeOptions {
  aspectRatio?: number; // width / height
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  targetWidth?: number;
  targetHeight?: number;
}

export function processImage(file: File, options: CropResizeOptions): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      const sourceWidth = img.width;
      const sourceHeight = img.height;
      
      // Calculate crop area if aspect ratio is specified
      let sX = 0;
      let sY = 0;
      let sWidth = sourceWidth;
      let sHeight = sourceHeight;
      
      if (options.aspectRatio) {
        const currentAspect = sourceWidth / sourceHeight;
        if (currentAspect > options.aspectRatio) {
          // Source is wider than target aspect ratio - crop horizontally
          sWidth = sourceHeight * options.aspectRatio;
          sX = (sourceWidth - sWidth) / 2;
        } else if (currentAspect < options.aspectRatio) {
          // Source is taller than target aspect ratio - crop vertically
          sHeight = sourceWidth / options.aspectRatio;
          sY = (sourceHeight - sHeight) / 2;
        }
      }
      
      // Calculate target dimensions
      let dWidth = sWidth;
      let dHeight = sHeight;
      
      if (options.targetWidth && options.targetHeight) {
        dWidth = options.targetWidth;
        dHeight = options.targetHeight;
      } else {
        // Enforce maximum boundaries
        if (options.maxWidth && dWidth > options.maxWidth) {
          const ratio = options.maxWidth / dWidth;
          dWidth = options.maxWidth;
          dHeight = dHeight * ratio;
        }
        if (options.maxHeight && dHeight > options.maxHeight) {
          const ratio = options.maxHeight / dHeight;
          dHeight = options.maxHeight;
          dWidth = dWidth * ratio;
        }
        
        // Enforce minimum boundaries
        if (options.minWidth && dWidth < options.minWidth) {
          const ratio = options.minWidth / dWidth;
          dWidth = options.minWidth;
          dHeight = dHeight * ratio;
        }
        if (options.minHeight && dHeight < options.minHeight) {
          const ratio = options.minHeight / dHeight;
          dHeight = options.minHeight;
          dWidth = dWidth * ratio;
        }
      }
      
      // Draw to canvas
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(dWidth);
      canvas.height = Math.round(dHeight);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }
      
      // Use premium image rendering settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, sX, sY, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      
      // Export back as File
      const mimeType = file.type || 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image blob'));
          return;
        }
        
        const processedFile = new File([blob], file.name, {
          type: mimeType,
          lastModified: Date.now(),
        });
        
        resolve(processedFile);
      }, mimeType, 0.92); // 92% quality jpeg/webp
    };
    img.onerror = () => {
      reject(new Error('Failed to load image file'));
    };
  });
}
