'use client';

import SafeBannerImage from '@/components/SafeBannerImage';
import {
  getContestEntryFeeAmount,
  POTY_FALLBACK_BANNER,
} from '@/components/module/contest/poty';
import { Button } from '@/components/ui/button';
import { useGetPhotographyOfTheYearContestsQuery } from '@/store/apis/contestApi';
import { formatDateToDayMonYear } from '@/utils/formatDateToDayMonYear';
import { formatMoney } from '@/utils/formatMoney';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Ticket,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const EMPTY_CONTESTS: any[] = [];

const statusLabel: Record<string, string> = {
  ACTIVE: 'Open for entries',
  UPCOMING: 'Coming soon',
  CLOSED: 'Closed',
  COMPLETED: 'Completed',
};

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-success/12 text-success border-success/25',
  UPCOMING: 'bg-info/12 text-info border-info/25',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  COMPLETED: 'bg-muted text-muted-foreground border-border',
};

export default function PhotographerOfTheYearContestsPage() {
  const { data, isLoading, isError, error, refetch } = useGetPhotographyOfTheYearContestsQuery(
    undefined,
    { refetchOnMountOrArgChange: 60 },
  );
  const contests = data?.data ?? EMPTY_CONTESTS;

  return (
    <main className="margin container space-y-8 py-8 lg:py-12">
      <Link
        href="/photographer-of-the-year"
        className="text-muted-foreground hover:border-primary/40 hover:bg-primary-soft hover:text-primary inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle px-3.5 py-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Photographer of the Year
      </Link>

      <header className="border-border-subtle border-b pb-7 sm:pb-8">
        <div className="space-y-2">
          <h1 className="text-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Photographer of the Year contests
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
            Choose an annual contest to see its details and join. Your entries are ranked by votes
            earned in regular contests during the contest dates.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {isLoading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="bg-surface-secondary border-border-subtle h-[30rem] animate-pulse rounded-xl border"
            />
          ))
        ) : isError ? (
          <div className="border-border-subtle bg-surface/40 col-span-full flex flex-col items-center gap-4 rounded-xl border py-16 text-center">
            <AlertTriangle className="text-primary size-9" />
            <div>
              <p className="text-lg font-semibold">
                Could not load Photographer of the Year contests.
              </p>
              <p className="text-muted-foreground text-sm">
                {(error as any)?.data?.message ?? 'Please try again in a moment.'}
              </p>
            </div>
            <Button onClick={() => void refetch()}>Retry</Button>
          </div>
        ) : contests.length === 0 ? (
          <div className="border-border-subtle bg-surface/40 col-span-full flex flex-col items-center rounded-xl border py-8 text-center">
            <Image alt="" src="/images/no-result-found.webp" width={320} height={320} />
            <p className="text-lg font-semibold">
              No Photographer of the Year contests are available yet.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Please check back when the next annual contest is announced.
            </p>
          </div>
        ) : (
          contests.map((contest: any) => {
            const isActive = contest.status === 'ACTIVE';
            const href = isActive ? `/contest/${contest.id}?modal=join` : `/contest/${contest.id}`;
            const entryFee = getContestEntryFeeAmount(contest);
            const statusText = statusLabel[contest.status] ?? contest.status;

            return (
              <article
                key={contest.id}
                className="group bg-surface border-border-subtle hover:border-primary/55 hover:shadow-primary/8 flex h-full flex-col overflow-hidden rounded-xl border shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Link href={href} className="relative block h-56 overflow-hidden">
                  <SafeBannerImage
                    alt={`${contest.title || 'Photographer of the Year'} banner`}
                    src={contest.banner}
                    fallbackSrc={POTY_FALLBACK_BANNER}
                    className="object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-105"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/5" />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-md ${statusStyles[contest.status] ?? statusStyles.CLOSED}`}
                    >
                      {statusText}
                    </span>
                  </div>
                  <div className="absolute right-4 bottom-4 left-4">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-white/65">
                      <Clock3 className="size-3.5" />
                      {isActive ? 'Accepting entries now' : 'Contest overview'}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-xl leading-tight font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
                      {contest.title}
                    </h2>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col gap-5 p-5">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="bg-surface-secondary border-border-subtle flex min-w-0 items-start gap-2.5 rounded-lg border p-3">
                      <CalendarDays className="text-primary mt-0.5 size-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
                          Contest dates
                        </p>
                        <p className="text-foreground mt-1 text-xs leading-5 font-medium">
                          {formatDateToDayMonYear(contest.startDate)} –{' '}
                          {formatDateToDayMonYear(contest.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-surface-secondary border-border-subtle flex min-w-0 items-start gap-2.5 rounded-lg border p-3">
                      <Ticket className="text-primary mt-0.5 size-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
                          Entry
                        </p>
                        <p className="text-foreground mt-1 text-xs leading-5 font-medium">
                          {entryFee > 0
                            ? formatMoney(entryFee, contest?.currency ?? 'USD')
                            : 'Free entry'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground line-clamp-3 min-h-[4.5rem] text-sm leading-6">
                    {contest.description || 'See contest details, rules, and current rankings.'}
                  </p>

                  <Button asChild className="mt-auto w-full">
                    <Link href={href}>
                      {isActive ? 'Join contest' : 'View contest'}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
