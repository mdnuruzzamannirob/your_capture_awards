'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Camera, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useStartMatchAutoMutation } from '@/store/apis/teamApi';
import type { AvailableTeamContest } from '@/store/types/teamTypes';
import { cn } from '@/utils/cn';

type ModalStep = 'preview' | 'select';

interface StartMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  contest: AvailableTeamContest | null;
}

function formatHours(hours: number) {
  if (hours <= 0) return 'Ending soon';
  if (hours < 24) return `${hours}h remaining`;

  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  return restHours > 0 ? `${days}d ${restHours}h remaining` : `${days}d remaining`;
}

function StartMatchModal({ open, onOpenChange, teamId, contest }: StartMatchModalProps) {
  const [step, setStep] = useState<ModalStep>('preview');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [startMatchAuto, { isLoading }] = useStartMatchAutoMutation();

  const banner = contest?.banner || '/images/TeamPhoto.png';

  useEffect(() => {
    if (!open) {
      setStep('preview');
      setFile(null);
      setPreview('');
    }
  }, [open]);

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setPreview(nextPreview);

    return () => URL.revokeObjectURL(nextPreview);
  }, [file]);

  const canSubmit = Boolean(contest && file && !isLoading);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;

    setFile(nextFile);
  };

  const handleSubmit = async () => {
    if (!contest || !file || isLoading) return;

    try {
      await startMatchAuto({
        teamId,
        contestId: contest.id,
        files: [file],
      }).unwrap();

      toast.success('Match started successfully.');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to start match:', error);
      toast.error(error?.data?.message || error?.message || 'Failed to start match');
    }
  };

  const details = useMemo(
    () =>
      contest
        ? [
            { label: 'Photos', value: contest.maxUploads },
            { label: 'Players', value: contest.totalParticipants },
            { label: 'Time', value: formatHours(contest.hoursRemaining) },
          ]
        : [],
    [contest],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-black-2-600 border-2 sm:max-w-2xl">
        <DialogTitle>
          <div className="flex items-center gap-3">
            {step === 'select' ? (
              <button
                type="button"
                onClick={() => setStep('preview')}
                className="hover:text-primary flex size-10 items-center justify-center rounded-full transition hover:bg-white/5"
              >
                <ArrowLeft className="size-4" />
              </button>
            ) : null}
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-[0.12em] uppercase">
                Start Match
              </p>
              <h3 className="text-base font-semibold">{contest?.title || 'Available Contest'}</h3>
            </div>
          </div>
        </DialogTitle>

        {step === 'preview' ? (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-xl border">
              <Image
                src={banner}
                alt={contest?.title || 'Contest banner'}
                width={960}
                height={480}
                className="h-56 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-primary text-[10px] font-semibold tracking-wider uppercase">
                    Ready to start
                  </p>
                  <h4 className="line-clamp-2 text-xl font-bold text-white">{contest?.title}</h4>
                </div>
                <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-center">
                  <p className="text-lg leading-none font-black">{contest?.maxUploads ?? 0}</p>
                  <p className="text-[9px] font-semibold tracking-wide uppercase">Photos</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="border-black-2-600 bg-black-2-700/70 rounded-md border px-3 py-2"
                >
                  <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground text-sm leading-6">
              Upload an image to start the match auto flow. This will send `contestId` and
              `files` to the team start-match endpoint.
            </p>

            <div className="flex items-center justify-between gap-3 border-t pt-5">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep('select')}>Continue</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.12em] uppercase">
                Choose Image
              </p>
              <h4 className="text-lg font-semibold">Upload one image to begin the match</h4>
            </div>

            <div className="space-y-3">
              {preview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-primary bg-black-2-700/70 relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed"
                >
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="bg-background/90 text-foreground relative rounded-md px-3 py-2 text-sm font-semibold">
                    Replace image
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-primary hover:bg-primary/5 flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed transition',
                  )}
                >
                  <UploadCloud className="text-primary size-12" />
                  <div className="text-center">
                    <p className="font-medium">Upload Photo</p>
                    <p className="text-muted-foreground text-sm">PNG, JPG, WEBP</p>
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {!preview ? (
                <div className="text-muted-foreground text-xs">
                  The uploaded file will be sent as `files` in the request body.
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t pt-5">
              <Button variant="outline" onClick={() => setStep('preview')}>
                Back
              </Button>
              <Button disabled={!canSubmit} onClick={handleSubmit} className="gap-2">
                <Camera className="size-4" />
                {isLoading ? 'Starting...' : 'Start Match'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default StartMatchModal;
