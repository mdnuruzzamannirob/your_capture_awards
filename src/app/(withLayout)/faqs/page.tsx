'use client';

import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useGetFaqsQuery, type Faq } from '@/store/apis/faqApi';
import { HelpCircle, LifeBuoy, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const groupFaqs = (faqs: Faq[]) => {
  return faqs.reduce<Record<string, Faq[]>>((groups, faq) => {
    const category = faq.category?.trim() || 'General';
    groups[category] = [...(groups[category] ?? []), faq];
    return groups;
  }, {});
};

export default function FaqsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isFetching, error, refetch } = useGetFaqsQuery({
    search: search.trim() || undefined,
  });
  const faqs = data?.data ?? [];
  const groupedFaqs = useMemo(() => groupFaqs(faqs), [faqs]);
  const categoryNames = Object.keys(groupedFaqs);

  return (
    <main className="margin overflow-hidden">
      <section className="border-border relative border-b">
        <Image
          src="/images/studio.png"
          alt="Photography help desk"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-34"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_91%,transparent)_50%,color-mix(in_oklab,var(--background)_65%,transparent)_100%)]" />

        <div className="relative container grid gap-8 py-14 lg:min-h-[430px] lg:grid-cols-[0.8fr_0.6fr] lg:items-center lg:py-16">
          <div className="max-w-3xl">
            <div className="text-primary mb-6 inline-flex items-center gap-3 text-sm font-semibold">
              <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
                <HelpCircle className="size-5" />
              </span>
              Help Center
            </div>
            <h1 className="text-heading text-5xl leading-[1.04] font-semibold sm:text-6xl">
              Frequently asked questions
            </h1>
            <p className="text-body mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Quick answers about contests, teams, submissions, voting, payments, and account
              access.
            </p>
          </div>

          <div className="border-primary bg-background/62 border-l-2 p-5 backdrop-blur">
            <LifeBuoy className="text-primary size-5" />
            <h2 className="text-heading mt-4 text-xl font-semibold">Need more help?</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Send a support request if the answer you need is not listed here.
            </p>
            <Link
              href="/support"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-5 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Browse Answers
            </p>
            <h2 className="text-heading mt-3 text-3xl font-semibold">Find what you need</h2>
          </div>
          <div className="relative w-full lg:max-w-md">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search FAQs..."
              className="border-border bg-background h-11 pl-10"
            />
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <Spinner className="text-primary size-8" />
            <p className="text-muted-foreground text-sm">Loading FAQs...</p>
          </div>
        ) : error ? (
          <div className="border-border bg-surface mt-8 flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border p-6 text-center">
            <p className="text-destructive text-sm">Failed to load FAQs.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="border-border-strong hover:bg-surface-secondary rounded-md border px-4 py-2 text-sm font-semibold transition"
            >
              Retry
            </button>
          </div>
        ) : categoryNames.length === 0 ? (
          <div className="border-border bg-surface text-muted-foreground mt-8 flex min-h-48 items-center justify-center rounded-lg border p-6 text-center text-sm">
            No FAQs are available yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-2">
                {categoryNames.map((category) => (
                  <a
                    key={category}
                    href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="text-muted-foreground hover:text-primary block border-l border-border px-3 py-2 text-sm transition"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </aside>

            <div className="space-y-10">
              {categoryNames.map((category) => (
                <section
                  key={category}
                  id={category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  className="scroll-mt-24"
                >
                  <h3 className="text-heading text-xl font-semibold">{category}</h3>
                  <div className="mt-4 divide-y divide-border border-y border-border">
                    {groupedFaqs[category].map((faq) => (
                      <details key={faq.id} className="group py-4">
                        <summary className="text-heading flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                          <span>{faq.question}</span>
                          <span className="text-primary text-xl leading-none transition group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-7 whitespace-pre-wrap">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
