/**
 * 动态教程抓取器
 * 每天自动从全网（官网、论坛、Blog、知乎、B 站等）抓取最新教程内容
 * 数据缓存 24 小时，fallback 到静态数据
 */

import type { Tutorial, TutorialStep } from "@/lib/types";
import { TUTORIALS } from "@/lib/data/tutorials";

// ===================== 静态教程数据（最后保底） ======================
export { TUTORIALS as STATIC_TUTORIALS } from "@/lib/data/tutorials";

// ===================== 搜索工具 ======================
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // 使用 DuckDuckGo（无需 API Key）
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}&kl=zh-cn`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 86400 },
    });
    const text = await res.text();

    // 简单解析 DuckDuckGo HTML 结果
    const results: SearchResult[] = [];
    const pattern = /<a class="result__a" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = pattern.exec(text)) !== null && results.length < 5) {
      const titleRaw = match[2].replace(/<[^>]+>/g, "").trim();
      const snippet = match[3].replace(/<[^>]+>/g, "").trim();
      if (titleRaw && snippet) {
        results.push({
          title: titleRaw,
          url: match[1],
          snippet,
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// ===================== 工具 → 搜索关键词配置 ======================
const TOOL_SEARCH_CONFIGS: Record<
  string,
  {
    /** 主搜索词（用于找最新教程/更新） */
    primaryKw: string;
    /** 备用搜索词 */
    altKw: string;
    /** 官方链接列表 */
    officialSources: { label: string; url: string }[];
    /** 特色功能关键词（用于提取 features） */
    featureKeywords: string[];
    /** 技巧关键词 */
    tipsKw: string;
    /** 最佳实践关键词 */
    bpKw: string;
    /** 安装命令关键词 */
    installKw: string;
  }
> = {
  "openclaw": {
    primaryKw: "OpenClaw AI agent 教程 2025 2026 安装",
    altKw: "openclaw skills 技能 安装 配置",
    officialSources: [
      { label: "官网", url: "https://openclaw.ai/" },
      { label: "文档", url: "https://docs.openclaw.ai/" },
      { label: "GitHub", url: "https://github.com/openclaw/openclaw" },
    ],
    featureKeywords: ["agent", "记忆", "skills", "插件", "定时", "多渠道", "浏览器"],
    tipsKw: "OpenClaw 使用技巧 最佳实践 tips",
    bpKw: "OpenClaw 生产环境 配置 安全",
    installKw: "OpenClaw install setup 安装",
  },
  "claude-code": {
    primaryKw: "Claude Code 编程助手 教程 2025 2026",
    altKw: "claude-code anthropic CLI 使用",
    officialSources: [
      { label: "官方文档", url: "https://docs.anthropic.com/en/docs/claude-code" },
      { label: "GitHub", url: "https://github.com/anthropics/claude-code" },
    ],
    featureKeywords: ["代码", "重构", "测试", "git", "CLAUDE.md", "多文件"],
    tipsKw: "Claude Code 技巧 提示 效率",
    bpKw: "Claude Code 最佳实践 项目规范",
    installKw: "npm claude-code 安装 anthropic",
  },
  "codex": {
    primaryKw: "OpenAI Codex 编程 agent 教程 2025",
    altKw: "codex openai coding CLI",
    officialSources: [
      { label: "官方文档", url: "https://developers.openai.com/codex" },
      { label: "Platform", url: "https://platform.openai.com/docs/guides/code" },
    ],
    featureKeywords: ["沙箱", "代码生成", "审查", "diff", "端到端"],
    tipsKw: "Codex 使用技巧 prompt 优化",
    bpKw: "Codex 最佳实践 安全 coding",
    installKw: "npm @openai/codex install",
  },
  "hermes": {
    primaryKw: "Hermes Agent 编程助手 教程 2025",
    altKw: "hermes-agent python 代码执行 工具",
    officialSources: [
      { label: "官网", url: "https://hermes-agent.lzw.me/" },
      { label: "文档", url: "https://hermes-agent.lzw.me/docs/user-guide/features/code-execution" },
    ],
    featureKeywords: ["execute_code", "python", "token 节省", "web_search", "工具"],
    tipsKw: "Hermes agent 使用技巧 工作流",
    bpKw: "Hermes agent 最佳实践",
    installKw: "hermes install python 安装",
  },
  "gemini": {
    primaryKw: "Gemini CLI 教程 2025 2026 Google AI",
    altKw: "gemini-cli google MCP 工具",
    officialSources: [
      { label: "GitHub", url: "https://github.com/google-gemini/gemini-cli" },
      { label: "AI Studio", url: "https://ai.google.dev/gemini-api/docs" },
    ],
    featureKeywords: ["上下文", "联网", "MCP", "多模态", "免费"],
    tipsKw: "Gemini CLI 技巧 效率 prompt",
    bpKw: "Gemini CLI 最佳实践 项目",
    installKw: "npm gemini-cli install google",
  },
  "doubao": {
    primaryKw: "豆包编程 火山引擎 Trae 教程 2025 2026",
    altKw: "doubao-seed 字节跳动 coding plan",
    officialSources: [
      { label: "火山引擎", url: "https://www.volcengine.com/product/doubao" },
      { label: "文档", url: "https://www.volcengine.com/docs/82379" },
      { label: "Trae IDE", url: "https://www.trae.com/" },
    ],
    featureKeywords: ["代码模型", "IDE集成", "额度共享", "Auto模式", "中文"],
    tipsKw: "豆包编程 技巧 效率 字节",
    bpKw: "豆包 火山方舟 最佳实践",
    installKw: "Trae IDE 豆包 安装 配置",
  },
  "qwen": {
    primaryKw: "通义千问 灵码 阿里云 编程助手 教程 2025 2026",
    altKw: "qwen code dashscope 阿里云 coding",
    officialSources: [
      { label: "通义千问", url: "https://tongyi.aliyun.com/" },
      { label: "灵码文档", url: "https://help.aliyun.com/zh/lingma/" },
      { label: "DashScope", url: "https://dashscope.aliyun.com/" },
    ],
    featureKeywords: ["代码补全", "单元测试", "问答", "RAG", "私有部署"],
    tipsKw: "通义灵码 技巧 效率 prompt",
    bpKw: "通义千问 最佳实践 企业",
    installKw: "VS Code JetBrains 通义灵码 安装",
  },
  "kimi": {
    primaryKw: "Kimi 月之暗面 AI 编程 教程 2025 2026 moonshot",
    altKw: "kimi-k2.5 moonshot API 编程",
    officialSources: [
      { label: "Kimi官网", url: "https://www.kimi.com/" },
      { label: "Moonshot平台", url: "https://platform.moonshot.cn/docs" },
      { label: "Kimi API", url: "https://platform.moonshot.cn/" },
    ],
    featureKeywords: ["长上下文", "128k", "代码分析", "PDF", "API兼容"],
    tipsKw: "Kimi 编程 技巧 上下文 效率",
    bpKw: "Kimi moonshot API 最佳实践",
    installKw: "Moonshot API Kimi key 安装",
  },
  "mimo": {
    primaryKw: "小米 MiMo 大模型 编程工具 教程 2025 2026",
    altKw: "MiMo-V2.5-Pro agent coding 小米 AI",
    officialSources: [
      { label: "MiMo 官网", url: "https://mimo.mi.com/" },
      { label: "MiMo Studio", url: "https://aistudio.xiaomimimo.com/" },
      { label: "MiMo API", url: "https://www.mimo-v2.com/zh" },
    ],
    featureKeywords: ["Agent能力", "长程推理", "软件工程", "1M上下文", "开源", "MIT协议"],
    tipsKw: "MiMo 使用技巧 prompt 编程",
    bpKw: "MiMo 最佳实践 API 调用",
    installKw: "MiMo API key 安装 SDK",
  },
};

// ===================== 工具函数 ======================

/**
 * 智能判断内容是否与目标工具相关
 */
function isRelevant(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

/**
 * 从搜索结果中提取描述性文字
 */
function extractDescription(results: SearchResult[]): string {
  for (const r of results) {
    if (r.snippet && r.snippet.length > 30) {
      return r.snippet.replace(/\s+/g, " ").trim().slice(0, 200);
    }
  }
  return "";
}

/**
 * 从搜索结果中提取特色功能
 */
function extractFeatures(results: SearchResult[], keywords: string[]): string[] {
  const features: Set<string> = new Set();
  for (const r of results) {
    const text = r.title + " " + r.snippet;
    for (const kw of keywords) {
      if (text.toLowerCase().includes(kw.toLowerCase()) && kw.length > 2) {
        features.add(kw);
      }
    }
  }
  return Array.from(features).slice(0, 6);
}

/**
 * 从搜索结果中提取技巧
 */
function extractTips(results: SearchResult[]): string[] {
  const tips: string[] = [];
  for (const r of results) {
    const text = (r.title + " " + r.snippet).toLowerCase();
    if (
      text.includes("技巧") ||
      text.includes("tip") ||
      text.includes("提示") ||
      text.includes("经验") ||
      text.includes("注意")
    ) {
      const line = r.snippet.replace(/\s+/g, " ").trim().slice(0, 100);
      if (line && tips.length < 4) tips.push(line);
    }
  }
  return tips.length > 0 ? tips : ["关注官方更新，持续学习新功能"];
}

/**
 * 从搜索结果中提取最佳实践
 */
function extractBestPractices(results: SearchResult[]): string[] {
  const bps: string[] = [];
  for (const r of results) {
    const text = (r.title + " " + r.snippet).toLowerCase();
    if (
      text.includes("最佳实践") ||
      text.includes("best practice") ||
      text.includes("建议") ||
      text.includes("规范")
    ) {
      const line = r.snippet.replace(/\s+/g, " ").trim().slice(0, 100);
      if (line && bps.length < 3) bps.push(line);
    }
  }
  return bps.length > 0 ? bps : ["遵循官方文档推荐的使用方式"];
}

/**
 * 为单个工具生成动态教程数据
 */
async function buildTutorialForTool(
  toolId: string,
  staticTutorial: Tutorial
): Promise<Tutorial> {
  const config = TOOL_SEARCH_CONFIGS[toolId];
  if (!config) return staticTutorial;

  try {
    // 并行搜索多个关键词
    const [primaryResults, altResults, tipsResults, bpResults] = await Promise.all([
      searchWeb(config.primaryKw),
      searchWeb(config.altKw),
      searchWeb(config.tipsKw),
      searchWeb(config.bpKw),
    ]);

    const allResults = [...primaryResults, ...altResults];

    // 合并搜索结果，去重
    const seen = new Set<string>();
    const deduped = allResults.filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });

    // 动态更新描述（如果搜到了更有意义的内容）
    const dynamicDesc = extractDescription(deduped);
    const dynamicFeatures = extractFeatures(deduped, config.featureKeywords);
    const dynamicTips = extractTips(tipsResults);
    const dynamicBP = extractBestPractices(bpResults);

    const tutorial: Tutorial = {
      ...staticTutorial,
      description: dynamicDesc || staticTutorial.description,
      features: dynamicFeatures.length > 0 ? dynamicFeatures : staticTutorial.features,
      tips: dynamicTips.length > 0 ? dynamicTips : staticTutorial.tips,
      bestPractices: dynamicBP.length > 0 ? dynamicBP : staticTutorial.bestPractices,
      // 更新官方链接（保留原有的，优先展示官方来源）
      officialSources: config.officialSources.map((s) => ({
        label: s.label,
        url: s.url,
        source: "official" as const,
        detectedAt: new Date().toISOString(),
      })),
    };

    return tutorial;
  } catch (error) {
    console.error(`[tutorials] Failed to fetch dynamic content for ${toolId}:`, error);
    return staticTutorial;
  }
}

// ===================== 主导出函数 ======================

/**
 * 获取所有教程（静态 + 动态混合）
 * - 先取静态数据
 * - 再异步并行补充动态内容（描述、功能、技巧、最佳实践来自最新搜索）
 */
export async function fetchTutorials(): Promise<Tutorial[]> {
  // 每次都并行抓取所有工具的最新内容
  const enriched = await Promise.all(
    TUTORIALS.map((t) => buildTutorialForTool(t.id, t))
  );

  return enriched;
}

/**
 * 获取单个工具的动态教程（用于按需刷新）
 */
export async function fetchTutorialById(id: string): Promise<Tutorial | null> {
  const static_ = TUTORIALS.find((t) => t.id === id);
  if (!static_) return null;
  return buildTutorialForTool(id, static_);
}