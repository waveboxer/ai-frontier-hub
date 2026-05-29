"use client";

import { useState } from "react";
import type { Tutorial } from "@/lib/types";

function TutorialPanel({ tutorial }: { tutorial: Tutorial }) {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-400">{tutorial.description}</p>

      <Section title="📦 安装配置">
        <ol className="space-y-3">
          {tutorial.install.map((step, i) => (
            <li key={step.title} className="text-sm">
              <span className="font-medium text-slate-200">
                {i + 1}. {step.title}
              </span>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300 whitespace-pre-wrap">
                {step.content}
              </pre>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="✨ 核心功能">
        <ul className="grid gap-2 sm:grid-cols-2">
          {tutorial.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-slate-400">
              <span className="text-cyan-400">•</span>
              {f}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="⌨️ 常用命令">
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <tbody>
              {tutorial.commands.map((c) => (
                <tr key={c.cmd} className="border-t border-slate-800 first:border-0">
                  <td className="px-4 py-2 font-mono text-cyan-300 whitespace-nowrap">
                    {c.cmd}
                  </td>
                  <td className="px-4 py-2 text-slate-400">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="grid gap-6 sm:grid-cols-2">
        <Section title="💡 使用技巧">
          <ul className="space-y-2">
            {tutorial.tips.map((t) => (
              <li key={t} className="text-sm text-slate-400">
                • {t}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="🏅 最佳实践">
          <ul className="space-y-2">
            {tutorial.bestPractices.map((b) => (
              <li key={b} className="text-sm text-slate-400">
                • {b}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={`/view?url=${encodeURIComponent(tutorial.officialUrl)}&title=${encodeURIComponent(tutorial.name + ' 官方网站')}&source=${encodeURIComponent(tutorial.name)}`}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
        >
          官方网站 →
        </a>
        {tutorial.docUrl && (
          <a
            href={`/view?url=${encodeURIComponent(tutorial.docUrl)}&title=${encodeURIComponent(tutorial.name + ' 官方文档')}&source=${encodeURIComponent(tutorial.name)}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500"
          >
            查看文档 →
          </a>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-slate-200">{title}</h4>
      {children}
    </div>
  );
}

export function TutorialsSection({ tutorials }: { tutorials: Tutorial[] }) {
  const [activeId, setActiveId] = useState(tutorials[0]?.id ?? "");
  const active = tutorials.find((t) => t.id === activeId) ?? tutorials[0];

  return (
    <section id="tutorials" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">📚</span>
        <div>
          <h2 className="text-xl font-bold text-white">AI 编程工具教程</h2>
          <p className="text-sm text-slate-400">
            OpenClaw · Claude Code · Codex · Hermes · Gemini · 豆包 · 千问 · Kimi · MiMo
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tutorials.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              activeId === t.id
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-white"
            }`}
          >
            {t.emoji} {t.name}
          </button>
        ))}
      </div>

      {active && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="mb-6 flex items-start gap-4">
            <span className="text-4xl">{active.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{active.name}</h3>
              <p className="text-sm text-cyan-400">{active.tagline}</p>
              <p className="mt-1 text-xs text-slate-500">{active.vendor}</p>
            </div>
          </div>
          <TutorialPanel tutorial={active} />
        </div>
      )}
    </section>
  );
}
