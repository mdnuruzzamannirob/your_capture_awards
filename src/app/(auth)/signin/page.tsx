import AuthForm from '@/components/module/auth/AuthForm';
import { Metadata } from 'next';
import { getUser } from '@/lib/server/getUser';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Signin',
  description: 'User Signin page',
};

async function SigninPage() {
  // Check if user is already authenticated
  const { user, token } = await getUser();

  // If user is authenticated, redirect to dashboard
  if (user && token) {
    redirect('/contest/joined');
  }

  return <AuthForm type="signin" />;
}

export default SigninPage;
