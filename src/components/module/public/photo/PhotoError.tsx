'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoErrorProps {
  message?: string;
  onRetry: () => void;
  backUrl?: string;
}

export function PhotoError({
  message = 'Failed to load photo details. Please verify your connection.',
  onRetry,
  backUrl = '/',
}: PhotoErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 py-12 text-center text-white">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-6 grid size-16 place-items-center rounded-full bg-red-500/10 text-red-500 ring-8 ring-red-500/5">
          <AlertCircle className="size-8" />
        </div>

        <h2 className="mb-2 text-xl font-black tracking-wider text-white uppercase">
          Unable to Load Content
        </h2>
        <p className="mb-8 text-sm leading-relaxed font-medium text-zinc-400">{message}</p>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            onClick={onRetry}
            className="flex h-11 flex-1 items-center justify-center gap-2 bg-[#2995f3] font-bold text-white transition-all duration-200 hover:bg-[#1a85e2]"
          >
            <RotateCw className="animate-spin-hover size-4" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex h-11 flex-1 items-center justify-center gap-2 border-zinc-700 bg-transparent font-bold text-zinc-300 hover:border-zinc-500 hover:text-white"
          >
            <Link href={backUrl}>
              <ArrowLeft className="size-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
