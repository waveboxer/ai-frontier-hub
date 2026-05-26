import Parser from "rss-parser";
import type { NewsItem } from "@/lib/types";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "AI-Frontier-Hub/1.0",
  },
});

// RSS feeds — AI行业主流媒体
const RSS_FEEDS = [
  { url: "https://36kr.com/feed", source: "36氪" },
  { url: "https://www.qbitai.com/feed", source: "量子位" },
  { url: "https://rsshub.app/jiqizhixin/rss", source: "机器之心" },
  { url: "https://www.ithome.com/rss/", source: "IT之家" },
];

// ──────────────────────────────────────────────
// 今日AI科技热点 — online-search 实时搜索结果
// 数据来源：腾讯元宝搜索（2026-05-26 抓取）
// 每次部署前运行搜索命令更新此处内容
// ──────────────────────────────────────────────
const HOT_NEWS_FROM_SEARCH: NewsItem[] = [
  // 【行业】全球AI大模型调用量五连涨，DeepSeek登顶
  {
    id: "hot-001",
    title: "全球AI大模型调用量五连涨，DeepSeek-V4-Flash首次登顶全球榜",
    link: "https://so.html5.qq.com/page/real/search_news?docid=70000021_2956a15394163565",
    source: "腾讯元宝",
    pubDate: new Date().toISOString(),
    description: "OpenRouter最新数据：上周全球AI大模型总调用量28.9万亿Token，环比增长7.4%，连续五周上涨。DeepSeek-V4-Flash登顶全球榜，中国模型连续四周超越美国（9.22万亿 vs 4.93万亿Token）。",
    category: "industry",
  },
  // 【行业】DeepSeek逆市大幅降价75%
  {
    id: "hot-002",
    title: "DeepSeek V4-Pro API价格永久降价75%，每百万Tokens仅0.025元创全球新低",
    link: "http://news.pconline.com.cn/2157/21572411.html",
    source: "太平洋科技",
    pubDate: new Date().toISOString(),
    description: "在全球AI大模型行业普遍涨价之际，DeepSeek于5月22日宣布V4-Pro API永久降价75%，输入价格低至每百万Tokens 0.025元。依托自研稀疏注意力机制与混合专家模型，实现成本优势。",
    category: "industry",
  },
  // 【行业】国产大模型加速迭代，Qwen3.7-Max位列全球第五
  {
    id: "hot-003",
    title: "Qwen3.7-Max逼近GPT/Claude/Gemini最强模型，位列全球大模型榜单第五",
    link: "https://so.html5.qq.com/page/real/search_news?docid=70000021_1916a13f21c27252",
    source: "企鹅号",
    pubDate: new Date().toISOString(),
    description: "Artificial Analysis最新榜单显示，Qwen3.7-Max性能接近GPT、Claude、Gemini最强模型，位列全球第五。KimiK2.6、DeepSeekV4、GLM-5.1、MiniMaxM2.7等国产模型持续迭代，能力从可用迈向好用。",
    category: "industry",
  },
  // 【产品】ChatGPT Agent 通用智能体重磅发布
  {
    id: "hot-004",
    title: "OpenAI发布ChatGPT Agent：通用智能体可自主使用工具、生成PPT、运行代码",
    link: "https://blog.csdn.net/weixin_58753619/article/details/158933060",
    source: "CSDN",
    pubDate: new Date().toISOString(),
    description: "ChatGPT Agent实现通用智能体能力关键升级，可自动利用多种工具完成复杂任务（浏览日历、生成PPT、运行代码、连接Gmail/GitHub）。基于Agent的模型在HLE基准上得分41.6%，是o3和o4-mini的近两倍。目前向Pro、Plus和Team用户开放。",
    category: "product",
  },
  // 【产品】ChatGPT Images 2.0全量上线
  {
    id: "hot-005",
    title: "ChatGPT Images 2.0全量上线：文字渲染达商用级别，中文不再乱码",
    link: "https://blog.csdn.net/luoyin114514/article/details/160476906",
    source: "CSDN",
    pubDate: new Date().toISOString(),
    description: "OpenAI发布ChatGPT Images 2.0，图像生成深度整合进GPT-4o自回归架构，首次引入思考模式。文字渲染精度达到商用级别，中文不再乱码；单次提示可生成最多8张角色一致连贯图像；支持最高2K分辨率，API同步开放。",
    category: "product",
  },
  // 【产品】ChatGPT for PowerPoint Beta 发布
  {
    id: "hot-006",
    title: "OpenAI推出ChatGPT for PowerPoint Beta：在PPT内用自然语言指令生成幻灯片",
    link: "http://www.sohu.com/a/1026222689_223764",
    source: "搜狐",
    pubDate: new Date().toISOString(),
    description: "5月22日OpenAI正式发布ChatGPT for PowerPoint Beta插件。用户在PowerPoint内直接登录ChatGPT账号，通过自然语言指令完成幻灯片生成、编辑、润色及内容分析。支持从零创建或修改现有文稿，免费与付费用户均可使用。",
    category: "product",
  },
  // 【技术】将600亿参数大模型装进手机
  {
    id: "hot-007",
    title: "国产技术突破：600亿参数大模型可在8GB内存手机上运行",
    link: "https://so.html5.qq.com/page/real/search_news?docid=70000021_3716a13cc8209252",
    source: "企鹅号",
    pubDate: new Date().toISOString(),
    description: "通过精度量化技术将模型压缩至不到3B参数，同时保留97%能力。结合MoE架构，未来可直接在8GB内存手机运行600亿参数大模型。通过减少权重数值精度，大幅降低内存占用。",
    category: "tech",
  },
  // 【技术】物理AI+毫米波雷达实现疾病筛查
  {
    id: "hot-008",
    title: "清雷科技用毫米波雷达+AI实现睡眠呼吸暂停诊断，比肩专业PSG检测",
    link: "https://so.html5.qq.com/page/real/search_news?docid=70000021_4736a0e83cb61852",
    source: "企鹅号",
    pubDate: new Date().toISOString(),
    description: "清雷科技结合毫米波雷达与轻量化多模态传感器，加上物理知识约束的AI机理模型，已实现OSA诊断比肩PSG（AHI的ICC系数0.985）。并拓展至慢阻肺、抑郁焦虑、代谢疾病、阿尔茨海默病等广谱疾病筛查。",
    category: "tech",
  },
  // 【行业】联想发布天禧AI 4.0和AI主机
  {
    id: "hot-009",
    title: "联想发布天禧AI 4.0和联想AI主机：AI能力全面升级",
    link: "https://so.html5.qq.com/page/real/search_news?docid=70000021_4736a0e83cb61852",
    source: "企鹅号",
    pubDate: new Date().toISOString(),
    description: "联想发布天禧AI 4.0和个人AI主机，将AI能力深度整合到日常计算设备中，推动AI从云端向本地终端普及。",
    category: "industry",
  },
  // 【产品】ChatGPT AI填表功能解锁
  {
    id: "hot-010",
    title: "OpenAI解锁ChatGPT AI填表：上传表单+语音说明即可自动填写",
    link: "https://www.sohu.com/a/1026678792_121956424",
    source: "搜狐",
    pubDate: new Date().toISOString(),
    description: "用户上传表单文件后，ChatGPT可识别表单字段，通过语音或文字说明自动填写信息。支持中英文等多种主流语言，处理会员注册、问卷调查、订单确认等各类结构化表单，并能生成配套图片。",
    category: "product",
  },
];

// ──────────────────────────────────────────────
// 分类关键词（用于 RSS 新闻分类）
// ──────────────────────────────────────────────
const INDUSTRY_KEYWORDS =
  /融资|收购|上市|财报|独角兽|裁员|合作|战略|投资|估值|商业化|盈利|市场竞争|份额|监管|政策|开源|闭源|生态|平台|部署|调用|Token|价格战|降价|涨价|API调|周调用/i;

const TECH_KEYWORDS =
  /突破|创新|论文|研究|基准|评测|参数|训练|微调|推理|优化|架构|模型压缩|量化|蒸馏|部署|端侧|手机端|本地|开源模型|评测|榜单|SOTA/i;

const PRODUCT_KEYWORDS =
  /发布|上线|推出|公测|内测|Beta|免费|收费|插件|扩展|API|新功能|更新|版本|发布日|发布|旗舰|新模型|新工具|发布|新品/i;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function classifyRssNews(title: string, description?: string): NewsItem["category"] {
  const text = title + " " + (description ?? "");
  if (PRODUCT_KEYWORDS.test(text)) return "product";
  if (TECH_KEYWORDS.test(text)) return "tech";
  if (INDUSTRY_KEYWORDS.test(text)) return "industry";
  return "general";
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
        id: source + "-" + (item.guid ?? item.link ?? String(i)),
        title,
        link: item.link ?? "#",
        source,
        pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        description,
        category: classifyRssNews(title, description),
      };
    });
  } catch {
    return [];
  }
}

// 判断 RSS 条目是否与热点新闻标题高度重复
function isHotDuplicate(title: string): boolean {
  const t = title.toLowerCase();
  for (const hot of HOT_NEWS_FROM_SEARCH) {
    const words = hot.title.replace(/[^\u4e00-\u9fa5a-z0-9]/gi, "").slice(0, 20);
    if (words.length >= 6 && t.includes(words.toLowerCase())) return true;
  }
  return false;
}

export async function fetchNews(): Promise<NewsItem[]> {
  // 并行抓取所有 RSS 源
  const results = await Promise.all(
    RSS_FEEDS.map(({ url, source }) => fetchFeed(url, source))
  );

  const rssItems = results.flat();

  // 按时间排序，去重
  const seenTitles = new Set<string>();
  const deduped: NewsItem[] = [];

  for (const item of rssItems) {
    const normalized = item.title.toLowerCase().replace(/\s+/g, "").trim();
    if (!seenTitles.has(normalized) && !isHotDuplicate(item.title)) {
      seenTitles.add(normalized);
      deduped.push(item);
    }
  }

  deduped.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // 合并：热点新闻（前） + RSS 新闻（后），最多 40 条
  const merged = [...HOT_NEWS_FROM_SEARCH, ...deduped].slice(0, 40);
  return merged;
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  return fetchNews();
}
