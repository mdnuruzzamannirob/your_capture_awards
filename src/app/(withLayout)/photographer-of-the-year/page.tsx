import { CalendarClock, Trophy } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Photographer of the Year',
  description: 'See the Photographer of the Year contest, dates, and photo rankings at Your Capture Awards.',
};

export default function PhotographerOfTheYearPage() {
  return (
    <main className="margin overflow-hidden">
      <section className="border-border relative min-h-[calc(100dvh-59px)] border-b">
        <Image
          src="/images/POTY.png"
          alt="Photographer of the Year"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_88%,transparent)_45%,color-mix(in_oklab,var(--background)_40%,transparent)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--background)_0%,transparent_100%)]" />

        <div className="relative container flex min-h-[calc(100dvh-59px)] items-center py-14">
          <div className="max-w-3xl">
            <div className="text-primary mb-6 flex w-fit items-center gap-3 text-sm font-semibold">
              <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
                <Trophy className="size-5" />
              </span>
              Photographer of the Year
            </div>

            <span className="border-primary/40 bg-primary/10 text-primary mb-5 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              <CalendarClock className="size-3.5" />
              Year-long contest
            </span>

            <h1 className="text-heading text-4xl leading-[1.05] font-semibold tracking-normal sm:text-5xl lg:text-6xl">
              Follow the year&apos;s leading photographs.
            </h1>
            <p className="text-body mt-6 max-w-2xl text-base leading-7 sm:text-lg">
              Photos earn their Photographer of the Year ranking through weighted votes in regular
              contests during the dates set by the admin. Join it alongside the regular contests and
              follow its ranking from the contest page.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/photographer-of-the-year/learn-more"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition"
              >
                Learn More
              </Link>
              <Link
                href="/photographer-of-the-year/contests"
                className="border-border bg-background/30 text-foreground hover:bg-surface-secondary inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
