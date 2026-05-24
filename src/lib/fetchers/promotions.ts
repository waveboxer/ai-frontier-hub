import type { NewsItem, Promotion } from "@/lib/types";

const OFFICIAL_PROMOTIONS: Omit<Promotion, "id" | "detectedAt">[] = [
  // 国际
  {
    provider: "OpenAI",
    title: "ChatGPT 免费版",
    description: "GPT-4o mini 及基础功能免费，Plus $20/月解锁高级模型",
    type: "free_tier",
    region: "international",
    url: "https://openai.com/chatgpt/pricing/",
    source: "official",
  },
  {
    provider: "OpenAI",
    title: "API 新用户免费额度",
    description: "新注册用户可获得初始 API 免费额度用于开发测试",
    type: "credit",
    region: "international",
    url: "https://platform.openai.com/docs/pricing",
    source: "official",
  },
  {
    provider: "Anthropic",
    title: "Claude 免费版",
    description: "Claude.ai 免费版可用 Sonnet，Pro $20/月",
    type: "free_tier",
    region: "international",
    url: "https://www.anthropic.com/pricing",
    source: "official",
  },
  {
    provider: "Google",
    title: "Gemini API 免费层",
    description: "Gemini Flash 模型提供免费 API 配额",
    type: "free_tier",
    region: "international",
    url: "https://ai.google.dev/pricing",
    source: "official",
  },
  {
    provider: "Groq",
    title: "GroqCloud 免费层",
    description: "高速推理 API 免费 tier，支持 Llama 等开源模型",
    type: "free_tier",
    region: "international",
    url: "https://groq.com/pricing",
    source: "official",
  },
  {
    provider: "Mistral",
    title: "La Plateforme 免费额度",
    description: "Mistral 开发者平台实验性免费 API 访问",
    type: "credit",
    region: "international",
    url: "https://mistral.ai/pricing",
    source: "official",
  },
  // 国内
  {
    provider: "DeepSeek",
    title: "DeepSeek API 超低价",
    description: "V3/R1 模型定价远低于同类，缓存命中价格更优",
    type: "price_drop",
    region: "domestic",
    url: "https://platform.deepseek.com/",
    source: "official",
  },
  {
    provider: "阿里云",
    title: "通义千问免费额度",
    description: "DashScope 平台新用户赠送 Token 免费额度",
    type: "credit",
    region: "domestic",
    url: "https://dashscope.aliyun.com/",
    source: "official",
  },
  {
    provider: "智谱 AI",
    title: "GLM 新用户赠金",
    description: "BigModel 开放平台注册赠送 Token 体验额度",
    type: "credit",
    region: "domestic",
    url: "https://open.bigmodel.cn/",
    source: "official",
  },
  {
    provider: "百度",
    title: "文心一言免费体验",
    description: "ERNIE 模型 API 提供免费调用额度",
    type: "free_tier",
    region: "domestic",
    url: "https://cloud.baidu.com/product/wenxinworkshop",
    source: "official",
  },
  {
    provider: "月之暗面",
    title: "Kimi API 开放平台",
    description: "Moonshot 平台提供新用户免费 Token 额度",
    type: "credit",
    region: "domestic",
    url: "https://platform.moonshot.cn/",
    source: "official",
  },
  {
    provider: "字节跳动",
    title: "豆包大模型免费额度",
    description: "火山引擎豆包 API 新用户赠送体验 Token",
    type: "credit",
    region: "domestic",
    url: "https://www.volcengine.com/product/doubao",
    source: "official",
  },
  {
    provider: "腾讯",
    title: "混元大模型免费层",
    description: "腾讯云混元 API 提供免费调用配额",
    type: "free_tier",
    region: "domestic",
    url: "https://cloud.tencent.com/product/hunyuan",
    source: "official",
  },
];

const PROMO_KEYWORDS = [
  /免费|free/i,
  /降价|打折|discount|off\b|低价/i,
  /促销|promo/i,
  /credit|额度|赠/i,
  /新用户|trial|试用/i,
];

const DOMESTIC_PROVIDERS =
  /deepseek|通义|文心|智谱|kimi|月之暗面|豆包|混元|百度|阿里|腾讯|字节|华为|minimax|零一/i;

function detectPromoType(text: string): Promotion["type"] {
  if (/免费|free tier|free/i.test(text)) return "free_tier";
  if (/credit|额度|赠/i.test(text)) return "credit";
  if (/降价|打折|discount|off|低价/i.test(text)) return "price_drop";
  if (/促销|promo/i.test(text)) return "discount";
  return "new_offer";
}

function detectProvider(text: string): string {
  if (/openai|gpt|chatgpt/i.test(text)) return "OpenAI";
  if (/anthropic|claude/i.test(text)) return "Anthropic";
  if (/google|gemini/i.test(text)) return "Google";
  if (/deepseek/i.test(text)) return "DeepSeek";
  if (/通义|阿里|qwen/i.test(text)) return "阿里云";
  if (/文心|百度|ernie/i.test(text)) return "百度";
  if (/智谱|glm/i.test(text)) return "智谱 AI";
  if (/kimi|月之暗面|moonshot/i.test(text)) return "月之暗面";
  if (/豆包|字节|volcengine/i.test(text)) return "字节跳动";
  if (/混元|腾讯/i.test(text)) return "腾讯";
  if (/meta|llama/i.test(text)) return "Meta";
  return "AI 行业";
}

function extractPromosFromNews(news: NewsItem[]): Promotion[] {
  const promos: Promotion[] = [];

  for (const item of news) {
    const text = `${item.title} ${item.description ?? ""}`;
    if (!PROMO_KEYWORDS.some((kw) => kw.test(text))) continue;

    const provider = detectProvider(text);
    promos.push({
      id: `news-${item.id}`,
      provider,
      title: item.title,
      description: item.description ?? item.title,
      type: detectPromoType(text),
      region: DOMESTIC_PROVIDERS.test(text) ? "domestic" : "international",
      url: item.link,
      detectedAt: item.pubDate,
      source: "news",
    });
  }

  return promos.slice(0, 10);
}

export async function fetchPromotions(news: NewsItem[] = []): Promise<Promotion[]> {
  const official: Promotion[] = OFFICIAL_PROMOTIONS.map((p, i) => ({
    ...p,
    id: `official-${i}`,
    detectedAt: new Date().toISOString(),
  }));

  const fromNews = extractPromosFromNews(news);
  const seen = new Set<string>();
  const merged: Promotion[] = [];

  for (const promo of [...fromNews, ...official]) {
    const key = `${promo.provider}-${promo.title.slice(0, 30)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(promo);
  }

  return merged;
}

export function groupPromotionsByRegion(promotions: Promotion[]) {
  return {
    domestic: promotions.filter((p) => p.region === "domestic"),
    international: promotions.filter((p) => p.region === "international"),
  };
}
