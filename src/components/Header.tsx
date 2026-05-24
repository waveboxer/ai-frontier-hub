const NAV = [
  { href: "#news", label: "新闻", icon: "📰" },
  { href: "#hardware", label: "硬件行情", icon: "💰" },
  { href: "#promotions", label: "Token 促销", icon: "🎁" },
  { href: "#applications", label: "应用落地", icon: "🚀" },
  { href: "#github", label: "GitHub", icon: "⭐" },
  { href: "#leaderboard", label: "排行榜", icon: "🏆" },
  { href: "#tutorials", label: "教程", icon: "📚" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <a href="#" className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-lg font-bold text-transparent">
            AI Frontier Hub
          </span>
        </a>
        <nav className="hidden gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
