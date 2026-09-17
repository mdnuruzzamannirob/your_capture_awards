'use client';

import TipTapViewer from '@/components/custom/tiptap-editor/TipTapViewer';
import { Spinner } from '@/components/ui/spinner';
import { LEGAL_EFFECTIVE_DATE, TERMS_CONTENT } from '@/constants/legalContent';
import { useGetSitePolicyQuery } from '@/store/apis/sitePolicyApi';

export default function TermsPage() {
  const { data, isLoading, error } = useGetSitePolicyQuery({ type: 'TERMS' });
  const policy = data?.data?.[0];
  const content = policy?.content || TERMS_CONTENT;
  const updatedAt = policy?.updatedAt || LEGAL_EFFECTIVE_DATE;

  return (
    <section className="margin container py-6">
      <div>
        <div className="flex flex-col gap-2">
          <h1 className="text-primary-foreground text-3xl font-semibold">Terms & Conditions</h1>
          {updatedAt && (
            <p className="text-muted-foreground text-sm">
              Last updated on {new Date(updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <hr className="my-6" />

        {isLoading && !policy?.content ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Spinner className="text-primary size-8" />
            <p className="text-muted-foreground text-sm">Loading terms...</p>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-muted-foreground mb-4 text-sm">
                Showing the standard terms while the latest published version is unavailable.
              </p>
            )}
            <TipTapViewer content={content} className="text-foreground" />
          </>
        )}
      </div>
    </section>
  );
}
