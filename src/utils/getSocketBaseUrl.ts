export const getSocketBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL_V1?.replace(/\/api\/v1\/?$/, '') ||
  'http://localhost:5003';
