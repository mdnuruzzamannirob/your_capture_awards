import AuthForm from '@/components/module/auth/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signin',
  description: 'User Signin page',
};

const SigninPage = () => {
  return <AuthForm type="signin" />;
};

export default SigninPage;
