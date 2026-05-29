import { Metadata } from "next";
import Link from "next/link";
import { fetchAndClean } from "@/lib/fetchers/view";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ url?: string; title?: string; source?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { title } = await searchParams;
  return { title: title ? `${title} - AI Frontier Hub` : "内容预览 - AI Frontier Hub" };
}

export default async function ViewPage({ searchParams }: Props) {
  const params = await searchParams;
  const { url, title: paramTitle, source } = params;

  if (!url) {
    return (
      <Layout title="缺少链接参数" originalUrl={null}>
        <p className="text-slate-400">缺少 URL 参数，无法加载内容。</p>
      </Layout>
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return (
      <Layout title="无效链接" originalUrl={null}>
        <p className="text-slate-400">链接格式无效：{url}</p>
      </Layout>
    );
  }

  const result = await fetchAndClean(url);

  if (result.error) {
    return (
      <Layout title={paramTitle ?? parsedUrl.hostname} originalUrl={url} siteName={source}>
        <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-6">
          <h2 className="mb-2 text-lg font-semibold text-red-400">无法加载此页面</h2>
          <p className="text-sm text-slate-400">{result.error}</p>
          <p className="mt-3 text-sm text-slate-500">
            原因可能是：目标站点禁止抓取、网络问题、或页面已失效。
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-3 text-sm font-medium text-slate-300">你可以：</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• 点击上方「打开原始页面」直接访问源站</li>
            <li>• 返回首页浏览其他 AI 资讯</li>
            <li>• 稍后重试（目标站点可能暂时不可访问）</li>
          </ul>
        </div>
      </Layout>
    );
  }

  const displayTitle = paramTitle || result.title || parsedUrl.hostname;

  return (
    <Layout title={displayTitle} originalUrl={url} siteName={source}>
      {/* Page header */}
      {result.title && (
        <header className="mb-8 border-b border-slate-800 pb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {source && (
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                {source}
              </span>
            )}
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-500">
              {parsedUrl.hostname}
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-snug text-white md:text-3xl">
            {result.title}
          </h1>
          {result.description && (
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              {result.description}
            </p>
          )}
        </header>
      )}

      {/* Main content */}
      {result.content ? (
        <article
          className="prose prose-invert prose-slate max-w-none
            prose-headings:text-white prose-p:text-slate-300 prose-a:text-cyan-400
            prose-strong:text-white prose-li:text-slate-300
            prose-img:rounded-xl prose-img:border prose-img:border-slate-800
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
            prose-code:text-cyan-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-blockquote:border-cyan-500/50 prose-blockquote:text-slate-400
            prose-hr:border-slate-800
            prose-table:text-slate-300 prose-th:text-slate-200 prose-td:text-slate-400"
          dangerouslySetInnerHTML={{ __html: result.content }}
        />
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-slate-400">该页面内容无法提取，已在上方提供原始链接访问。</p>
        </div>
      )}
    </Layout>
  );
}

// ──────────────────────────────────────────────
// Shared layout shell
// ──────────────────────────────────────────────
function Layout({
  children,
  title,
  originalUrl,
  siteName,
}: {
  children: React.ReactNode;
  title: string;
  originalUrl: string | null;
  siteName?: string;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <span>←</span>
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
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <a href="/" className="text-cyan-500 hover:text-cyan-400">
            AI Frontier Hub
          </a>{" "}
          统一呈现
        </p>
      </footer>
    </div>
  );
}
