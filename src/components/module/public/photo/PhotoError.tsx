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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center text-primary-foreground">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-border bg-surface p-8 shadow-2xl">
        <div className="mb-6 grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
          <AlertCircle className="size-8" />
        </div>

        <h2 className="mb-2 text-xl font-black tracking-wider text-primary-foreground uppercase">
          Unable to Load Content
        </h2>
        <p className="mb-8 text-sm leading-relaxed font-medium text-muted-foreground">{message}</p>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            onClick={onRetry}
            className="flex h-11 flex-1 items-center justify-center gap-2 bg-info font-bold text-primary-foreground transition-all duration-200 hover:bg-info/90"
          >
            <RotateCw className="animate-spin-hover size-4" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex h-11 flex-1 items-center justify-center gap-2 border-border bg-transparent font-bold text-muted-foreground hover:border-border-strong hover:text-primary-foreground"
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
