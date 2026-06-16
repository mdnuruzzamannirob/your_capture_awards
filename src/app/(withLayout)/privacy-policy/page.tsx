'use client';

import { useGetSitePolicyQuery } from '@/store/apis/sitePolicyApi';
import TipTapViewer from '@/components/custom/tiptap-editor/TipTapViewer';
import { Spinner } from '@/components/ui/spinner';

export default function PrivacyPolicyPage() {
  const { data, isLoading, error } = useGetSitePolicyQuery({ type: 'POLICY' });
  const policy = data?.data?.[0];

  return (
    <section className="margin container py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-black-2-600 bg-black-2-800/90 p-5 md:p-8">
        <h1 className="text-3xl font-semibold text-white mb-6 border-b border-black-2-600 pb-4">
          Privacy Policy
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-white/60">Loading privacy policy...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Failed to load content. Please try again later.
          </div>
        ) : !policy?.content ? (
          <div className="text-center py-10 text-white/50">
            No content available.
          </div>
        ) : (
          <TipTapViewer content={policy.content} className="text-white/80" />
        )}
      </div>
    </section>
  );
}
