import type { NewsItem, ApplicationCase } from "@/lib/types";

const APP_KEYWORDS =
  /落地|应用|部署|上线|商用|接入|集成|试点|规模化|行业方案|解决方案|智能体.*应用|AI.*赋能|数字化转型|production|deployment|enterprise|rollout|launch/i;

const INDUSTRY_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /金融|银行|保险|证券/, label: "金融" },
  { pattern: /医疗|医院|健康|制药/, label: "医疗" },
  { pattern: /制造|工业|工厂|汽车/, label: "制造业" },
  { pattern: /教育|学校|培训/, label: "教育" },
  { pattern: /零售|电商|消费/, label: "零售" },
  { pattern: /政务|政府|公共/, label: "政务" },
  { pattern: /物流|供应链|运输/, label: "物流" },
  { pattern: /游戏|娱乐|传媒/, label: "文娱" },
  { pattern: /法律|司法/, label: "法律" },
  { pattern: /coding|编程|开发|代码/, label: "软件开发" },
];

function extractCompany(text: string): string | undefined {
  const patterns = [
    /([\u4e00-\u9fa5]{2,8}(?:科技|集团|公司|银行|医院|大学|研究院))/,
    /(OpenAI|Google|Microsoft|Amazon|Meta|Apple|Anthropic|DeepSeek|百度|阿里|腾讯|字节|华为|京东|网易|美团)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1];
  }
  return undefined;
}

function extractIndustry(text: string): string | undefined {
  for (const { pattern, label } of INDUSTRY_PATTERNS) {
    if (pattern.test(text)) return label;
  }
  return undefined;
}

export function extractApplications(news: NewsItem[]): ApplicationCase[] {
  const cases: ApplicationCase[] = [];

  for (const item of news) {
    const text = `${item.title} ${item.description ?? ""}`;
    if (!APP_KEYWORDS.test(text)) continue;

    cases.push({
      id: `app-${item.id}`,
      title: item.title,
      description: item.description ?? item.title,
      link: item.link,
      source: item.source,
      pubDate: item.pubDate,
      industry: extractIndustry(text),
      company: extractCompany(text),
    });
  }

  return cases
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20);
}

export async function fetchApplications(news: NewsItem[]): Promise<ApplicationCase[]> {
  return extractApplications(news);
}
