'use client';

import React, { useEffect, useRef, useState } from 'react';
import LogoName from '../LogoName';

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [resendCoolDown, setResendCoolDown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // cool down timer
  useEffect(() => {
    if (resendCoolDown <= 0) return;
    const interval = setInterval(() => {
      setResendCoolDown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCoolDown]);

  // OTP input handler
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // arrow & backspace navigation
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

  // resend handler (you’ll connect API here)
  const handleResend = () => {
    if (resendCoolDown > 0) return;
    if (!email) {
      alert('Enter your email first.');
      return;
    }
    setResendCoolDown(30); // 30s cool down
  };

  // submit handler (you’ll connect API here)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6 || !email) return alert('Enter all fields');
    console.log('Verifying OTP:', { email, code });
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-10 pt-5 pb-10">
      <header className="flex flex-col items-center space-y-2 text-center">
        <LogoName className="scale-125" />
      </header>
      <div className="border-orange-2-400/60 w-full space-y-5 rounded-md border p-10">
        <p>Enter Verification Code</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="h-10 w-10 rounded border border-gray-500 bg-transparent text-center outline-none focus:border-orange-500"
              />
            ))}
          </div>

          <p className="mb-4 text-xs text-gray-400">
            If you didn&apos;t receive a code.&nbsp;
            <button
              type="button"
              disabled={resendCoolDown > 0}
              onClick={handleResend}
              className="text-orange-500 underline disabled:opacity-50"
            >
              {resendCoolDown > 0 ? `Resend in ${resendCoolDown}s` : 'Resend'}
            </button>
          </p>

          <div className="">
            <label htmlFor="email-input" className="mb-1 block text-sm">
              Email
            </label>
            <input
              id="email-input"
              type="email"
              className="mb-4 w-full rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-orange-500 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
