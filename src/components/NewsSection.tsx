import type { NewsItem } from "@/lib/types";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

const SOURCE_COLORS: Record<string, string> = {
  "36氪": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  量子位: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  机器之心: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const CATEGORY_LABELS: Record<string, string> = {
  llm: "大模型",
  hardware: "算力硬件",
  general: "综合",
};

const CATEGORY_COLORS: Record<string, string> = {
  llm: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  hardware: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  general: "bg-slate-700/50 text-slate-300 border-slate-600",
};

export function NewsSection({ items }: { items: NewsItem[] }) {
  return (
    <section id="news" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">📰</span>
        <div>
          <h2 className="text-xl font-bold text-white">AI 科技新闻</h2>
          <p className="text-sm text-slate-400">
            聚焦大模型、算力硬件、AI 产业动态 · 36氪 · 量子位 · 机器之心
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
          暂无新闻，请稍后刷新
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-cyan-500/40 hover:bg-slate-900"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${SOURCE_COLORS[item.source] ?? "bg-slate-700/50 text-slate-300 border-slate-600"}`}
                >
                  {item.source}
                </span>
                {item.category && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${CATEGORY_COLORS[item.category]}`}
                  >
                    {CATEGORY_LABELS[item.category]}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {timeAgo(item.pubDate)}
                </span>
              </div>
              <h3 className="line-clamp-2 font-medium text-slate-100 transition-colors group-hover:text-cyan-300">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                  {item.description}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
