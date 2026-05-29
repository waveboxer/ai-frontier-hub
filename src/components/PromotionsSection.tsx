import type { Promotion } from "@/lib/types";

const TYPE_LABELS: Record<Promotion["type"], string> = {
  discount: "折扣",
  free_tier: "免费层",
  credit: "赠金",
  price_drop: "降价",
  new_offer: "新优惠",
};

const TYPE_COLORS: Record<Promotion["type"], string> = {
  discount: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  free_tier: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  credit: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  price_drop: "bg-red-500/20 text-red-300 border-red-500/30",
  new_offer: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "from-emerald-600/20 to-emerald-900/10",
  Anthropic: "from-orange-600/20 to-orange-900/10",
  Google: "from-blue-600/20 to-blue-900/10",
  DeepSeek: "from-cyan-600/20 to-cyan-900/10",
  阿里云: "from-orange-600/20 to-red-900/10",
  百度: "from-blue-600/20 to-indigo-900/10",
  "智谱 AI": "from-violet-600/20 to-purple-900/10",
  月之暗面: "from-slate-600/20 to-slate-900/10",
  字节跳动: "from-blue-600/20 to-cyan-900/10",
  腾讯: "from-blue-600/20 to-teal-900/10",
};

function PromoCard({ item }: { item: Promotion }) {
  const viewUrl = `/view?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}&source=${encodeURIComponent(item.provider)}`;
  return (
    <a
      href={viewUrl}
      className={`group rounded-xl border border-slate-800 bg-gradient-to-br p-5 transition hover:border-slate-600 ${PROVIDER_COLORS[item.provider] ?? "from-slate-800/20 to-slate-900/10"}`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-semibold text-white">{item.provider}</span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs ${TYPE_COLORS[item.type]}`}
        >
          {TYPE_LABELS[item.type]}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs ${
            item.region === "domestic"
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-blue-500/30 bg-blue-500/10 text-blue-300"
          }`}
        >
          {item.region === "domestic" ? "国内" : "国际"}
        </span>
        {item.source === "news" && (
          <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
            新闻检测
          </span>
        )}
      </div>
      <h3 className="font-medium text-slate-100 group-hover:text-white">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
        {item.description}
      </p>
    </a>
  );
}

export function PromotionsSection({
  domestic,
  international,
}: {
  domestic: Promotion[];
  international: Promotion[];
}) {
  return (
    <section id="promotions" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">🎁</span>
        <div>
          <h2 className="text-xl font-bold text-white">Token 促销活动</h2>
          <p className="text-sm text-slate-400">
            国内外大模型 API 优惠、免费额度与降价信息
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="rounded bg-red-500/20 px-2 py-0.5 text-red-300">
              🇨🇳 国内
            </span>
            通义 · 文心 · 智谱 · DeepSeek · Kimi · 豆包 · 混元
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {domestic.map((item) => (
              <PromoCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-blue-300">
              🌍 国际
            </span>
            OpenAI · Anthropic · Google · Groq · Mistral
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {international.map((item) => (
              <PromoCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

