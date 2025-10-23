'use client';

import FormField from '@/components/FormField';
import LogoName from '@/components/LogoName';
import { ConfirmFormData, resetPassSchema } from '@/lib/userSchema';
import { useResetPasswordMutation } from '@/store/features/user/userApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function ResetPasswordForm() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const confirmPasswordForm = useForm<ConfirmFormData>({
    resolver: zodResolver(resetPassSchema),
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const onSubmit = async (data: ConfirmFormData) => {
    try {
      await resetPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
        token: '6894219f2dd181bec5023e5b',
        email: 'mdsahinsiraj2@gmail.com',
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  console.log(isLoading);

  return (
    <div className="mx-auto w-full max-w-xl space-y-10 pt-5 pb-10">
      <header className="flex flex-col items-center space-y-2 text-center">
        <LogoName className="scale-125" />
      </header>
      <div className="border-orange-2-400/60 w-full space-y-10 rounded-md border p-10">
        <div className="space-y-5">
          <h1 className="font-rubik text-3xl font-medium">Reset Your Password</h1>
          <p>Enter your details below to request an your capture award account password reset.</p>
        </div>
        <form onSubmit={confirmPasswordForm.handleSubmit(onSubmit)}>
          <div className="relative">
            <FormField<ConfirmFormData>
              label="Password"
              id="password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              register={confirmPasswordForm.register}
              error={confirmPasswordForm.formState.errors.password?.message as string}
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
            <FormField<ConfirmFormData>
              label="Confirm Password"
              id="confirmPassword"
              type={showConfirmPass ? 'text' : 'password'}
              placeholder="Confirm your password"
              register={confirmPasswordForm.register}
              error={confirmPasswordForm.formState.errors.confirmPassword?.message}
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
            // disabled={isSigninLoading}
            className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-4 w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {/* {isSigninLoading ? 'Signing in...' : 'Sign In'} */} Submit
          </button>
        </form>
      </div>
    </div>
  );
}
