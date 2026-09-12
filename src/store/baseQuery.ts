import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getServerToken } from '@/utils/getServerToken';
import { resetAuth } from './slices/authSlice';

let isRedirectingToSignin = false;

const AUTH_PAGE_PATHS = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
];

const getErrorMessage = (error: FetchBaseQueryError) => {
  const data = error.data as
    | {
        message?: string;
        error?: { message?: string };
        errorSources?: { details?: string }[];
      }
    | undefined;

  return [
    data?.message,
    data?.error?.message,
    ...(data?.errorSources?.map((source) => source.details) ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

const isAuthRequiredError = (error: FetchBaseQueryError) => {
  if (error.status === 401) return true;

  if (error.status !== 403) return false;

  const message = getErrorMessage(error);
  return message.includes('authorization header') || message.includes('not authorized');
};

const redirectToSignin = () => {
  if (typeof window === 'undefined' || isRedirectingToSignin) return;

  const { pathname, search } = window.location;

  if (AUTH_PAGE_PATHS.some((path) => pathname.startsWith(path))) return;

  isRedirectingToSignin = true;
  const returnTo = `${pathname}${search}`;
  window.location.assign(`/signin?returnTo=${encodeURIComponent(returnTo)}`);
};

export const baseQuery = (
  isServer: boolean,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL_V1 || 'https://fttfmf0j-5002.inc1.devtunnels.ms/api/v1',

    prepareHeaders: async (headers) => {
      let token: string | undefined | null;

      if (isServer) {
        token = await getServerToken();
      } else {
        token = Cookies.get('token') ?? undefined;
      }

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (!isServer && result.error && isAuthRequiredError(result.error)) {
      Cookies.remove('token', { path: '/' });
      api.dispatch(resetAuth());
      redirectToSignin();
    }

    return result;
  };
};
