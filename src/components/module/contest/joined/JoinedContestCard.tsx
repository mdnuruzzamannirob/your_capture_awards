'use client';

import CountdownTimer from '@/components/CountdownTimer';
import CornerCount from '@/components/CornerCount';
import VoteModal, { VoteModalRef } from '@/components/VoteModal';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { labels, totalLevels, valueToLevel } from '@/utils/valueToExposureLabel';
import { Flame, Repeat2, Timer, Vote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { MdOutlineCameraswitch, MdOutlineHowToVote } from 'react-icons/md';
import { useEffect, useMemo, useRef, useState } from 'react';

import ContestActionModal, { ContestActionModalRef } from './ContestActionModal';
import UploadPhoto from './UploadPhoto';

type ContestPhoto = {
  id: string;
  photoId?: string | null;
  userPhotoId?: string | null;
  contestPhotoId?: string | null;
  photo?: { id?: string | null; url?: string | null } | null;
  userPhoto?: { id?: string | null; url?: string | null } | null;
  url: string;
  voteCount?: number | null;
  totalVotes?: number | null;
  votes?: number | null;
  vote?: number | null;
  vote_count?: number | null;
  total_votes?: number | null;
  initialVotes?: number | null;
  _count?: {
    votes?: number | null;
  } | null;
  promoted?: boolean | null;
  isPromoted?: boolean | null;
  promotionExpiresAt?: string | Date | null;
  promotion_expire_time?: string | Date | null;
  promotedUntil?: string | Date | null;
  traded?: boolean | null;
  isTraded?: boolean | null;
  tradedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  createdAt?: string | Date | null;
};

const getContestPhotoUrl = (photo: any) =>
  photo?.url ??
  photo?.imageUrl ??
  photo?.photoUrl ??
  photo?.src ??
  photo?.thumbnail ??
  photo?.secure_url ??
  photo?.photo?.url ??
  photo?.userPhoto?.url ??
  photo?.profilePhoto?.url ??
  photo?.image?.url ??
  '';

const getContestPhotoId = (photo: any, index: number) =>
  photo?.id ??
  photo?.contestPhotoId ??
  photo?.photoId ??
  photo?.photo?.id ??
  photo?.userPhoto?.id ??
  `photo-${index}`;

const getPhotoDetailsId = (photo: ContestPhoto) =>
  photo.photoId ?? photo.userPhotoId ?? photo.photo?.id ?? photo.userPhoto?.id ?? photo.id;

const DEFAULT_PROMOTION_DURATION_MS = 30 * 60 * 1000;

const asNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getPhotoVotes = (photo: ContestPhoto) => {
  const values = [
    photo.totalVotes,
    photo.voteCount,
    photo.votes,
    photo.vote,
    photo.vote_count,
    photo.total_votes,
    photo._count?.votes,
  ].map(asNumber);

  const bestValue = Math.max(...values, 0);
  return bestValue > 0 ? bestValue : asNumber(photo.initialVotes);
};

const getPromotionExpiry = (photo: ContestPhoto) =>
  photo.promotionExpiresAt ?? photo.promotion_expire_time ?? photo.promotedUntil ?? null;

const getDateTime = (value: string | Date | null | undefined) => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
};

const getTimeLeft = (value: string | Date | null | undefined, now: number) => {
  const expiry = getDateTime(value);
  if (!expiry) return null;

  const diff = expiry - now;
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
};

const getTimerFill = (photo: ContestPhoto, now: number) => {
  const expiry = getDateTime(getPromotionExpiry(photo));
  if (!expiry) return 100;

  const remaining = expiry - now;
  if (remaining <= 0) return 0;

  const startedAt =
    getDateTime(photo.tradedAt ?? photo.updatedAt ?? photo.createdAt) ??
    expiry - DEFAULT_PROMOTION_DURATION_MS;
  const duration = Math.max(expiry - startedAt, DEFAULT_PROMOTION_DURATION_MS);

  return Math.min(100, Math.max(0, (remaining / duration) * 100));
};

const isPhotoPromoted = (photo: ContestPhoto, now: number) => {
  const flag = Boolean(photo.promoted ?? photo.isPromoted);
  const expiry = getPromotionExpiry(photo);
  if (!flag) return false;
  if (!expiry) return true;
  return new Date(expiry).getTime() > now;
};

const isPhotoTraded = (photo: ContestPhoto) => {
  if (photo.traded || photo.isTraded || photo.tradedAt) return true;
  if (!photo.createdAt || !photo.updatedAt || photo.promoted || photo.isPromoted) return false;
  return new Date(photo.updatedAt).getTime() > new Date(photo.createdAt).getTime();
};

function UploadedPhoto({
  photo,
  fallbackVotes,
  href,
  now,
  index,
}: {
  photo: ContestPhoto;
  fallbackVotes: number;
  href?: string;
  now: number;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);
  const resolvedPhotoUrl = resolveImageUrl(photo.url);
  const ownVotes = getPhotoVotes(photo);
  const votes = ownVotes > 0 ? ownVotes : fallbackVotes;
  const promoted = isPhotoPromoted(photo, now);
  const traded = isPhotoTraded(photo);
  const promotionTimeLeft = getTimeLeft(getPromotionExpiry(photo), now);
  const timerFill = getTimerFill(photo, now);

  useEffect(() => {
    setImageError(false);
  }, [resolvedPhotoUrl]);

  return (
    <div className="flex-1">
      <Link
        href={href || '#'}
        aria-disabled={!href}
        className={cn(
          'border-border group/photo relative block h-24 overflow-hidden rounded-lg border bg-black shadow-sm',
          href ? 'cursor-pointer' : 'pointer-events-none',
          promoted && 'border-primary/80 shadow-primary/15 shadow-md',
        )}
      >
        {resolvedPhotoUrl && !imageError ? (
          <img
            src={resolvedPhotoUrl}
            alt={`uploaded-${index}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="size-full object-cover object-center select-none transition duration-300 group-hover/photo:scale-[1.03]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center text-[11px]">
            No photo
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/5 to-black/35" />

        <div className="absolute top-1.5 left-1.5 flex gap-1">
          {promoted ? (
            <span className="bg-primary text-primary-foreground inline-flex size-5 items-center justify-center rounded-md shadow">
              <Flame className="size-3" />
            </span>
          ) : null}
          {traded ? (
            <span className="border-primary/40 bg-black/70 text-primary inline-flex size-5 items-center justify-center rounded-md border shadow">
              <Repeat2 className="size-3" />
            </span>
          ) : null}
        </div>

        {promotionTimeLeft ? (
          <span
            className="absolute top-1.5 right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-black/70 shadow"
            style={{
              background: `conic-gradient(from -90deg, var(--color-primary) ${timerFill}%, rgba(0,0,0,0.72) 0)`,
            }}
            title={`${promotionTimeLeft} promotion time left`}
            aria-label={`${promotionTimeLeft} promotion time left`}
          >
            <Timer className="relative z-10 size-3 text-white drop-shadow" />
          </span>
        ) : null}

        <div className="absolute right-1.5 bottom-1.5 left-1.5 flex items-end justify-between gap-1">
          <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-black/75 px-1.5 py-1 text-[10px] leading-none font-bold whitespace-nowrap text-white shadow">
            <Vote className="text-primary size-3 shrink-0" />
            <span className="tabular-nums">{votes.toLocaleString()}</span>
          </span>
        </div>
      </Link>
    </div>
  );
}

function BannerImage({ src, alt }: { src?: string | null; alt?: string }) {
  const [imageError, setImageError] = useState(false);
  const resolvedSrc = resolveImageUrl(src);

  useEffect(() => {
    setImageError(false);
  }, [resolvedSrc]);

  if (!resolvedSrc || imageError) {
    return (
      <div className="bg-surface-tertiary text-muted-foreground flex h-60 w-full items-center justify-center md:h-72 lg:h-80">
        No banner photo
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary relative h-60 w-full overflow-hidden md:h-72 lg:h-80">
      <img
        src={resolvedSrc}
        alt={alt || 'Contest banner'}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="size-full object-cover opacity-60"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

const JoinedContestCard = ({ contest, refetch }: { contest: any; refetch: () => Promise<any> }) => {
  const { user } = useAuth();
  const [localImageUrls, setLocalImageUrls] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const modalRef = useRef<VoteModalRef>(null);
  const actionModalRef = useRef<ContestActionModalRef>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setLocalImageUrls([]);
  }, [contest?.photos]);

  const serverPhotos = useMemo<ContestPhoto[]>(() => {
    if (!Array.isArray(contest?.photos)) return [];
    return contest.photos
      .map((photo: any, index: number) => ({
        ...photo,
        id: getContestPhotoId(photo, index),
        url: resolveImageUrl(getContestPhotoUrl(photo)),
      }))
      .filter((photo: ContestPhoto) => Boolean(photo.url));
  }, [contest?.photos]);

  const photos = useMemo<ContestPhoto[]>(() => {
    const existingUrls = new Set(serverPhotos.map((photo) => photo.url));
    const localPhotos = localImageUrls
      .map(resolveImageUrl)
      .filter((url) => url && !existingUrls.has(url))
      .map((url, index) => ({ id: `local-${index}-${url}`, url }));

    return [...serverPhotos, ...localPhotos];
  }, [localImageUrls, serverPhotos]);

  const uploadedCount = Math.max(contest?.uploadCount ?? 0, photos.length);
  const maxUploads = contest?.maxUploads ?? contest?.maxUpload ?? 0;
  const remaining = Math.max(0, maxUploads - uploadedCount);
  const level = valueToLevel(contest?.level_data?.exposure_bonus);
  const totalVotes = asNumber(contest?.level_data?.totalVotes);
  const nextLevelPoint = asNumber(contest?.level_data?.nextLevel?.point);
  const votesToNextLevel = Math.max(0, nextLevelPoint - totalVotes);
  const promotedCount = photos.filter((photo) => isPhotoPromoted(photo, now)).length;
  const tradedCount = photos.filter(isPhotoTraded).length;
  const canUsePhotoActions = serverPhotos.length > 0;

  return (
    <div className="text-foreground bg-surface-secondary border-border flex flex-col justify-between gap-3 overflow-hidden rounded-xl border-2 pb-3 lg:gap-5 lg:pb-5">
      <div className="relative">
        <Link href={`/contest/${contest?.id}`}>
          <BannerImage src={contest?.banner} alt={contest?.title} />
        </Link>

        {(promotedCount > 0 || tradedCount > 0) && (
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
            {promotedCount > 0 ? (
              <span className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-semibold">
                <Flame className="size-3" />
                {promotedCount} promoted
              </span>
            ) : null}
            {tradedCount > 0 ? (
              <span className="border-primary/40 bg-black/55 text-primary inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-[10px] font-semibold">
                <Repeat2 className="size-3" />
                {tradedCount} traded
              </span>
            ) : null}
          </div>
        )}

        <div className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 px-3 text-center">
          <h2 className="inline-block text-2xl font-semibold">{contest?.title}</h2>
          <CountdownTimer
            startDate={contest?.startDate}
            refetch={refetch}
            endDate={contest?.endDate}
          />
        </div>

        <CornerCount count={maxUploads} />
      </div>

      <div className="flex flex-1 flex-col gap-3 lg:gap-5">
        <div className="border-border-subtle grid grid-cols-2 gap-2 border-b px-3 pb-3 text-center md:grid-cols-3 lg:px-5 lg:pb-5">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-muted-foreground text-xs uppercase">Current Level</div>
            <div className="relative">
              <Image
                alt=""
                src="/icons/ranked-badge.png"
                width={141}
                height={100}
                className="h-25 w-35.25 min-w-35.25"
              />
              <span className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full">
                <span className="text-sm font-bold">
                  {contest?.level_data?.currentLevel ?? 'New'}
                </span>
                <span className="text-muted-foreground text-xs font-medium">LEVEL</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-muted-foreground text-xs uppercase">Votes</div>
            <div className="border-border flex size-25 flex-col items-center justify-center gap-1 rounded-full border-4 p-1">
              <div className="text-lg font-semibold">{totalVotes.toLocaleString()}</div>
              <small className="text-muted-foreground text-[10px]">
                <span className="text-foreground">{votesToNextLevel.toLocaleString()}</span> votes
                to next level
              </small>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-muted-foreground text-xs uppercase">Exposure</div>

            <div className="border-border relative flex size-25 flex-col items-center justify-center rounded-full border-4">
              <div className="text-caption-foreground flex w-full justify-between px-3 text-[10px]">
                {labels.map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    className={cn(index + 1 <= level && 'text-primary font-semibold')}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: totalLevels }).map((_, index) => {
                  const active = index + 1 <= level;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'h-1.5 w-3.5 rounded transition',
                        active ? 'bg-primary' : 'bg-surface-tertiary',
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 px-3 md:gap-3 lg:px-5">
          {photos.map((photo, index) => {
            const photoDetailsId = getPhotoDetailsId(photo);
            const ownerQuery = user?.id ? `&ownerId=${user.id}` : '';
            const photoHref = photoDetailsId
              ? `/photo/${photoDetailsId}?source=contest&contest=${contest?.id}${ownerQuery}&returnTo=${encodeURIComponent('/contest/joined')}`
              : undefined;

            return (
              <UploadedPhoto
                key={photo.id}
                photo={photo}
                fallbackVotes={photos.length === 1 ? totalVotes : 0}
                href={photoHref}
                now={now}
                index={index}
              />
            );
          })}

          {Array.from({ length: remaining }).map((_, index) => (
            <UploadPhoto
              key={index}
              contest={contest}
              setImages={setLocalImageUrls}
              remaining={remaining}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 px-3 md:gap-3 lg:px-5">
        <button
          onClick={() => modalRef.current?.open()}
          className="text-primary border-primary/25 flex w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 transition max-md:text-sm md:px-5"
        >
          <MdOutlineHowToVote /> Vote
        </button>

        <VoteModal ref={modalRef} id={contest?.id} />
        <button
          onClick={() => actionModalRef.current?.open('trade')}
          disabled={!canUsePhotoActions}
          className="text-primary border-primary/25 flex w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 max-md:text-sm md:px-5"
        >
          <MdOutlineCameraswitch className="rotate-90" /> Trade
        </button>
        <button
          onClick={() => actionModalRef.current?.open('boost')}
          disabled={!canUsePhotoActions}
          className="text-primary border-primary/25 flex w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 max-md:text-sm md:px-5"
        >
          <AiOutlineThunderbolt /> Charge
        </button>
        <ContestActionModal
          ref={actionModalRef}
          contestId={contest?.id}
          contestTitle={contest?.title}
          contestPhotos={serverPhotos}
          onSuccess={refetch}
        />
      </div>
    </div>
  );
};

export default JoinedContestCard;
