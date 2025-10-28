export function decodeToken(token: string | null): any {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}
