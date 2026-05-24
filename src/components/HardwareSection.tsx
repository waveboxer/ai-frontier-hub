import type { HardwareListing, HardwareSummary } from "@/lib/types";

const CATEGORY_LABELS = { gpu: "GPU", cpu: "CPU", memory: "内存" };
const CATEGORY_ICONS = { gpu: "🎮", cpu: "⚡", memory: "💾" };

export function HardwareSection({
  summary,
  listings,
}: {
  summary: HardwareSummary[];
  listings: HardwareListing[];
}) {
  const categories = (["gpu", "cpu", "memory"] as const).map((cat) => ({
    cat,
    items: summary.filter((s) => s.category === cat),
    inStock: listings.filter((l) => l.category === cat && l.inStock).slice(0, 8),
  }));

  return (
    <section id="hardware" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">💰</span>
        <div>
          <h2 className="text-xl font-bold text-white">算力硬件行情</h2>
          <p className="text-sm text-slate-400">
            GPU · CPU · 内存 最新市场价格 · 数据来源 NowInStock
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {categories.map(({ cat, items, inStock }) =>
          items.length > 0 ? (
            <div key={cat}>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                <span>{CATEGORY_ICONS[cat]}</span>
                {CATEGORY_LABELS[cat]} 行情
              </h3>

              <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <div
                    key={item.model}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded bg-slate-700/50 px-2 py-0.5 text-xs font-medium text-slate-300">
                        {item.brand}
                      </span>
                      <span
                        className={`text-xs ${item.inStockCount > 0 ? "text-emerald-400" : "text-slate-500"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white">
                      {item.model.replace(`${item.brand} `, "")}
                    </h4>
                    <p className="mt-1 text-xl font-bold text-amber-400">
                      {item.lowestPrice}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.inStockCount} 有货 / {item.totalListings} 条
                    </p>
                  </div>
                ))}
              </div>

              {inStock.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/80 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">型号</th>
                        <th className="px-4 py-3 text-left">产品</th>
                        <th className="px-4 py-3 text-left">零售商</th>
                        <th className="px-4 py-3 text-right">价格</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inStock.map((item, i) => (
                        <tr
                          key={`${item.name}-${i}`}
                          className="border-t border-slate-800 hover:bg-slate-900/50"
                        >
                          <td className="px-4 py-3 text-slate-300">
                            {item.model}
                          </td>
                          <td className="max-w-xs truncate px-4 py-3 text-white">
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-cyan-300"
                              >
                                {item.name}
                              </a>
                            ) : (
                              item.name
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {item.retailer}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-emerald-400">
                            {item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}

