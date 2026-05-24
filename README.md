# AI Frontier Hub

一站式 AI 前沿资讯聚合平台。

## 功能

1. **📰 AI 科技新闻** — 聚焦大模型、算力硬件等 AI 相关资讯（36氪 · 量子位 · 机器之心）
2. **💰 算力硬件行情** — GPU / CPU / 内存最新市场价格（NowInStock）
3. **🎁 Token 促销活动** — 国内外大模型 API 优惠追踪（国内 + 国际分区）
4. **🚀 AI 应用落地** — 行业商用部署与规模化落地案例
5. **⭐ GitHub 项目推荐** — 本周 Trending 热门 + 最新 AI 开源项目
6. **🏆 大模型排行榜** — LMSYS Chatbot Arena 实时 ELO 排名
7. **📚 AI 编程教程** — OpenClaw、Claude Code、Codex、Hermes、Gemini、豆包、千问、Kimi

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## API 端点

| 端点 | 说明 |
|------|------|
| `/api/news` | AI 科技新闻 |
| `/api/hardware` | 算力硬件行情 |
| `/api/promotions` | Token 促销 |
| `/api/applications` | 应用落地 |
| `/api/github` | GitHub 项目 |
| `/api/leaderboard` | 大模型排行榜 |
| `/api/tutorials` | AI 编程教程 |

## 技术栈

- Next.js 16 + TypeScript + Tailwind CSS
- RSS Parser（新闻）
- Cheerio（硬件价格抓取）
- GitHub Trending + Search API（项目推荐）
