import { useGetMeQuery } from '@/store/features/auth/authApi';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const { data, isLoading, isFetching, refetch } = useGetMeQuery();
  const user = data?.data ?? null;
  const token = Cookies.get('token') ?? null;
  const isAuthenticated = !!token && !!user;
  return { user, token, isAuthenticated, isLoading, isFetching, refetch };
};
