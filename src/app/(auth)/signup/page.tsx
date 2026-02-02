import AuthForm from '@/components/module/auth/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'User Sign up page',
};

const SignupPage = () => {
  return <AuthForm type="signup" />;
};

export default SignupPage;
