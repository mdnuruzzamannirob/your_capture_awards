import { RootState } from '@/store/makeStore';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const { user, tempEmail, tempToken } = useSelector((state: RootState) => state.auth);
  const token = Cookies.get('token');
  const isAuthenticated = !!token && !!user;
  return { token, user, isAuthenticated, tempEmail, tempToken };
};
