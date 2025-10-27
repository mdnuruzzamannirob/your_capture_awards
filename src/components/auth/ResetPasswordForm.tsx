'use client';

import FormField from '@/components/FormField';
import LogoName from '@/components/LogoName';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmFormData, resetPassSchema } from '@/lib/schemas/userSchema';
import { useResetPasswordMutation } from '@/store/features/auth/authApi';
import { useAppSelector } from '@/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'sonner';

export default function ResetPasswordForm() {
  const { tempEmail, tempToken } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const router = useRouter();
  const confirmPasswordForm = useForm<ConfirmFormData>({
    resolver: zodResolver(resetPassSchema),
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const onSubmit = async (data: ConfirmFormData) => {
    try {
      await resetPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
        token: tempToken ?? '',
        email: tempEmail ?? '',
      }).unwrap();

      toast.success('Password reset successfully.', {
        description: 'You can now sign in with your new password.',
      });
      router.push('/signin');
    } catch (error) {
      toast.error('Failed to reset password.', {
        description: (error as any)?.data?.message || '',
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-16 px-5 pt-5 pb-10">
      <header className="flex flex-col items-center space-y-2 text-center">
        <LogoName className="scale-125" />
      </header>
      <div className="border-orange-2-400/60 w-full space-y-10 rounded-md border p-8 md:p-10">
        <div className="space-y-5">
          <h1 className="font-rubik text-2xl font-medium md:text-3xl">Reset Your Password</h1>
          <p className="max-md:text-sm">
            Enter your details below to request an your capture award account password reset.
          </p>
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
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-4 w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
