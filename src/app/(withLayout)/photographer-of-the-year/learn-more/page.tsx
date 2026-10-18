'use client';

import TipTapViewer from '@/components/custom/tiptap-editor/TipTapViewer';
import { Spinner } from '@/components/ui/spinner';
import { useGetSitePolicyQuery } from '@/store/apis/sitePolicyApi';
import {
  useGetJoinedContestQuery,
  useGetPhotographyOfTheYearContestsQuery,
} from '@/store/apis/contestApi';
import { useAuth } from '@/hooks/useAuth';
import OpenContestCard from '@/components/module/contest/open/OpenContestCard';
import JoinedContestCard from '@/components/module/contest/joined/JoinedContestCard';
import SafeBannerImage from '@/components/SafeBannerImage';
import { ArrowLeft, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const FALLBACK_TITLE = 'Photographer of the Year';

export default function PhotographerOfTheYearLearnMorePage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useGetSitePolicyQuery({
    type: 'PHOTOGRAPHER_OF_THE_YEAR',
  });
  const {
    data: potyContestsResponse,
    isLoading: isLoadingPotyContests,
    isError: isPotyContestsError,
    refetch: refetchPotyContests,
  } = useGetPhotographyOfTheYearContestsQuery();
  const {
    data: joinedContestsResponse,
    refetch: refetchJoinedContests,
  } = useGetJoinedContestQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthenticated },
  );
  const policy = data?.data?.[0];
  const potyContests = potyContestsResponse?.data ?? [];
  const joinedContests = joinedContestsResponse?.data ?? [];

  return (
    <main className="margin relative min-h-[calc(100dvh-59px)] overflow-hidden">
      <div className="fixed inset-x-0 top-[59px] bottom-0 -z-10">
        <Image
          src="/images/POTY.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover opacity-45 blur-2xl"
        />
        <div className="bg-background/20 absolute inset-0" />
        <Image
          src="/images/POTY.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70 sm:object-contain"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_38%,transparent)_0%,color-mix(in_oklab,var(--background)_12%,transparent)_38%,color-mix(in_oklab,var(--background)_42%,transparent)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,color-mix(in_oklab,var(--background)_72%,transparent)_0%,transparent_100%)]" />
      </div>

      <section className="container py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/photographer-of-the-year"
            className="border-border/70 bg-background/55 text-muted-foreground hover:border-primary/40 hover:bg-background/70 hover:text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-lg shadow-black/10 backdrop-blur-md transition"
          >
            <ArrowLeft className="size-4" />
            Back to Photographer of the Year
          </Link>
        </div>

        <article className="border-border/80 bg-background/88 sm:bg-background/74 lg:bg-background/64 mx-auto mt-7 max-w-4xl rounded-2xl border p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-8 lg:px-14 lg:py-12">
          {isLoading ? (
            <div className="flex min-h-96 flex-col items-center justify-center gap-3">
              <Spinner className="text-primary size-8" />
              <p className="text-muted-foreground text-sm">Loading contest information...</p>
            </div>
          ) : (
            <>
              <header className="border-border/70 border-b pb-8 text-center sm:pb-10">
                <div className="text-primary mx-auto flex w-fit items-center justify-center gap-3 text-sm font-semibold">
                  <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md shadow-lg shadow-black/20">
                    <Trophy className="size-5" />
                  </span>
                  Photographer of the Year
                </div>
                <h1 className="text-heading mx-auto mt-7 max-w-4xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                  {policy?.title || FALLBACK_TITLE}
                </h1>
              </header>

              {error ? (
                <div className="border-border bg-surface/80 text-muted-foreground mx-auto mt-8 max-w-3xl rounded-lg border p-6 text-center text-sm leading-7">
                  The Photographer of the Year details are being prepared. Please check back soon.
                </div>
              ) : policy?.content ? (
                <TipTapViewer
                  content={policy.content}
                  className="text-body [&_a]:text-primary [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_h1]:text-heading [&_h2]:border-primary [&_h2]:text-heading [&_h3]:text-heading [&_img]:border-border [&_li::marker]:text-primary [&_strong]:text-heading mx-auto mt-10 max-w-3xl text-left text-[1.0625rem] leading-8 whitespace-normal [&_a]:font-medium [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_h1]:mt-14 [&_h1]:mb-5 [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:border-l-4 [&_h2]:pl-4 [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:leading-snug [&_h3]:font-semibold [&_img]:my-8 [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_li]:my-0 [&_li]:pl-1 [&_li]:leading-7 [&_li_p]:my-0 [&_li_p]:inline [&_ol]:my-6 [&_ol]:space-y-3 [&_ol]:pl-7 [&_p]:my-4 [&_p]:min-h-0 [&_p]:leading-8 [&_strong]:font-semibold [&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:pl-7"
                />
              ) : (
                <p className="text-muted-foreground mx-auto mt-8 max-w-3xl text-center text-base leading-7">
                  More information about the contest will be available soon.
                </p>
              )}
            </>
          )}
        </article>
      </section>
      <section className="container pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">Year-long contest</p>
            <h2 className="text-heading mt-2 text-2xl font-semibold sm:text-3xl">Photographer of the Year rankings</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
              Submit up to 8 photos. Votes each photo receives in regular contests during this contest&apos;s dates count toward its ranking.
            </p>
          </div>
          {isLoadingPotyContests ? (
            <div className="bg-surface-secondary h-72 animate-pulse rounded-xl" />
          ) : isPotyContestsError ? (
            <p className="text-muted-foreground rounded-lg border p-5 text-sm">Unable to load Photographer of the Year contests right now.</p>
          ) : potyContests.length ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {potyContests.map((contest: any) => {
                const joinedContest = joinedContests.find((joined: any) => joined.id === contest.id);
                if (joinedContest) return (
                  <JoinedContestCard
                    key={contest.id}
                    contest={{ ...contest, ...joinedContest, isPhotographyOfYear: true }}
                    refetch={refetchJoinedContests}
                  />
                );
                if (contest.status !== 'ACTIVE') return (
                  <article key={contest.id} className="border-border bg-surface-secondary overflow-hidden rounded-xl border">
                    <Link href={`/contest/${contest.id}${contest.status === 'COMPLETED' ? '?tab=rank' : ''}`} className="group block">
                      <div className="relative h-48">
                        <SafeBannerImage alt={`${contest.title} banner`} src={contest.banner} className="object-cover transition group-hover:brightness-75" />
                      </div>
                      <div className="p-4">
                        <p className="text-primary text-[10px] font-semibold tracking-widest uppercase">{contest.status}</p>
                        <h3 className="text-heading mt-1 text-lg font-semibold">{contest.title}</h3>
                        <span className="border-border text-primary mt-4 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium">
                          {contest.status === 'COMPLETED' ? 'View top 10 ranking' : 'View contest details'}
                        </span>
                      </div>
                    </Link>
                  </article>
                );
                return (
                  <OpenContestCard
                    key={contest.id}
                    contest={{ ...contest, isPhotographyOfYear: true }}
                    refetch={refetchPotyContests}
                  />
                );
              })}
            </div>
          ) : (
            <div className="border-border bg-background/60 rounded-xl border p-6 text-sm">
              <h3 className="text-heading font-semibold">No Photographer of the Year contest is scheduled yet.</h3>
              <p className="text-muted-foreground mt-2">Check back here when the next date range is announced.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
