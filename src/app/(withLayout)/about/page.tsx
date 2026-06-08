export default function AboutPage() {
  return (
    <section className="margin container py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black-2-600 bg-black-2-800/90 p-5 md:p-6">
          <h1 className="text-3xl font-semibold text-white">About</h1>
          <p className="mt-3 text-sm text-white/60">
            Your Capture Awards is a photography community platform for contests, portfolios, and
            team-based collaboration.
          </p>

          <div className="mt-6 space-y-3 text-sm text-white/70">
            <p>Company focus: photo contests, creator profiles, and team features.</p>
            <p>Location: Bangladesh</p>
            <p>Built for photographers who want a simple place to share work and join contests.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-black-2-600 bg-black-2-800/90 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Project info</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>Current version: Frontend web app</p>
            <p>Main features: contests, discover, profile, teams, store, support</p>
            <p>Tech stack: Next.js, React, Redux Toolkit, Tailwind CSS</p>
          </div>
        </div>
      </div>
    </section>
  );
}
