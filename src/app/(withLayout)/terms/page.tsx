'use client';

import { useGetSitePolicyQuery } from '@/store/apis/sitePolicyApi';
import TipTapViewer from '@/components/custom/tiptap-editor/TipTapViewer';
import { Spinner } from '@/components/ui/spinner';

export default function TermsPage() {
  const { data, isLoading, error } = useGetSitePolicyQuery({ type: 'TERMS' });
  const policy = data?.data?.[0];

  return (
    <section className="margin container py-10">
      <div className="border-black-2-600 bg-black-2-800/90 mx-auto max-w-4xl rounded-2xl border p-5 md:p-8">
        <h1 className="border-black-2-600 mb-6 border-b pb-4 text-3xl font-semibold text-white">
          Terms & Conditions
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Spinner className="text-primary size-8" />
            <p className="text-sm text-white/60">Loading terms...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">
            Failed to load content. Please try again later.
          </div>
        ) : !policy?.content ? (
          <div className="py-10 text-center text-white/50">No content available.</div>
        ) : (
          <TipTapViewer content={policy.content} className="text-white/80" />
        )}
      </div>
    </section>
  );
}
