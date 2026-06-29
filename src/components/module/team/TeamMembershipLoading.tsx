'use client';

export default function TeamMembershipLoading() {
  return (
    <div
      className="flex min-h-[40vh] w-full items-center justify-center py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="border-primary/20 border-t-primary size-10 animate-spin rounded-full border-3" />
    </div>
  );
}
