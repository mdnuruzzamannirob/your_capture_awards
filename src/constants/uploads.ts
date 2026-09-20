/**
 * Mirrors the backend's src/shared/uploadFormats.ts. These lists must stay in
 * sync with it and with the dashboard's lib/constants/uploads.ts - if a client
 * offers a format the server rejects, the user picks a file and then gets an
 * "unsupported format" error they could not have predicted.
 */

/** Photography: contest entries, trades and the user's photo pool. */
export const PHOTO_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/tiff',
] as const;

/** Imagery rendered directly in an <img>: avatars, covers, team badges. */
export const WEB_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

// SVG is intentionally absent: it can carry script and is served from our own
// domain. Never add it to either list.

/**
 * `image/jpg` is not a real media type, but some browsers report it for a .jpg.
 * The backend normalizes the same aliases, so accepting them here keeps an
 * ordinary photo from being rejected before it is ever sent.
 */
const MIME_TYPE_ALIASES: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
};

export const normalizeImageMimeType = (mimeType: string) => {
  const normalized = mimeType.trim().toLowerCase();
  return MIME_TYPE_ALIASES[normalized] || normalized;
};

/**
 * Value for an <input type="file"> accept attribute. The alias types are listed
 * too so the OS file picker does not grey out a file the app would accept.
 */
const toAcceptAttribute = (mimeTypes: readonly string[]) =>
  [...mimeTypes, 'image/jpg'].join(',');

export const PHOTO_UPLOAD_ACCEPT = toAcceptAttribute(PHOTO_UPLOAD_MIME_TYPES);
export const WEB_IMAGE_ACCEPT = toAcceptAttribute(WEB_IMAGE_MIME_TYPES);

const toLabel = (mimeTypes: readonly string[]) =>
  mimeTypes
    .map((mimeType) => mimeType.replace('image/', '').toUpperCase())
    .join(', ');

export const PHOTO_UPLOAD_LABEL = toLabel(PHOTO_UPLOAD_MIME_TYPES);
export const WEB_IMAGE_LABEL = toLabel(WEB_IMAGE_MIME_TYPES);

export const isPhotoUploadFile = (file: File) =>
  (PHOTO_UPLOAD_MIME_TYPES as readonly string[]).includes(normalizeImageMimeType(file.type));

export const isWebImageFile = (file: File) =>
  (WEB_IMAGE_MIME_TYPES as readonly string[]).includes(normalizeImageMimeType(file.type));

/**
 * Returns an error message when the file is not an acceptable image, or null
 * when it is. `accepts` picks which of the two lists applies.
 */
export const getImageFileError = (
  file: File,
  accepts: 'photo' | 'web' = 'photo',
): string | null => {
  const allowed = accepts === 'photo' ? isPhotoUploadFile(file) : isWebImageFile(file);
  if (allowed) return null;

  const label = accepts === 'photo' ? PHOTO_UPLOAD_LABEL : WEB_IMAGE_LABEL;
  return `Only image files are allowed. Please choose a ${label} file.`;
};
