import { AuthData } from '@/types';
import { cookies } from 'next/headers';

export async function getUser(): Promise<AuthData> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || null;
  const api = process.env.NEXT_PUBLIC_API_URL_V1;

  const defaultState: AuthData = {
    user: null,
    token: null,
  };

  if (!token || !api) {
    return defaultState;
  }

  try {
    const res = await fetch(`${api}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return defaultState;
    }

    const json = await res.json();
    const user = json?.data || json;

    return {
      user,
      token,
    };
  } catch (err) {
    return defaultState;
  }
}
