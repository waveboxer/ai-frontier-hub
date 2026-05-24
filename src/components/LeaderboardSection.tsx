import type { LeaderboardModel } from "@/lib/types";

const VENDOR_COLORS: Record<string, string> = {
  Anthropic: "text-orange-400",
  OpenAI: "text-emerald-400",
  Google: "text-blue-400",
  Meta: "text-indigo-400",
  xAI: "text-slate-300",
  Alibaba: "text-amber-400",
  Baidu: "text-red-400",
  "Z.ai": "text-purple-400",
};

function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export function LeaderboardSection({
  models,
  fetchedAt,
}: {
  models: LeaderboardModel[];
  fetchedAt: string;
}) {
  return (
    <section id="leaderboard" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <div>
          <h2 className="text-xl font-bold text-white">大模型排行榜</h2>
          <p className="text-sm text-slate-400">
            LMSYS Chatbot Arena · 更新于{" "}
            {new Date(fetchedAt).toLocaleString("zh-CN")}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">排名</th>
              <th className="px-4 py-3 text-left">模型</th>
              <th className="px-4 py-3 text-left">厂商</th>
              <th className="px-4 py-3 text-right">ELO 分数</th>
              <th className="px-4 py-3 text-right">置信区间</th>
              <th className="px-4 py-3 text-right">投票数</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr
                key={m.rank}
                className="border-t border-slate-800 hover:bg-slate-900/50"
              >
                <td className="px-4 py-3 font-medium">{medal(m.rank)}</td>
                <td className="px-4 py-3 font-mono text-white">{m.model}</td>
                <td
                  className={`px-4 py-3 ${VENDOR_COLORS[m.vendor ?? ""] ?? "text-slate-400"}`}
                >
                  {m.vendor ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-bold text-cyan-400">
                  {m.score ?? "—"}
                </td>
                <td className="px-4 py-3 text-right text-slate-500">
                  {m.ci != null ? `±${m.ci}` : "—"}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">
                  {m.votes?.toLocaleString() ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
