"use client";

import Link from "next/link";

interface Props {
  children: React.ReactNode;
  title: string;
  originalUrl: string | null;
  siteName?: string;
}

export function ViewShell({ children, title, originalUrl, siteName }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-700 hover:text-white hover:bg-slate-800"
          >
            <span aria-hidden="true">←</span>
            <span>返回 AI Frontier Hub</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
            {title}
          </span>

          {originalUrl && (
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              打开原始页面
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-600">
        <p>
          内容来源于 {siteName ?? "第三方网站"}，
          由{" "}
          <a href="/" className="text-cyan-500 hover:text-cyan-400 transition-colors">
            AI Frontier Hub
          </a>{" "}
          统一呈现
        </p>
      </footer>
    </div>
  );
}
