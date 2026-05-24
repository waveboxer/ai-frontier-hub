import type { LeaderboardModel } from "@/lib/types";

interface ArenaResponse {
  meta: {
    leaderboard: string;
    fetched_at: string;
    model_count: number;
  };
  models: Array<{
    rank: number;
    model: string;
    vendor: string | null;
    license: string | null;
    score: number | null;
    ci: number | null;
    votes: number | null;
  }>;
}

export async function fetchLeaderboard(): Promise<{
  models: LeaderboardModel[];
  fetchedAt: string;
  source: string;
}> {
  const res = await fetch(
    "https://api.wulong.dev/arena-ai-leaderboards/v1/leaderboard?name=text",
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Leaderboard fetch failed: ${res.status}`);
  }

  const data: ArenaResponse = await res.json();

  return {
    models: data.models.map((m) => ({
      rank: m.rank,
      model: m.model,
      vendor: m.vendor,
      score: m.score,
      ci: m.ci,
      votes: m.votes,
      license: m.license,
    })),
    fetchedAt: data.meta.fetched_at,
    source: "LMSYS Chatbot Arena (via arena-ai-leaderboards)",
  };
}
