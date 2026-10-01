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
        <div className="mx-auto max-w-5xl">
          <Link
            href="/photographer-of-the-year"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition"
          >
            <ArrowLeft className="size-4" />
            Back to Photographer of the Year
          </Link>
        </div>

        <article className="border-border bg-background/92 mx-auto mt-8 max-w-5xl rounded-2xl border p-5 shadow-2xl backdrop-blur-md sm:p-8 lg:px-14 lg:py-12">
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
    </main>
  );
}
