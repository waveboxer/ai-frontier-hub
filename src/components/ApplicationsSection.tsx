import type { ApplicationCase } from "@/lib/types";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

export function ApplicationsSection({ items }: { items: ApplicationCase[] }) {
  return (
    <section id="applications" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">🚀</span>
        <div>
          <h2 className="text-xl font-bold text-white">AI 应用落地</h2>
          <p className="text-sm text-slate-400">
            最新行业应用、商用部署与规模化落地案例
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
          暂无应用落地资讯，请稍后刷新
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 transition hover:border-emerald-500/30"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {item.source}
                </span>
                {item.industry && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                    {item.industry}
                  </span>
                )}
                {item.company && (
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300">
                    {item.company}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {timeAgo(item.pubDate)}
                </span>
              </div>
              <h3 className="line-clamp-2 font-medium text-slate-100 group-hover:text-emerald-300">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

