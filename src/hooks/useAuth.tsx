import { RootState } from '@/store/makeStore';
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  return { token, user, isAuthenticated };
};
