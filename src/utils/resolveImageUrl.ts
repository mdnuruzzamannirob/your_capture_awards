const LOCAL_ASSET_PREFIXES = ['/images/', '/icons/', '/favicon'];

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
  if (/^(https?:|data:|blob:)/i.test(url)) return encodeURI(url);
  if (url.startsWith('//')) return `https:${encodeURI(url)}`;

  url = url.replace(/\\/g, '/');

  if (LOCAL_ASSET_PREFIXES.some((prefix) => url.startsWith(prefix))) {
    return encodeURI(url);
  }

  const apiAssetBase = getApiAssetBase();
  if (!apiAssetBase) return encodeURI(url.startsWith('/') ? url : `/${url}`);

  return encodeURI(`${apiAssetBase}${url.startsWith('/') ? url : `/${url}`}`);
}
