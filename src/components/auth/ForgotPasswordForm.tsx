'use client';

import FormField from '@/components/FormField';
import LogoName from '@/components/LogoName';
import { ForgotFormData, forgotPassSchema } from '@/lib/userSchema';
import { useForgotPasswordMutation } from '@/store/features/user/userApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordForm() {
  const forgotPasswordForm = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPassSchema),
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const onSubmit = async (data: ForgotFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
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
