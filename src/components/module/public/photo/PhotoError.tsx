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
      <div className="flex flex-col items-center max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="grid size-16 place-items-center rounded-full bg-red-500/10 text-red-500 mb-6 ring-8 ring-red-500/5">
          <AlertCircle className="size-8" />
        </div>

        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
          Unable to Load Content
        </h2>
        <p className="text-sm font-medium text-zinc-400 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={onRetry}
            className="flex-1 bg-[#2995f3] hover:bg-[#1a85e2] text-white font-bold h-11 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <RotateCw className="size-4 animate-spin-hover" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex-1 border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold h-11 flex items-center justify-center gap-2 bg-transparent"
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
