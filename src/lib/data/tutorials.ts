import type { Tutorial } from "@/lib/types";

export const TUTORIALS: Tutorial[] = [
  {
    id: "openclaw",
    name: "OpenClaw",
    vendor: "OpenClaw",
    emoji: "🦞",
    tagline: "持久化 AI Agent 框架",
    description:
      "开源个人 AI 助手框架，支持 WhatsApp/Telegram/Slack 等多渠道、持久记忆、浏览器控制、Skills 插件生态，可将 Claude Code/Codex 等接入为 7×24 运行的智能体。",
    officialUrl: "https://openclaw.ai/",
    docUrl: "https://docs.openclaw.ai/",
    install: [
      {
        title: "一键安装",
        content:
          "macOS/Linux: curl -fsSL https://openclaw.ai/install.sh | bash\n或 npm i -g openclaw",
      },
      {
        title: "初始化向导",
        content: "运行 openclaw onboard，按提示配置 LLM API Key 与首选模型。",
      },
      {
        title: "安装 Coding Skill",
        content:
          "openclaw skills search coding\nopenclaw skills install coding-agent",
      },
    ],
    features: [
      "持久记忆：跨会话保留偏好与上下文",
      "多渠道接入：WhatsApp、Telegram、Discord、Slack 等",
      "浏览器控制：自动浏览、填表、抓取网页",
      "Skills 生态：ClawHub 一键安装扩展能力",
      "定时任务：Agent 可按 cron 自动运行",
    ],
    commands: [
      { cmd: "openclaw onboard", desc: "首次配置向导" },
      { cmd: "openclaw skills search <关键词>", desc: "搜索 Skills" },
      { cmd: "openclaw skills install <slug>", desc: "安装 Skill" },
      { cmd: "openclaw run <agent> --dry-run", desc: "试运行 Agent" },
      { cmd: "openclaw activate <agent>", desc: "激活 Agent 上线" },
      { cmd: "openclaw update --channel stable", desc: "更新到稳定版" },
    ],
    tips: [
      "先用 --dry-run 验证 Agent 配置再上线",
      "coding-agent Skill 可让 Agent 读写代码、跑测试、提交 Git",
      "敏感操作建议开启 sandbox 模式限制文件系统访问",
    ],
    bestPractices: [
      "Agent 配置文件用 YAML 描述 persona、schedule、tools",
      "通过 ClawHub 管理 Skills 版本与更新",
      "生产环境使用独立 API Key 并设置用量告警",
    ],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    vendor: "Anthropic",
    emoji: "🟠",
    tagline: "终端 AI 编程助手",
    description:
      "Anthropic 官方 CLI 编程工具，深度理解代码库，支持多文件编辑、运行命令、Git 操作，适合复杂重构与全栈开发。",
    officialUrl: "https://docs.anthropic.com/en/docs/claude-code",
    install: [
      {
        title: "安装 CLI",
        content:
          "npm install -g @anthropic-ai/claude-code\n或 brew install claude-code（macOS）",
      },
      {
        title: "登录认证",
        content:
          "运行 claude 后按提示 OAuth 登录 Anthropic 账号，或设置 ANTHROPIC_API_KEY 环境变量。",
      },
      {
        title: "项目初始化",
        content: "在项目根目录运行 claude，它会自动索引 CLAUDE.md 与代码结构。",
      },
    ],
    features: [
      "全仓库上下文理解与多文件协同编辑",
      "终端内直接运行测试、构建、Git 命令",
      "CLAUDE.md 项目级指令与规范定制",
      "支持 Plan 模式：先规划再执行",
      "与 VS Code / JetBrains 插件联动",
    ],
    commands: [
      { cmd: "claude", desc: "启动交互式会话" },
      { cmd: "claude -p \"修复登录 bug\"", desc: "单次 prompt 模式" },
      { cmd: "/init", desc: "生成 CLAUDE.md 项目说明" },
      { cmd: "/compact", desc: "压缩上下文节省 Token" },
      { cmd: "/review", desc: "代码审查模式" },
    ],
    tips: [
      "在项目根维护 CLAUDE.md 描述架构、命令、规范",
      "大改动前先让 Claude 输出计划，确认后再执行",
      "用 /compact 在长会话中控制上下文长度",
    ],
    bestPractices: [
      "分步骤描述需求，避免一次抛出过多变更",
      "关键修改后要求运行测试并展示结果",
      "敏感文件加入 .claudeignore 排除索引",
    ],
  },
  {
    id: "codex",
    name: "Codex",
    vendor: "OpenAI",
    emoji: "🟢",
    tagline: "OpenAI 云端编程 Agent",
    description:
      "OpenAI 推出的云端代码 Agent，可在隔离沙箱中读写文件、运行命令、完成端到端开发任务，支持 CLI 与 IDE 集成。",
    officialUrl: "https://developers.openai.com/codex",
    docUrl: "https://platform.openai.com/docs/guides/code",
    install: [
      {
        title: "安装 Codex CLI",
        content: "npm install -g @openai/codex\n或参考 OpenAI 官方最新安装指引",
      },
      {
        title: "配置 API Key",
        content: "export OPENAI_API_KEY=sk-...\n或在 ~/.codex/config 中配置",
      },
      {
        title: "首次运行",
        content: "在项目目录执行 codex，选择模型（如 o3 / gpt-4.1）开始任务。",
      },
    ],
    features: [
      "云端沙箱执行，安全隔离",
      "端到端任务：从需求到可运行代码",
      "支持多语言与全栈项目",
      "与 ChatGPT Plus/Pro 订阅联动",
      "可审查 diff 后再应用变更",
    ],
    commands: [
      { cmd: "codex", desc: "启动交互会话" },
      { cmd: "codex \"添加用户认证\"", desc: "直接描述任务" },
      { cmd: "codex --model o3", desc: "指定推理模型" },
      { cmd: "codex --approval manual", desc: "手动审批每次变更" },
    ],
    tips: [
      "复杂任务拆分为小步骤逐步完成",
      "开启 manual approval 避免意外大范围修改",
      "提供清晰的验收标准（测试通过、接口可用等）",
    ],
    bestPractices: [
      "任务描述包含技术栈、约束、预期输出",
      "每次变更后运行测试验证",
      "生产代码务必人工 Review diff",
    ],
  },
  {
    id: "hermes",
    name: "Hermes Agent",
    vendor: "Hermes",
    emoji: "⚡",
    tagline: "可编程多工具 Agent",
    description:
      "支持 execute_code 的 AI Agent 框架，可用 Python 脚本编排多步工具调用，显著减少 Token 消耗，适合自动化工作流。",
    officialUrl: "https://hermes-agent.lzw.me/",
    docUrl: "https://hermes-agent.lzw.me/docs/user-guide/features/code-execution",
    install: [
      {
        title: "安装 Hermes",
        content: "参考官方文档安装 Hermes Agent CLI 与依赖环境（Python 3.10+）。",
      },
      {
        title: "配置文件",
        content: "编辑 ~/.hermes/config.yaml，设置模型 API 与 code_execution.mode。",
      },
      {
        title: "验证安装",
        content: "运行 hermes 启动 Agent，测试 web_search、read_file 等基础工具。",
      },
    ],
    features: [
      "execute_code：Python 脚本编排多步工具调用",
      "中间结果不进入上下文，节省 Token",
      "支持 web_search、文件读写、终端、patch 等工具",
      "Unix 域套接字 RPC 通信",
      "可自定义 Agent 人设与工具集",
    ],
    commands: [
      { cmd: "hermes", desc: "启动 Agent 交互" },
      { cmd: "hermes --config ~/.hermes/config.yaml", desc: "指定配置" },
    ],
    tips: [
      "多步骤数据处理优先用 execute_code 而非逐步对话",
      "脚本中用 print() 输出最终结果给 LLM",
      "Windows 不支持代码执行，会自动回退顺序工具模式",
    ],
    bestPractices: [
      "复杂工作流写 Python 脚本一次性完成",
      "简单 shell 命令仍用 terminal 工具",
      "定期清理 ~/.hermes 缓存与日志",
    ],
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    vendor: "Google",
    emoji: "🔵",
    tagline: "Google 终端 AI 开发工具",
    description:
      "Google 推出的开源 Gemini CLI，基于 Gemini 2.5 Pro，支持大上下文、Google Search  grounding、MCP 协议，免费额度慷慨。",
    officialUrl: "https://github.com/google-gemini/gemini-cli",
    docUrl: "https://ai.google.dev/gemini-api/docs",
    install: [
      {
        title: "安装",
        content: "npm install -g @google/gemini-cli\n或 npx @google/gemini-cli",
      },
      {
        title: "认证",
        content:
          "运行 gemini 后 OAuth 登录 Google 账号，或设置 GEMINI_API_KEY / GOOGLE_API_KEY。",
      },
      {
        title: "项目配置",
        content: "在项目根创建 GEMINI.md 描述项目规范（类似 CLAUDE.md）。",
      },
    ],
    features: [
      "100 万 Token 上下文窗口",
      "内置 Google Search 联网能力",
      "MCP 协议扩展外部工具",
      "免费层额度高，适合日常开发",
      "支持多模态（图片、PDF 输入）",
    ],
    commands: [
      { cmd: "gemini", desc: "启动交互会话" },
      { cmd: "gemini -p \"解释这段代码\"", desc: "单次 prompt" },
      { cmd: "/mcp list", desc: "查看 MCP 服务" },
      { cmd: "/chat save <name>", desc: "保存会话" },
    ],
    tips: [
      "大仓库分析充分利用 1M 上下文",
      "用 GEMINI.md 定制项目级行为",
      "通过 MCP 接入数据库、API 等外部工具",
    ],
    bestPractices: [
      "敏感代码注意不要上传到非企业账号",
      "长任务分段并保存 checkpoint",
      "结合 AI Studio 调试 prompt 再迁移到 CLI",
    ],
  },
  {
    id: "doubao",
    name: "豆包编程",
    vendor: "字节跳动",
    emoji: "🫘",
    tagline: "火山引擎 AI 编程助手",
    description:
      "字节跳动豆包大模型驱动的编程工具，集成于 Trae IDE、火山方舟 Coding Plan，支持 Doubao-Seed 代码模型与多工具共享额度。",
    officialUrl: "https://www.volcengine.com/product/doubao",
    docUrl: "https://www.volcengine.com/docs/82379",
    install: [
      {
        title: "Trae IDE（推荐）",
        content: "下载 Trae 智能 IDE（trae.ai），登录字节账号，内置豆包编程能力。",
      },
      {
        title: "火山方舟 Coding Plan",
        content:
          "在火山方舟控制台开通 Coding Plan，获取 API Key 与 ark-code 端点。",
      },
      {
        title: "CLI 接入",
        content:
          "在 Claude Code / OpenClaw / Cursor 等工具中配置火山方舟 API 端点与模型名。",
      },
    ],
    features: [
      "Doubao-Seed-2.0-Code 前端代码能力突出",
      "Coding Plan 多工具共享额度",
      "支持 TRAE、Cursor、Claude Code 等接入",
      "Auto 模式智能匹配最优模型",
      "国内访问稳定、中文理解优秀",
    ],
    commands: [
      { cmd: "Model: doubao-seed-2.0-code", desc: "指定代码模型" },
      { cmd: "Model: ark-code-latest", desc: "自动最新代码模型" },
      { cmd: "Endpoint: ark.cn-beijing.volces.com/api/coding", desc: "Coding API" },
    ],
    tips: [
      "Coding Plan 额度在所有接入工具间共享，无需重复购买",
      "前端/React 项目优先用 doubao-seed-2.0-code",
      "复杂推理可切换 Kimi-K2.5 或 GLM-4.7",
    ],
    bestPractices: [
      "在火山方舟控制台监控用量与限流",
      "团队项目统一 Coding Plan 配置",
      "结合 Trae 获得最佳 IDE 集成体验",
    ],
  },
  {
    id: "qwen",
    name: "通义千问 / 灵码",
    vendor: "阿里云",
    emoji: "🌐",
    tagline: "阿里云 AI 编程全家桶",
    description:
      "通义千问大模型 + 通义灵码 IDE 插件，提供代码补全、单元测试生成、智能问答、项目级代码解释，深度集成 VS Code / JetBrains。",
    officialUrl: "https://tongyi.aliyun.com/",
    docUrl: "https://help.aliyun.com/zh/lingma/",
    install: [
      {
        title: "通义灵码插件",
        content:
          "VS Code / JetBrains 插件市场搜索「通义灵码」安装，阿里云账号登录。",
      },
      {
        title: "DashScope API",
        content:
          "控制台 dashscope.aliyun.com 开通服务，获取 API Key 用于 CLI / SDK 调用。",
      },
      {
        title: "Qwen Code CLI",
        content: "npm install -g @qwen-code/qwen-code（如可用）或参考官方最新 CLI 文档。",
      },
    ],
    features: [
      "行级/函数级实时代码补全",
      "自然语言生成代码与单元测试",
      "研发知识问答与异常排查",
      "Qwen3-Coder 等专用代码模型",
      "企业版支持私有部署与代码安全",
    ],
    commands: [
      { cmd: "/explain", desc: "解释选中代码" },
      { cmd: "/test", desc: "生成单元测试" },
      { cmd: "/doc", desc: "生成代码注释" },
      { cmd: "Tab", desc: "接受 inline 补全建议" },
    ],
    tips: [
      "选中代码后右键使用灵码快捷指令效率更高",
      "DashScope 新用户有免费 Token 额度",
      "Qwen3-Coder 适合复杂编程任务",
    ],
    bestPractices: [
      "企业项目开启代码不上传选项保护隐私",
      "结合 RAG 接入内部文档提升问答质量",
      "长函数优先写注释触发更准的补全",
    ],
  },
  {
    id: "kimi",
    name: "Kimi",
    vendor: "月之暗面",
    emoji: "🌙",
    tagline: "长上下文 AI 编程助手",
    description:
      "月之暗面 Kimi 大模型，以超长上下文著称，Kimi Code / CLI 支持大型代码库分析、Claude Code 接入，Moonshot API 面向开发者。",
    officialUrl: "https://www.kimi.com/",
    docUrl: "https://platform.moonshot.cn/docs",
    install: [
      {
        title: "Kimi 网页/App",
        content: "kimi.com 注册账号，可直接上传代码文件或粘贴代码片段分析。",
      },
      {
        title: "Moonshot API",
        content:
          "platform.moonshot.cn 注册开发者，获取 API Key，新用户赠送免费额度。",
      },
      {
        title: "Claude Code 接入",
        content:
          "配置 Moonshot API 端点 api.moonshot.cn/v1，模型 kimi-k2.5 用于编程任务。",
      },
    ],
    features: [
      "128K+ 超长上下文，适合大型代码库",
      "Kimi K2.5 代码与推理能力",
      "支持 PDF、代码文件上传分析",
      "OpenAI 兼容 API 格式",
      "Coding Plan 套餐支持多工具接入",
    ],
    commands: [
      { cmd: "Model: kimi-k2.5", desc: "最新旗舰模型" },
      { cmd: "Model: moonshot-v1-128k", desc: "长上下文模型" },
      { cmd: "Base URL: https://api.moonshot.cn/v1", desc: "API 端点" },
    ],
    tips: [
      "分析整个仓库时充分利用长上下文优势",
      "复杂 bug 附上完整错误栈和相关文件",
      "API 调用注意 RPM 限流，批量任务加 retry",
    ],
    bestPractices: [
      "大项目分析前先整理目录结构给 Kimi",
      "生产环境 API Key 不要提交到代码库",
      "结合 Kimi 做架构 review，Claude Code 做具体实现",
    ],
  },
  {
    id: "mimo",
    name: "MiMo",
    vendor: "小米",
    emoji: "📱",
    tagline: "小米多模态大模型 & Agent 平台",
    description:
      "小米 MiMo 多模态大模型（MiMo-V2.5-Pro），支持 1M 上下文窗口、Agent 能力、语音克隆与软件工程任务。已开源 MIT 协议，推出 Orbit 百万亿 Token 激励计划。",
    officialUrl: "https://mimo.mi.com/",
    docUrl: "https://aistudio.xiaomimimo.com/",
    install: [
      {
        title: "MiMo Studio",
        content: "访问 aistudio.xiaomimimo.com 注册小米账号，在线体验 MiMo-V2.5-Pro 全部能力。",
      },
      {
        title: "API 接入",
        content:
          "在 MiMo 开放平台申请 API Key，端点兼容 OpenAI 格式，模型名 mimo-v2.5-pro。",
      },
      {
        title: "开源部署（MIT）",
        content:
          "git clone 小米 MiMo 开源仓库，按 README 本地部署或私有化部署。",
      },
    ],
    features: [
      "MiMo-V2.5-Pro：最新旗舰多模态模型",
      "1M Token 超长上下文窗口",
      "Agent 能力：自主规划、工具调用、多步推理",
      "语音克隆：几秒样本即可复刻音色",
      "软件工程：代码生成、审查、重构",
      "MIT 开源协议，可商用",
    ],
    commands: [
      { cmd: "Model: mimo-v2.5-pro", desc: "旗舰多模态模型" },
      { cmd: "Studio: aistudio.xiaomimimo.com", desc: "在线体验平台" },
      { cmd: "Orbit Plan: mimo.mi.com/orbit", desc: "百万亿Token激励计划" },
    ],
    tips: [
      "Orbit 计划提供大量免费 Token，适合开发测试",
      "Agent 模式适合复杂多步编程任务",
      "语音克隆可用于 TTS / 语音交互场景",
    ],
    bestPractices: [
      "优先使用 Orbit 免费额度验证效果再决定付费方案",
      "长文档分析充分利用 1M 上下文",
      "结合 MiMo Studio 可视化调试 prompt 后再接入 API",
    ],
  },
];

export function fetchTutorials(): Tutorial[] {
  return TUTORIALS;
}
