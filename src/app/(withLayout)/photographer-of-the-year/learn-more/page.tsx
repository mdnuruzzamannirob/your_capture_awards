'use client';

import TipTapViewer from '@/components/custom/tiptap-editor/TipTapViewer';
import { Spinner } from '@/components/ui/spinner';
import { useGetSitePolicyQuery } from '@/store/apis/sitePolicyApi';
import { ArrowLeft, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const FALLBACK_TITLE = 'Photographer of the Year';

export default function PhotographerOfTheYearLearnMorePage() {
  const { data, isLoading, error } = useGetSitePolicyQuery({
    type: 'PHOTOGRAPHER_OF_THE_YEAR',
  });
  const policy = data?.data?.[0];

  return (
    <main className="margin relative min-h-[calc(100dvh-59px)] overflow-hidden">
      <div className="fixed inset-x-0 top-[59px] bottom-0 -z-10">
        <Image
          src="/images/POTY.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_88%,transparent)_45%,color-mix(in_oklab,var(--background)_58%,transparent)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,var(--background)_0%,transparent_100%)]" />
      </div>

      <section className="container py-12 sm:py-16 lg:py-20">
        <Link
          href="/photographer-of-the-year"
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition"
        >
          <ArrowLeft className="size-4" />
          Back to Photographer of the Year
        </Link>

        <article className="border-border bg-background/88 mx-auto mt-8 max-w-5xl rounded-2xl border p-5 text-center shadow-2xl backdrop-blur-md sm:p-8 lg:p-12">
          <div className="text-primary flex items-center justify-center gap-3 text-sm font-semibold">
            <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
              <Trophy className="size-5" />
            </span>
            Photographer of the Year
          </div>

          {isLoading ? (
            <div className="flex min-h-96 flex-col items-center justify-center gap-3">
              <Spinner className="text-primary size-8" />
              <p className="text-muted-foreground text-sm">Loading contest information...</p>
            </div>
          ) : (
            <>
              <h1 className="text-heading mx-auto mt-8 max-w-4xl text-4xl leading-tight font-semibold sm:text-5xl">
                {policy?.title || FALLBACK_TITLE}
              </h1>

              {error ? (
                <div className="border-border bg-surface/80 text-muted-foreground mt-8 rounded-lg border p-6 text-sm leading-7">
                  The Photographer of the Year details are being prepared. Please check back soon.
                </div>
              ) : policy?.content ? (
                <TipTapViewer
                  content={policy.content}
                  className="text-body [&_a]:text-primary [&_h1]:text-heading [&_h2]:text-heading [&_h3]:text-heading mt-8 text-base leading-7 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_li]:my-2 [&_ol]:list-inside [&_p]:leading-8 [&_ul]:list-inside"
                />
              ) : (
                <p className="text-muted-foreground mt-8 text-base leading-7">
                  More information about the contest will be available soon.
                </p>
              )}
            </>
          )}
        </article>
      </section>
    </main>
  );
}
