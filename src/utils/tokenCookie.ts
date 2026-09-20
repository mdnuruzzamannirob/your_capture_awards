import Cookies from 'js-cookie';

export const TOKEN_COOKIE = 'token';

// Browsers drop `Secure` cookies on non-HTTPS origins, and the localhost
// exemption does not cover LAN IPs (e.g. http://10.10.28.200:3000). Flagging
// the cookie unconditionally makes it vanish on such deployments, so the app
// bounces straight back to /signin after a successful login.
const isSecureOrigin = () =>
  typeof window !== 'undefined' && window.location.protocol === 'https:';

export const setTokenCookie = (token: string, expires: number) => {
  Cookies.set(TOKEN_COOKIE, token, {
    expires,
    secure: isSecureOrigin(),
    // `Strict` withholds the cookie on top-level navigations coming from other
    // sites (OAuth callbacks, email links), which reads as a lost session.
    sameSite: 'Lax',
    path: '/',
  });
};

export const removeTokenCookie = () => {
  Cookies.remove(TOKEN_COOKIE, { path: '/' });
};
