'use client';

import FormField from '@/components/FormField';
import LogoName from '@/components/LogoName';
import { ForgotFormData, forgotPassSchema } from '@/lib/userSchema';
import { useForgotPasswordMutation } from '@/store/features/user/userApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ForgotPasswordForm() {
  const forgotPasswordForm = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPassSchema),
  });

  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const onSubmit = async (data: ForgotFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();

      toast.message('Password reset email sent', {
        description: 'Please check your inbox for the reset code.',
      });

      router.push('/verify-otp');
    } catch (err: any) {
      toast.error('Oops! Something went wrong', {
        description:
          err?.data?.message ||
          err?.error ||
          'Failed to send password reset email. Please try again.',
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-10 pt-5 pb-10">
      <header className="flex flex-col items-center space-y-2 text-center">
        <LogoName className="scale-125" />
      </header>
      <div className="border-orange-2-400/60 w-full space-y-10 rounded-md border p-10">
        <div className="space-y-5">
          <h1 className="font-rubik text-3xl font-medium">Forgot Password ?</h1>
          <p>Enter your details below to request an your capture award account password reset.</p>
        </div>
        <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}>
          <FormField<ForgotFormData>
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            register={forgotPasswordForm.register}
            error={forgotPasswordForm.formState.errors.email?.message as string}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-4 w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
