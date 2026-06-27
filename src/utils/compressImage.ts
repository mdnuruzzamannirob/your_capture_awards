/**
 * Client-side image compression to prevent HTTP 413 "Entity Too Large" errors.
 *
 * Strategy:
 *  1. If the file is already within `maxSizeBytes`, return it unchanged.
 *  2. Otherwise, draw the image onto a canvas (optionally down-scaling
 *     resolution to `maxDimension`) and re-encode as JPEG at `quality`.
 *  3. If the compressed blob is somehow *larger* than the original, fall back
 *     to returning the original file untouched.
 *
 * @param file          The File object picked by the user.
 * @param maxSizeBytes  Threshold in bytes above which compression runs.
 *                      Default: 2 MB (2 * 1024 * 1024).
 * @param maxDimension  Maximum width/height in pixels before down-scaling.
 *                      Default: 3000 px.
 * @param quality       JPEG encode quality (0–1). Default: 0.82.
 * @returns             A Promise that resolves to the (possibly compressed) File.
 */
export const compressImage = (
  file: File,
  maxSizeBytes = 2 * 1024 * 1024,
  maxDimension = 3000,
  quality = 0.82,
): Promise<File> => {
  return new Promise((resolve) => {
    // Already small enough — skip canvas round-trip entirely.
    if (file.size <= maxSizeBytes) {
      resolve(file);
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => resolve(file); // fail-safe
    reader.onload = (evt) => {
      const src = evt.target?.result as string;
      if (!src) { resolve(file); return; }

      const img = new window.Image();
      img.onerror = () => resolve(file); // fail-safe
      img.onload = () => {
        let { width, height } = img;

        // Down-scale if either dimension exceeds the limit.
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              // Keep the original extension in the name but force .jpg MIME.
              const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
              resolve(new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() }));
            } else {
              // Compression made things worse — return original.
              resolve(file);
            }
          },
          'image/jpeg',
          quality,
        );
      };
      img.src = src;
    };

    reader.readAsDataURL(file);
  });
};
