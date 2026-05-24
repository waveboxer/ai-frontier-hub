import { Header } from "@/components/Header";
import { NewsSection } from "@/components/NewsSection";
import { HardwareSection } from "@/components/HardwareSection";
import { PromotionsSection } from "@/components/PromotionsSection";
import { ApplicationsSection } from "@/components/ApplicationsSection";
import { GitHubSection } from "@/components/GitHubSection";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import { TutorialsSection } from "@/components/TutorialsSection";
import { fetchNews } from "@/lib/fetchers/news";
import {
  fetchHardwarePrices,
  getHardwareSummary,
} from "@/lib/fetchers/hardware-prices";
import {
  fetchPromotions,
  groupPromotionsByRegion,
} from "@/lib/fetchers/promotions";
import { fetchApplications } from "@/lib/fetchers/applications";
import { fetchGitHubProjects } from "@/lib/fetchers/github";
import { fetchLeaderboard } from "@/lib/fetchers/leaderboard";
import { fetchTutorials } from "@/lib/fetchers/tutorials";

export const revalidate = 900;

export default async function Home() {
  const news = await fetchNews();

  const [hardwareListings, github, promotions, applications, leaderboard, tutorials] =
    await Promise.all([
      fetchHardwarePrices(),
      fetchGitHubProjects(),
      fetchPromotions(news),
      fetchApplications(news),
      fetchLeaderboard(),
      fetchTutorials(),
    ]);

  const hardwareSummary = getHardwareSummary(hardwareListings);
  const promoGroups = groupPromotionsByRegion(promotions);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            AI Frontier Hub
          </h1>
          <p className="mx-auto max-w-3xl text-slate-400">
            AI 前沿资讯聚合 — 新闻 · 硬件 · 促销 · 应用落地 · GitHub · 排行榜 · 教程
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <StatBadge href="#news" label="新闻" value={news.length} />
            <StatBadge href="#hardware" label="硬件" value={hardwareSummary.length} />
            <StatBadge href="#promotions" label="促销" value={promotions.length} />
            <StatBadge href="#applications" label="应用落地" value={applications.length} />
            <StatBadge
              href="#github"
              label="GitHub"
              value={github.trending.length + github.latest.length}
            />
            <StatBadge href="#leaderboard" label="排行榜" value={leaderboard.models.length} />
            <StatBadge href="#tutorials" label="教程" value={tutorials.length} />
          </div>
        </section>

        <div className="space-y-16">
          <NewsSection items={news} />
          <HardwareSection
            summary={hardwareSummary}
            listings={hardwareListings}
          />
          <PromotionsSection
            domestic={promoGroups.domestic}
            international={promoGroups.international}
          />
          <ApplicationsSection items={applications} />
          <GitHubSection trending={github.trending} latest={github.latest} />
          <LeaderboardSection
            models={leaderboard.models}
            fetchedAt={leaderboard.fetchedAt}
          />
          <TutorialsSection tutorials={tutorials} />
        </div>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>AI Frontier Hub · 数据自动更新 · Built with Next.js</p>
      </footer>
    </div>
  );
}

function StatBadge({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value: number;
}) {
  return (
    <a
      href={href}
      className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 transition hover:border-cyan-500/50 hover:bg-slate-800"
    >
      <span className="font-semibold text-cyan-400">{value}</span>{" "}
      <span className="text-slate-400">{label}</span>
    </a>
  );
}

