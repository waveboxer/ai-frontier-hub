export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <span>←</span>
            <span>返回 AI Frontier Hub</span>
          </a>
          <div className="h-4 w-px bg-slate-800" />
          <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
        </div>
      </div>

      {/* Content skeleton */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-6">
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-8 w-3/4 animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-slate-800" />
          </div>
          {/* Paragraphs */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-slate-800" />
            </div>
          ))}
          {/* Image skeleton */}
          <div className="h-64 w-full animate-pulse rounded-xl bg-slate-800" />
          {/* More paragraphs */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
