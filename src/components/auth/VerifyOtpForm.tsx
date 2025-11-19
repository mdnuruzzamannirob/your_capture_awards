'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import LogoName from '../LogoName';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation, useVerifyOTPMutation } from '@/store/features/auth/authApi';
import { useAppSelector } from '@/store/hooks';

export default function VerifyOtpForm() {
  const { tempEmail } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [resendCoolDown, setResendCoolDown] = useState(0);
  const [error, setError] = useState<string>('');

  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading }] = useVerifyOTPMutation();

  // cool down timer
  useEffect(() => {
    if (resendCoolDown <= 0) return;
    const interval = setInterval(() => {
      setResendCoolDown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCoolDown]);

  // otp handler
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // paste handler
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').trim();
    if (!/^\d+$/.test(pasted)) return;
    const chars = pasted.split('').slice(0, 6);
    setOtp((prev) => prev.map((_, i) => chars[i] || ''));
    inputsRef.current[Math.min(chars.length - 1, 5)]?.focus();
    e.preventDefault();
  };

  // resend OTP
  const handleResend = async () => {
    if (resendCoolDown > 0) return;
    if (!tempEmail) {
      setError('Please enter your email before resending.');
      return;
    }

    try {
      setError('');

      await forgotPassword({ email: tempEmail }).unwrap();

      toast.success('OTP resent successfully! Check your inbox.');
      setResendCoolDown(30);
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to resend OTP. Try again later.';
      toast.error(msg);
    }
  };

  // verify OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length < 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }
    if (!tempEmail) {
      setError('Email field cannot be empty.');
      return;
    }

    try {
      setError('');

      await verifyOtp({ email: tempEmail, code }).unwrap();

      toast.success('OTP verified successfully!');
      router.push('/reset-password');
    } catch (err: any) {
      const msg = err?.message || err?.data?.message || 'Invalid or expired OTP. Please try again.';
      toast.error('Oops! Something went wrong', {
        description: msg,
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-16 px-5 pt-5 pb-10">
      <header className="flex flex-col items-center space-y-2 text-center">
        <LogoName className="scale-125" />
      </header>

      <div className="w-full space-y-5 rounded-md border border-orange-400/60 p-8 md:p-10">
        <div className="space-y-5">
          <h1 className="font-rubik text-2xl font-medium md:text-3xl">Verify OTP</h1>
          <p className="max-md:text-sm">
            We have sent you an OTP to your email address. Please check it and place the otp for
            resetting password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="mb-1 block text-sm font-medium">
              Enter Verification Code
            </label>
            <div className="flex w-full items-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  className="size-8 rounded border border-gray-500 bg-transparent text-center outline-none focus:border-orange-500 md:size-10"
                />
              ))}
            </div>
          </div>

          <p className="mb-4 text-xs text-gray-400">
            Didn&apos;t get a code?&nbsp;
            <button
              type="button"
              disabled={resendCoolDown > 0 || isForgotLoading}
              onClick={handleResend}
              className="text-primary underline disabled:opacity-50"
            >
              {resendCoolDown > 0
                ? `Resend in ${resendCoolDown}s`
                : isForgotLoading
                  ? 'Sending...'
                  : 'Resend'}
            </button>
          </p>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-8 w-full rounded-sm py-[9px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
