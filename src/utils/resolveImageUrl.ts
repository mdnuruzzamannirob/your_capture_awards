const LOCAL_ASSET_PREFIXES = ['/images/', '/icons/', '/favicon'];

// encodeURI is not idempotent (it escapes "%" itself), and this resolver is
// sometimes called more than once on the same already-resolved URL. Decoding
// first makes repeated calls converge instead of double-encoding into a
// broken path (e.g. "%20" -> "%2520").
function safeEncodeURI(url: string) {
  try {
    return encodeURI(decodeURI(url));
  } catch {
    return encodeURI(url);
  }
}

function getApiAssetBase() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) return apiUrl.replace(/\/$/, '');

  const apiUrlV1 = process.env.NEXT_PUBLIC_API_URL_V1;
  if (apiUrlV1) return apiUrlV1.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '');

  return '';
}

export function resolveImageUrl(value?: string | null) {
  if (!value) return '';

  let url = value.trim();
  const markdownUrl = url.match(/\]\(([^)]+)\)/)?.[1];
  if (markdownUrl) url = markdownUrl.trim();

  // API values sometimes arrive as Markdown/link-escaped URLs, e.g. "\&" or "\_".
  // Remove those escape slashes without turning valid URL characters into path separators.
  url = url.replace(/\\([()[\]_*&?#=.:/-])/g, '$1');

  if (!url) return '';
  if (/^(data:|blob:)/i.test(url)) return url;
  if (/^https?:/i.test(url)) return safeEncodeURI(url);
  if (url.startsWith('//')) return `https:${safeEncodeURI(url)}`;

  url = url.replace(/\\/g, '/');

  if (LOCAL_ASSET_PREFIXES.some((prefix) => url.startsWith(prefix))) {
    return safeEncodeURI(url);
  }

  const apiAssetBase = getApiAssetBase();
  if (!apiAssetBase) return safeEncodeURI(url.startsWith('/') ? url : `/${url}`);

  return safeEncodeURI(`${apiAssetBase}${url.startsWith('/') ? url : `/${url}`}`);
}
