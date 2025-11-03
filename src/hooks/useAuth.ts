import { RootState } from '@/store/makeStore';
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { token, user, tempEmail, tempToken } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  return { token, user, isAuthenticated, tempEmail, tempToken };
};
