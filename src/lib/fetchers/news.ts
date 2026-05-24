import Parser from "rss-parser";
import type { NewsItem } from "@/lib/types";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "AI-Frontier-Hub/1.0",
  },
});

const FEEDS = [
  { url: "https://36kr.com/feed", source: "36氪" },
  { url: "https://www.qbitai.com/feed", source: "量子位" },
  { url: "https://rsshub.app/jiqizhixin/rss", source: "机器之心" },
];

const LLM_KEYWORDS =
  /大模型|LLM|GPT|Claude|Gemini|DeepSeek|OpenAI|Anthropic|Agent|智能体|推理|训练|微调|Token|API|Copilot|通义|文心|智谱|Kimi|豆包|混元|Llama|Qwen|GLM/i;

const HARDWARE_KEYWORDS =
  /GPU|显卡|算力|芯片|NVIDIA|AMD|Intel|H100|A100|B200|RTX|Ryzen|Core Ultra|内存|DDR5|HBM|算卡|半导体|晶圆|TPU|NPU|Blackwell|CUDA/i;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function classifyNews(title: string, description?: string): NewsItem["category"] {
  const text = `${title} ${description ?? ""}`;
  if (LLM_KEYWORDS.test(text)) return "llm";
  if (HARDWARE_KEYWORDS.test(text)) return "hardware";
  return "general";
}

function isAiFocused(title: string, description?: string): boolean {
  const text = `${title} ${description ?? ""}`;
  return LLM_KEYWORDS.test(text) || HARDWARE_KEYWORDS.test(text);
}

async function fetchFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items ?? []).slice(0, 20).map((item, i) => {
      const title = item.title ?? "无标题";
      const description = item.contentSnippet
        ? stripHtml(item.contentSnippet).slice(0, 200)
        : item.content
          ? stripHtml(item.content).slice(0, 200)
          : undefined;

      return {
        id: `${source}-${item.guid ?? item.link ?? i}`,
        title,
        link: item.link ?? "#",
        source,
        pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        description,
        category: classifyNews(title, description),
      };
    });
  } catch {
    return [];
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const results = await Promise.all(
    FEEDS.map(({ url, source }) => fetchFeed(url, source))
  );

  const merged = results.flat().sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  const aiFocused = merged.filter((item) =>
    isAiFocused(item.title, item.description)
  );

  const pool = aiFocused.length >= 15 ? aiFocused : merged;
  return pool.slice(0, 30);
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const results = await Promise.all(
    FEEDS.map(({ url, source }) => fetchFeed(url, source))
  );
  return results
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
