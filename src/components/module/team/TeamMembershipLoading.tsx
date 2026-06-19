'use client';

export default function TeamMembershipLoading() {
  return (
    <div
      className="flex min-h-[60vh] w-full items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="border-foreground/15 border-t-foreground size-10 animate-spin rounded-full border-3" />
    </div>
  );
}
