'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { IoCheckbox, IoCheckboxOutline } from 'react-icons/io5';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useSigninMutation, useSignupMutation } from '@/store/features/auth/authApi';
import LogoName from '../LogoName';
import FormField from '../FormField';
import { SigninFormData, signinSchema, SignupFormData, signupSchema } from '@/lib/authSchema';
import { useRouter } from 'next/navigation';

const AuthForm = ({ type = 'signin' }: { type: 'signin' | 'signup' }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const [signin, { isLoading: isSigninLoading }] = useSigninMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  const signinForm = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const signInSubmit = async (data: SigninFormData) => {
    try {
      await signin({ email: data?.email, password: data?.password }).unwrap();
      toast.success('Login Successful', {
        description: 'Welcome back!',
      });
      signinForm.reset();
      router.push('/');
    } catch (err: any) {
      toast.error('Oops! Something went wrong', {
        description:
          err?.data?.message || err?.error || 'Please check your credentials and try again.',
      });
    }
  };

  const signUpSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        email: data?.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        phone: data?.phone,
        password: data?.password,
        confirmPassword: data?.confirmPassword,
      }).unwrap();
      toast.success('Account Created', {
        description: 'You can now log in with your new account.',
      });
      signupForm.reset();
      router.push('/');
    } catch (err: any) {
      toast.error('Oops! Something went wrong', {
        description:
          err?.data?.message || err?.error || 'Please check your credentials and try again.',
      });
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      if (!['google', 'facebook'].includes(provider)) {
        throw new Error('Unsupported OAuth provider');
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error('Missing NEXT_PUBLIC_API_URL');
      }

      // Inform user something is happening
      toast.info(`Redirecting to ${provider}...`);

      // Track redirect attempt to avoid double-tap
      if (typeof window !== 'undefined') {
        if ((window as any).isRedirecting) return;
        (window as any).isRedirecting = true;
      }

      // Attempt redirect
      window.location.assign(`${baseUrl}/api/v1/auth/${provider}`);
    } catch (err: any) {
      console.error('OAuth login error:', err);

      // Fallback feedback
      toast.error(
        err?.message
          ? `OAuth failed: ${err.message}`
          : 'Something went wrong during login. Please try again.',
      );
    } finally {
      if (typeof window !== 'undefined') {
        (window as any).isRedirecting = false;
      }
    }
  };

  // Signin Form
  const renderSigninForm = () => (
    <form onSubmit={signinForm.handleSubmit(signInSubmit)} className="flex flex-col gap-3">
      <FormField<SigninFormData>
        label="Email"
        id="email"
        type="email"
        placeholder="Enter your email"
        register={signinForm.register}
        error={signinForm.formState.errors.email?.message as string}
      />
      <div className="relative">
        <FormField<SigninFormData>
          label="Password"
          id="password"
          type={showPass ? 'text' : 'password'}
          placeholder="Enter your password"
          register={signinForm.register}
          error={signinForm.formState.errors.password?.message as string}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const input = document.getElementById('password') as HTMLInputElement;
            const start = input?.selectionStart || 0;
            const end = input?.selectionEnd || 0;

            setShowPass(!showPass);
            // Restore cursor on next tick
            setTimeout(() => {
              input?.setSelectionRange(start, end);
            }, 0);
          }}
          className="absolute top-10 right-5 size-3"
        >
          {showPass ? (
            <AiOutlineEye className="size-5" />
          ) : (
            <AiOutlineEyeInvisible className="size-5" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRememberMe(!rememberMe)}
          className="flex items-center gap-2 text-sm font-medium text-gray-100 select-none"
        >
          {rememberMe ? (
            <IoCheckbox className="text-primary size-6" />
          ) : (
            <IoCheckboxOutline className="text-primary size-6" />
          )}
          Remember Me
        </button>
        <Link href="/forgot-password" className="text-sm font-medium text-gray-100 hover:underline">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSigninLoading}
        className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-4 w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSigninLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );

  // Signup Form
  const renderSignupForm = () => (
    <form onSubmit={signupForm.handleSubmit(signUpSubmit)} className="flex flex-col gap-3">
      <FormField<SignupFormData>
        label="First Name"
        id="firstName"
        type="text"
        placeholder="Enter your first name"
        register={signupForm.register}
        error={signupForm.formState.errors.firstName?.message}
      />
      <FormField<SignupFormData>
        label="Last Name"
        id="lastName"
        type="text"
        placeholder="Enter your last name"
        register={signupForm.register}
        error={signupForm.formState.errors.lastName?.message}
      />
      <FormField<SignupFormData>
        label="Email"
        id="email"
        type="email"
        placeholder="Enter your email"
        register={signupForm.register}
        error={signupForm.formState.errors.email?.message as string}
      />
      <FormField<SignupFormData>
        label="Contact Number"
        id="phone"
        type="tel"
        placeholder="Enter your contact number"
        register={signupForm.register}
        error={signupForm.formState.errors.phone?.message}
      />

      <div className="relative">
        <FormField<SignupFormData>
          label="Password"
          id="password"
          type={showPass ? 'text' : 'password'}
          placeholder="Enter your password"
          register={signupForm.register}
          error={signupForm.formState.errors.password?.message as string}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const input = document.getElementById('password') as HTMLInputElement;
            const start = input?.selectionStart || 0;
            const end = input?.selectionEnd || 0;

            setShowPass(!showPass);
            // Restore cursor on next tick
            setTimeout(() => {
              input?.setSelectionRange(start, end);
            }, 0);
          }}
          className="absolute top-10 right-5 size-3"
        >
          {showPass ? (
            <AiOutlineEye className="size-5" />
          ) : (
            <AiOutlineEyeInvisible className="size-5" />
          )}
        </button>
      </div>

      <div className="relative">
        <FormField<SignupFormData>
          label="Confirm Password"
          id="confirmPassword"
          type={showConfirmPass ? 'text' : 'password'}
          placeholder="Confirm your password"
          register={signupForm.register}
          error={signupForm.formState.errors.confirmPassword?.message}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const input = document.getElementById('confirmPassword') as HTMLInputElement;
            const start = input?.selectionStart || 0;
            const end = input?.selectionEnd || 0;

            setShowConfirmPass(!showConfirmPass);
            // Restore cursor on next tick
            setTimeout(() => {
              input?.setSelectionRange(start, end);
            }, 0);
          }}
          className="absolute top-10 right-5 size-3"
        >
          {showConfirmPass ? (
            <AiOutlineEye className="size-5" />
          ) : (
            <AiOutlineEyeInvisible className="size-5" />
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={isSignupLoading}
        className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSignupLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );

  return (
    <div className="mx-auto w-full max-w-lg px-5 pt-5 pb-10">
      <header className="flex flex-col items-center space-y-2 text-center">
        <LogoName className="scale-125" />
        <h1 className="font-rubik mt-16 mb-10 text-2xl font-medium md:text-3xl">
          {type === 'signin' ? 'Great to have you back!' : 'Great to have you here!'}
        </h1>
        <div className="font-kumbh w-full space-y-6 font-light">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="text-foreground flex w-full items-center gap-4 rounded-md border border-orange-400/60 px-5 py-3"
          >
            <FaGoogle size={20} /> Continue With Google
          </button>
          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="text-foreground flex w-full items-center gap-4 rounded-md border border-orange-400/60 px-5 py-3"
          >
            <FaFacebookF size={20} /> Continue With Facebook
          </button>
        </div>
        <div className="my-10 flex w-full items-center">
          <hr className="border-0.5 border-white-2-darker flex-1" />
          <span className="px-5 font-medium">or</span>
          <hr className="border-0.5 border-white-2-darker flex-1" />
        </div>
      </header>

      {type === 'signin' ? renderSigninForm() : renderSignupForm()}

      <p className="text-muted-foreground mt-10 text-center text-sm">
        {type === 'signin' ? (
          <>
            New here?{' '}
            <Link href="/signup" className="text-primary font-semibold">
              Create Your Capture Awards Account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/signin" className="text-primary font-semibold">
              Sign In
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
