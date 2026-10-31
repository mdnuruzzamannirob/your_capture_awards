'use client';

import CountdownTimer from '@/components/CountdownTimer';
import ContestCorner from '../ContestCorner';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import VoteModal, { VoteModalRef } from '@/components/VoteModal';
import { useAuth } from '@/hooks/useAuth';
import { useStoreModal } from '@/providers/StoreModalProvider';
import {
  useChargeContestExposureMutation,
  useGetPhotographyOfTheYearMyEntryQuery,
} from '@/store/apis/contestApi';
import { setSwiperPhotos } from '@/store/slices/profileSlice';
import { storeApi, useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { labels, totalLevels, valueToLevel } from '@/utils/valueToExposureLabel';
import { Flame, Images, Info, Repeat2, Timer, Trophy, Vote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch, MdOutlineHowToVote } from 'react-icons/md';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import ContestActionModal, { ContestActionModalRef } from './ContestActionModal';
import UploadPhoto from './UploadPhoto';
import PotyBadge from '../PotyBadge';
import { POTY_FALLBACK_BANNER } from '../poty';

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

export const getContestPhotoId = (photo: any, index: number) =>
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
  liveVoteCount,
  href,
  onOpen,
  now,
  index,
}: {
  photo: ContestPhoto;
  fallbackVotes: number;
  liveVoteCount?: number;
  href?: string;
  onOpen?: () => void;
  now: number;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);
  const resolvedPhotoUrl = resolveImageUrl(photo.url);
  // The polled realtime count (see JoinedContest's useGetVoteCountsQuery) wins
  // whenever it's available - it's always fresher than whatever came down with
  // the joined-contest payload, which only re-fetches every 60s.
  const ownVotes = typeof liveVoteCount === 'number' ? liveVoteCount : getPhotoVotes(photo);
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
        onClick={href ? onOpen : undefined}
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
            className="size-full object-cover object-center transition duration-300 select-none group-hover/photo:scale-[1.03]"
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
            <span className="border-primary/40 text-primary inline-flex size-5 items-center justify-center rounded-md border bg-black/70 shadow">
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

function BannerImage({
  src,
  alt,
  fallbackSrc,
}: {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
}) {
  // Try the contest banner first, then the fallback; "No banner" only when both fail.
  const candidates = useMemo(
    () => [resolveImageUrl(src), resolveImageUrl(fallbackSrc)].filter(Boolean),
    [src, fallbackSrc],
  );
  const [failedCount, setFailedCount] = useState(0);
  const resolvedSrc = candidates[failedCount];

  useEffect(() => {
    setFailedCount(0);
  }, [candidates]);

  if (!resolvedSrc) {
    return (
      <div className="bg-surface-tertiary text-muted-foreground flex h-60 w-full items-center justify-center md:h-72 lg:h-80">
        No banner
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
        onError={() => setFailedCount((count) => count + 1)}
      />
    </div>
  );
}

function PotyStat({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-3 text-center">
      <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="text-2xl leading-none font-bold tabular-nums">{value}</div>
      {hint ? <div className="text-muted-foreground truncate text-[10px]">{hint}</div> : null}
    </div>
  );
}

const JoinedContestCard = ({
  contest,
  refetch,
  liveVoteCounts,
  liveParticipantRanks,
}: {
  contest: any;
  refetch: () => Promise<any>;
  liveVoteCounts?: Record<string, number>;
  liveParticipantRanks?: Record<string, number>;
}) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const isPhotographyOfYear = Boolean(contest?.isPhotographyOfYear);
  // POTY has no voting of its own - its numbers come from regular-contest votes.
  const { data: potyEntryResponse } = useGetPhotographyOfTheYearMyEntryQuery(
    { contestId: contest?.id },
    { skip: !isPhotographyOfYear || !contest?.id || !isAuthenticated, pollingInterval: 60_000 },
  );
  const potyEntry = potyEntryResponse?.data;
  const potyVotesByContestPhotoId = useMemo(
    () =>
      Object.fromEntries(
        (potyEntry?.photos ?? []).map((photo) => [photo.contestPhotoId, photo.voteCount]),
      ),
    [potyEntry],
  );
  const { openStore } = useStoreModal();
  const { data: storeStats } = useGetStoreStatsQuery(undefined, { skip: !isAuthenticated });
  const [chargeContestExposure, { isLoading: isPromotingExposure }] =
    useChargeContestExposureMutation();
  const [localImageUrls, setLocalImageUrls] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [confirmPromoteOpen, setConfirmPromoteOpen] = useState(false);
  const modalRef = useRef<VoteModalRef>(null);
  const actionModalRef = useRef<ContestActionModalRef>(null);

  const openPromoteConfirm = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to use contest actions.');
      return;
    }
    if ((storeStats?.data?.key ?? 0) <= 0) {
      openStore();
      return;
    }
    setConfirmPromoteOpen(true);
  };

  const handlePromoteExposure = async () => {
    if ((storeStats?.data?.key ?? 0) <= 0) {
      setConfirmPromoteOpen(false);
      openStore();
      return;
    }
    try {
      const response = await chargeContestExposure({ contestId: contest?.id }).unwrap();
      toast.success(response.message || 'Exposure refilled to 100%.');
      dispatch(storeApi.util.invalidateTags(['StoreStats']));
      setConfirmPromoteOpen(false);
      await refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || 'Something went wrong. Please try again.',
      );
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const contestPhotos = contest?.photos;

  useEffect(() => {
    setLocalImageUrls([]);
  }, [contestPhotos]);

  const serverPhotos = useMemo<ContestPhoto[]>(() => {
    if (!Array.isArray(contestPhotos)) return [];
    return contestPhotos
      .map((photo: any, index: number) => ({
        ...photo,
        id: getContestPhotoId(photo, index),
        url: resolveImageUrl(getContestPhotoUrl(photo)),
      }))
      .filter((photo: ContestPhoto) => Boolean(photo.url));
  }, [contestPhotos]);

  const photos = useMemo<ContestPhoto[]>(() => {
    const existingUrls = new Set(serverPhotos.map((photo) => photo.url));
    const localPhotos = localImageUrls
      .map(resolveImageUrl)
      .filter((url) => url && !existingUrls.has(url))
      .map((url, index) => ({ id: `local-${index}-${url}`, url }));

    return [...serverPhotos, ...localPhotos];
  }, [localImageUrls, serverPhotos]);

  // Hand this contest's entries to the photo page so it opens on the clicked
  // photo straight away (and can page between entries) instead of falling
  // back to whatever swiper list an earlier page left behind.
  const openPhotoViewer = () => {
    dispatch(
      setSwiperPhotos(
        serverPhotos.map((photo) => ({
          id: getPhotoDetailsId(photo),
          url: resolveImageUrl(photo.url),
          userId: user?.id ?? null,
          title: '',
          views: 0,
          likes: 0,
          totalVotes: getPhotoVotes(photo),
        })),
      ),
    );
  };

  const uploadedCount = Math.max(contest?.uploadCount ?? 0, photos.length);
  const maxUploads = contest?.maxUploads ?? contest?.maxUpload ?? 0;
  const remaining = Math.max(0, maxUploads - uploadedCount);
  const exposureBonus = asNumber(contest?.level_data?.exposure_bonus);
  const level = valueToLevel(exposureBonus);
  const isExposureMaxed = exposureBonus >= 100;
  const totalVotes = asNumber(contest?.level_data?.totalVotes);
  const nextLevelPoint = asNumber(contest?.level_data?.nextLevel?.point);
  const votesToNextLevel = Math.max(0, nextLevelPoint - totalVotes);
  const liveRanks = photos
    .map((photo) => liveParticipantRanks?.[photo.id])
    .filter((rank): rank is number => typeof rank === 'number');
  const rank = isPhotographyOfYear
    ? (potyEntry?.rank ?? null)
    : liveRanks.length > 0
      ? Math.min(...liveRanks)
      : (contest?.level_data?.rank ?? null);
  const promotedCount = photos.filter((photo) => isPhotoPromoted(photo, now)).length;
  const tradedCount = photos.filter(isPhotoTraded).length;
  const canUsePhotoActions = serverPhotos.length > 0;

  return (
    <div
      className={cn(
        'text-foreground bg-surface-secondary flex flex-col justify-between gap-3 overflow-hidden rounded-xl border-2 pb-3 lg:gap-5 lg:pb-5',
        'border-border',
      )}
    >
      <div className="relative">
        <Link href={`/contest/${contest?.id}`}>
          <BannerImage
            src={contest?.banner}
            alt={contest?.title}
            fallbackSrc={isPhotographyOfYear ? POTY_FALLBACK_BANNER : undefined}
          />
          {isPhotographyOfYear && (
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
          )}
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
              <span className="border-primary/40 text-primary inline-flex items-center gap-1 rounded-sm border bg-black/55 px-2 py-1 text-[10px] font-semibold">
                <Repeat2 className="size-3" />
                {tradedCount} traded
              </span>
            ) : null}
          </div>
        )}

        {rank && !isPhotographyOfYear ? (
          <span className="bg-primary text-primary-foreground absolute right-3 bottom-3 z-10 inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-semibold">
            <Trophy className="size-3" />
            Rank #{rank}
          </span>
        ) : null}

        {isPhotographyOfYear ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-4 pb-4 text-center">
            <PotyBadge />
            <h2 className="line-clamp-2 text-2xl font-bold text-white drop-shadow md:text-3xl">
              {contest?.title}
            </h2>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-white backdrop-blur-sm">
              <Timer className="text-primary size-3.5" />
              <CountdownTimer
                startDate={contest?.startDate}
                refetch={refetch}
                endDate={contest?.endDate}
              />
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 px-3 text-center">
            <h2 className="inline-block text-2xl font-semibold">{contest?.title}</h2>
            <CountdownTimer
              startDate={contest?.startDate}
              refetch={refetch}
              endDate={contest?.endDate}
            />
          </div>
        )}

        <ContestCorner contest={contest} />
      </div>

      <div className="flex flex-1 flex-col gap-3 lg:gap-5">
        {isPhotographyOfYear ? (
          <div className="flex flex-col gap-2 px-3 lg:px-5">
            <div className="divide-primary/15 border-primary/20 from-primary/10 grid grid-cols-3 divide-x rounded-lg border bg-linear-to-b to-transparent">
              <PotyStat
                icon={<Vote className="size-3" />}
                label="Votes"
                value={(potyEntry?.totalVotes ?? 0).toLocaleString()}
                hint="weighted total"
              />
              <PotyStat
                icon={<Trophy className="size-3" />}
                label="Rank"
                value={
                  potyEntry?.rank ? <span className="text-primary">#{potyEntry.rank}</span> : '-'
                }
                hint={`of ${(potyEntry?.totalPhotographers ?? 0).toLocaleString()}`}
              />
              <PotyStat
                icon={<Images className="size-3" />}
                label="Entries"
                value={
                  <>
                    {uploadedCount}
                    <span className="text-muted-foreground text-base font-medium">
                      /{maxUploads}
                    </span>
                  </>
                }
                hint={
                  remaining > 0
                    ? `${remaining} slot${remaining === 1 ? '' : 's'} left`
                    : 'all slots used'
                }
              />
            </div>
            <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-[11px]">
              <Info className="size-3 shrink-0" />
              Votes are earned by these photos in regular contests during the POTY dates.
            </p>
          </div>
        ) : (
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
              <div className="border-border flex size-20 flex-col items-center justify-center gap-1 rounded-full border-4 p-1">
                <div className="text-lg font-semibold">{totalVotes.toLocaleString()}</div>
                <small className="text-muted-foreground text-[10px]">
                  <span className="text-foreground">{votesToNextLevel.toLocaleString()}</span> votes
                  to next level
                </small>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-muted-foreground text-xs uppercase">Exposure</div>

              <div className="border-border relative flex size-20 flex-col items-center justify-center rounded-full border-4">
                <div className="text-caption-foreground flex w-full justify-between px-2 text-[10px]">
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
                          'h-1.5 w-3 rounded transition',
                          active ? 'bg-primary' : 'bg-surface-tertiary',
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              <Dialog open={confirmPromoteOpen} onOpenChange={setConfirmPromoteOpen}>
                <DialogContent className="border-border border-2 sm:max-w-sm">
                  <DialogTitle className="flex items-center gap-2">
                    <AiOutlineThunderbolt className="text-primary size-5" />
                    Charge Exposure
                  </DialogTitle>
                  <DialogDescription>
                    This will refill this contest entry&apos;s exposure to 100% (Level H) and use 1
                    charge. Continue?
                  </DialogDescription>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setConfirmPromoteOpen(false)}
                      disabled={isPromotingExposure}
                      className="text-primary border-primary rounded-sm border px-5 py-2 text-sm disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isPromotingExposure}
                      onClick={handlePromoteExposure}
                      className="bg-primary text-primary-foreground rounded-sm px-5 py-2 text-sm disabled:opacity-60"
                    >
                      {isPromotingExposure ? 'Charging...' : 'Charge'}
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

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
                fallbackVotes={!isPhotographyOfYear && photos.length === 1 ? totalVotes : 0}
                liveVoteCount={
                  isPhotographyOfYear
                    ? (potyVotesByContestPhotoId[photo.id] ?? 0)
                    : liveVoteCounts?.[photo.id]
                }
                href={photoHref}
                onOpen={openPhotoViewer}
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

      {isPhotographyOfYear ? (
        <div className="grid grid-cols-2 gap-1 px-3 md:gap-3 lg:px-5">
          <button
            onClick={() => actionModalRef.current?.open('trade')}
            disabled={!canUsePhotoActions}
            className="text-primary border-primary/25 hover:bg-primary/5 flex w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 max-md:text-sm md:px-5"
          >
            <MdOutlineCameraswitch className="rotate-90" /> Trade
          </button>
          <Link
            href={`/contest/${contest?.id}?tab=rank`}
            className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-sm px-3 py-2 font-semibold transition hover:brightness-110 max-md:text-sm md:px-5"
          >
            <Trophy className="size-4" /> Ranking
          </Link>
          <ContestActionModal
            ref={actionModalRef}
            contestId={contest?.id}
            contestTitle={contest?.title}
            contestPhotos={serverPhotos}
            onSuccess={refetch}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1 px-3 md:gap-3 lg:px-5">
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            <button
              onClick={openPromoteConfirm}
              disabled={isExposureMaxed || isPromotingExposure}
              title={isExposureMaxed ? 'Exposure is already at 100%' : undefined}
              className="text-primary border-primary/25 flex w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 max-md:text-sm md:px-5"
            >
              <AiOutlineThunderbolt className="size-4" />
              {isPromotingExposure ? 'Charging...' : 'Charge'}
            </button>
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
              <IoKeyOutline /> Promote
            </button>
          </div>

          <div className="flex justify-center gap-1 md:gap-3">
            <button
              onClick={() => modalRef.current?.open()}
              className="text-primary border-primary/25 flex w-full max-w-56 items-center justify-center gap-2 rounded-sm border px-3 py-2 transition max-md:text-sm md:px-5"
            >
              <MdOutlineHowToVote /> Vote
            </button>
            <Link
              href={`/contest/${contest?.id}?tab=rank`}
              className="text-primary border-primary/25 flex w-full max-w-56 items-center justify-center gap-2 rounded-sm border px-3 py-2 transition max-md:text-sm md:px-5"
            >
              <Trophy className="size-4" /> Ranking
            </Link>
          </div>

          <VoteModal ref={modalRef} id={contest?.id} />
          <ContestActionModal
            ref={actionModalRef}
            contestId={contest?.id}
            contestTitle={contest?.title}
            contestPhotos={serverPhotos}
            onSuccess={refetch}
          />
        </div>
      )}
    </div>
  );
};

export default JoinedContestCard;
