import type { GitHubRepo } from "@/lib/types";

function formatStars(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-violet-500/40 hover:bg-slate-900"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-violet-300 group-hover:text-violet-200">
              {repo.fullName}
            </span>
            {repo.isAiRelated && (
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">
                AI
              </span>
            )}
          </div>
        </div>
      </div>

      {repo.description && (
        <p className="mb-3 line-clamp-2 flex-1 text-sm text-slate-400">
          {repo.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {repo.language}
          </span>
        )}
        <span>⭐ {formatStars(repo.stars)}</span>
        {repo.forks > 0 && <span>🍴 {formatStars(repo.forks)}</span>}
        {repo.trendLabel && (
          <span className="text-emerald-400">{repo.trendLabel}</span>
        )}
        {repo.createdAt && repo.category === "latest" && (
          <span>
            创建于 {new Date(repo.createdAt).toLocaleDateString("zh-CN")}
          </span>
        )}
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

export function GitHubSection({
  trending,
  latest,
}: {
  trending: GitHubRepo[];
  latest: GitHubRepo[];
}) {
  return (
    <section id="github" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <h2 className="text-xl font-bold text-white">GitHub 项目推荐</h2>
          <p className="text-sm text-slate-400">
            热门 Trending · 最新 AI 开源项目
          </p>
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="rounded bg-orange-500/20 px-2 py-0.5 text-orange-300">
              🔥 热门
            </span>
            GitHub 本周 Trending（AI 相关优先）
          </h3>
          {trending.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-cyan-300">
              🆕 最新
            </span>
            近 30 天新建的 AI 开源项目
          </h3>
          {latest.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
      暂无数据，请稍后刷新
    </div>
  );
}
