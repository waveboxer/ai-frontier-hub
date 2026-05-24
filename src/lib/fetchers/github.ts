import * as cheerio from "cheerio";
import type { GitHubProjects, GitHubRepo } from "@/lib/types";

const USER_AGENT = "AI-Frontier-Hub/1.0";

const AI_KEYWORDS =
  /\b(ai|llm|gpt|agent|ml|rag|embedding|transformer|copilot|claude|gemini|openai|langchain|diffusion|neural|deep.?learning|machine.?learning|generative|chatbot|inference|fine.?tun|vllm|ollama|mcp)\b/i;

function parseCount(text: string): number {
  const cleaned = text.replace(/,/g, "").trim();
  const match = cleaned.match(/([\d.]+)\s*([kKmM])?/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const suffix = match[2]?.toLowerCase();
  if (suffix === "k") return Math.round(num * 1000);
  if (suffix === "m") return Math.round(num * 1000000);
  return Math.round(num);
}

function isAiRelated(text: string, topics: string[] = []): boolean {
  if (AI_KEYWORDS.test(text)) return true;
  return topics.some((t) => AI_KEYWORDS.test(t));
}

function mapSearchItem(
  item: {
    id: number;
    full_name: string;
    name: string;
    owner: { login: string };
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    created_at: string;
    updated_at: string;
    topics?: string[];
  },
  category: "trending" | "latest"
): GitHubRepo {
  const desc = item.description ?? "";
  return {
    id: String(item.id),
    fullName: item.full_name,
    owner: item.owner.login,
    name: item.name,
    description: desc,
    url: item.html_url,
    stars: item.stargazers_count,
    forks: item.forks_count,
    language: item.language,
    category,
    isAiRelated: isAiRelated(`${item.name} ${desc}`, item.topics),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    topics: item.topics,
  };
}

async function fetchTrending(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch("https://github.com/trending?since=weekly", {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const repos: GitHubRepo[] = [];

    $("article.Box-row").each((_, el) => {
      const anchor = $(el).find("h2 a");
      const href = anchor.attr("href");
      if (!href) return;

      const fullName = href.replace(/^\//, "").trim();
      const [owner, name] = fullName.split("/");
      const description = $(el).find("p.col-9, p").first().text().trim();
      const starsText = $(el).find("a[href$='/stargazers']").text().trim();
      const forksText = $(el).find("a[href$='/forks']").text().trim();
      const language =
        $(el).find("[itemprop='programmingLanguage']").text().trim() || null;
      const trendLabel = $(el)
        .find("span.d-inline-block.float-sm-right, span.float-sm-right")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      repos.push({
        id: `trending-${fullName}`,
        fullName,
        owner,
        name,
        description,
        url: `https://github.com/${fullName}`,
        stars: parseCount(starsText),
        forks: parseCount(forksText),
        language,
        category: "trending",
        trendLabel: trendLabel || undefined,
        isAiRelated: isAiRelated(`${name} ${description}`),
      });
    });

    const aiFirst = [
      ...repos.filter((r) => r.isAiRelated),
      ...repos.filter((r) => !r.isAiRelated),
    ];

    return aiFirst.slice(0, 15);
  } catch {
    return fetchTrendingFallback();
  }
}

async function fetchTrendingFallback(): Promise<GitHubRepo[]> {
  const query =
    "(topic:llm OR topic:machine-learning OR topic:artificial-intelligence) stars:>500";
  return searchRepos(query, "stars", "trending", 15);
}

async function fetchLatest(): Promise<GitHubRepo[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const dateStr = since.toISOString().split("T")[0];

  const query = `(topic:llm OR topic:machine-learning OR topic:artificial-intelligence OR topic:deep-learning OR topic:generative-ai OR topic:llm-agents) stars:>30 created:>${dateStr}`;

  return searchRepos(query, "created", "latest", 15);
}

async function searchRepos(
  query: string,
  sort: "stars" | "created" | "updated",
  category: "trending" | "latest",
  perPage: number
): Promise<GitHubRepo[]> {
  try {
    const url = new URL("https://api.github.com/search/repositories");
    url.searchParams.set("q", query);
    url.searchParams.set("sort", sort);
    url.searchParams.set("order", "desc");
    url.searchParams.set("per_page", String(perPage));

    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.items ?? []).map((item: Parameters<typeof mapSearchItem>[0]) =>
      mapSearchItem(item, category)
    );
  } catch {
    return [];
  }
}

export async function fetchGitHubProjects(): Promise<GitHubProjects> {
  const [trending, latest] = await Promise.all([
    fetchTrending(),
    fetchLatest(),
  ]);

  return { trending, latest };
}
