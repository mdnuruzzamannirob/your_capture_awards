'use client';

import { FormEvent, useState } from 'react';
import FormField from './FormField';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { IoCheckbox, IoCheckboxOutline } from 'react-icons/io5';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { authApi, useSigninMutation, useSignupMutation } from '@/store/features/auth/authApi';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import Link from 'next/link';
import LogoName from '../LogoName';

const AuthForm = ({ type = 'signin' }: { type: 'signin' | 'signup' }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useSigninMutation();
  const [register, { isLoading: isRegisterLoading }] = useSignupMutation();

  // Manual Login/Register handler
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement)?.value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement)?.value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value;

    try {
      if (type === 'signin') {
        await login({ email, password }).unwrap();
        await dispatch(
          authApi.endpoints.getProfile.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        ).unwrap();

        toast.success('Login Successful', {});
      } else {
        await register({ email, firstName, lastName, phone, password, confirmPassword }).unwrap();

        toast.success('Account Created', {
          description: 'You can now log in with your new account.',
        });
        form.reset();
      }
    } catch (err: any) {
      toast.error('Oops! Something went wrong', {
        description:
          err?.data?.message || err?.error || 'Please check your credentials and try again.',
      });
    } finally {
      form.reset();
    }
  };

  // Google/GitHub login handler
  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      // await signIn(provider, { redirect: false });
      // if (res?.error) {
      //   toast.error(res.error);
      //   return;
      // }
      // const token = res?.token;
      // const user = res?.user;
      // if (token) {
      //   dispatch(setToken(token));
      //   dispatch(setUser(user));
      //   Cookies.set("token", token, {
      //     expires: 7,
      //     secure: true,
      //     sameSite: "Strict",
      //   });
      // }
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong!');
    }
  };

  // Render Signin Form
  const renderSigninForm = () => (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <FormField label="Email" id="email" type="email" placeholder="Enter your email" required />
      <div className="relative">
        <FormField
          label="Password"
          id="password"
          type={showPass ? 'text' : 'password'}
          placeholder="Enter your password"
          required
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
          )}{' '}
          Remember Me
        </button>
        <button type="button" className="text-sm font-medium text-gray-100 hover:underline">
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        // disabled={isLoginLoading}
        className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-4 w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* {isLoginLoading ? "Login in..." : "Login"} */} Sign In
      </button>
    </form>
  );

  // Render Signup Form
  const renderSignupForm = () => (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <FormField
        label="First Name"
        id="firstName"
        type="text"
        placeholder="Enter your first name"
        required
      />
      <FormField
        label="Last Name"
        id="lastName"
        type="text"
        placeholder="Enter your last name"
        required
      />
      <FormField label="Email" id="email" type="email" placeholder="Enter your email" required />
      <FormField
        label="Contact Number"
        id="contactNumber"
        type="tel"
        placeholder="Enter your contact number"
        required
      />

      <div className="relative">
        <FormField
          label="Password"
          id="password"
          type={showPass ? 'text' : 'password'}
          placeholder="Enter your password"
          required
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
        <FormField
          label="Confirm Password"
          id="confirmPassword"
          type={showConfirmPass ? 'text' : 'password'}
          placeholder="Confirm your password"
          required
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
        disabled={isRegisterLoading}
        className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* {isLoginLoading ? "Registering..." : "Register"} */}
        Sign Up
      </button>
    </form>
  );

  return (
    <div className="mx-auto w-full max-w-xl pb-10">
      <header className="flex flex-col items-center space-y-2 text-center">
        <LogoName />
        <h1 className="font-rubik mt-16 mb-10 text-3xl font-medium">
          {type === 'signin' ? 'Great to have you back !' : 'Great to have you here !'}
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

      <p className="text-muted-foreground mt-4 text-center text-sm">
        {type === 'signin' ? (
          <>
            New here?{' '}
            <Link href="/signup" className="text-primary font-semibold">
              Create a your capture Award
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
