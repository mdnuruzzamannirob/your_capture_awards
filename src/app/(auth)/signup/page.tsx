import AuthForm from '@/components/module/auth/AuthForm';
import { Metadata } from 'next';
import { getUser } from '@/lib/server/getUser';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'User Sign up page',
};

async function SignupPage() {
  // Check if user is already authenticated
  const { user, token } = await getUser();

  // If user is authenticated, redirect to dashboard
  if (user && token) {
    redirect('/contest/joined');
  }

  return <AuthForm type="signup" />;
}

export default SignupPage;
