'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

function AuthRedirectHandlerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const auth = searchParams.get('auth');
    const token = searchParams.get('token');

    if (auth === 'success' && token) {
      // Store the token in Cookies (expires in 7 days, consistent with credentials signin)
      Cookies.set('token', token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
        path: '/',
      });

      toast.success('Login Successful', {
        description: 'Welcome back!',
      });

      // Redirect to contest joined dashboard and clear token from the URL history
      router.replace('/contest/joined');
    }
  }, [searchParams, router]);

  return null;
}

export default function AuthRedirectHandler() {
  return (
    <Suspense fallback={null}>
      <AuthRedirectHandlerContent />
    </Suspense>
  );
}
