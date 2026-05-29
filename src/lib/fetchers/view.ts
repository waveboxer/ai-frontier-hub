import * as cheerio from "cheerio";

export interface FetchResult {
  title?: string;
  description?: string;
  content?: string;
  error?: string;
}

const FETCH_TIMEOUT = 10000; // 10 seconds
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 AI-Frontier-Hub/1.0 (+https://aifh.top)";

// ──────────────────────────────────────────────
// Main entry
// ──────────────────────────────────────────────

export async function fetchAndClean(url: string): Promise<FetchResult> {
  let html: string;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      cache: "no-store",
    });

    clearTimeout(timer);

    if (!response.ok) {
      return {
        error: `目标服务器返回错误状态码 ${response.status} ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return {
        error: `该链接指向的文件类型（${contentType}）不是网页，无法预览。`,
      };
    }

    html = await response.text();
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.name === "AbortError") {
        return { error: "请求超时（10秒），目标服务器响应过慢。" };
      }
      return { error: `网络错误：${e.message}` };
    }
    return { error: "未知错误，请稍后重试。" };
  }

  if (html.length < 200) {
    return { error: "目标页面内容为空或无法读取。" };
  }

  return parseAndClean(html, url);
}

// ──────────────────────────────────────────────
// HTML parsing & cleaning
// ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CheerioAny = cheerio.Cheerio<any>;

function parseAndClean(html: string, baseUrl: string): FetchResult {
  const $ = cheerio.load(html);

  // ── Remove noise elements ──────────────────────
  const removeSelectors = [
    // Navigation & chrome
    "nav", "header:not(article header)", "footer:not(article footer)",
    ".navbar", ".nav", ".menu", ".sidebar", ".side-bar",
    ".header", ".footer", ".topbar", ".bottom-bar",
    // Ads & popups
    "script", "style", "noscript", "iframe",
    "aside", ".ad", ".ads", ".advertisement", ".sponsor",
    "[class*=ad-]", "[class*=-ad]", "[id*=ad-]", "[id*=-ad]",
    "[class*=AdSpace]", "[class*=banner]", "[class*=popup]", "[class*=modal]",
    ".cookie-banner", ".cookie-notice", ".gdpr",
    // Social & tracking
    ".social", ".share", ".sharing", ".social-share",
    "[class*=social]", "[class*=share]",
    ".comment", ".comments", ".comment-section", "#comments",
    ".related", ".related-posts", ".recommended",
    ".newsletter", ".subscribe", ".subscription",
    // Decorative & redundant
    ".breadcrumb", ".breadcrumbs", ".pagination",
    ".popup", ".overlay", ".mask",
    // Video/audio containers
    "video", "audio", "canvas",
    // Forms
    "form",
    ".search-box", ".search-form",
    // Misc noise
    ".toolbar", ".actions", ".meta",
    "[class*=toolbar]", "[class*=action-bar]",
    ".sticky", "[class*=sticky]",
    "input", "textarea", "select", "button",
  ];

  removeSelectors.forEach((sel) => {
    try { $(sel).remove(); } catch { /* ignore invalid selectors */ }
  });

  // ── Extract metadata ───────────────────────────
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    undefined;

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    undefined;

  // ── Find main content area ────────────────────
  let $content: CheerioAny | null = null;

  const contentSelectors = [
    "article",
    '[role="main"]',
    "main",
    ".article-content", ".article-body", ".post-content", ".post-body",
    ".entry-content", ".entry-body",
    ".content-body", ".content-wrapper",
    ".story-body", ".story-content",
    "#article", "#content", "#main-content",
    ".main-content", ".page-content",
    ".md-content", ".article", ".post", ".entry",
    "#body", ".body",
  ];

  for (const sel of contentSelectors) {
    const found = $(sel).first();
    if (found.length && found.text().trim().length > 200) {
      $content = found;
      break;
    }
  }

  // Fallback: body
  if (!$content) {
    $content = $("body");
  }

  // ── Clone and clean content area ──────────────
  const $clean = $content.clone() as CheerioAny;

  $clean.find(
    "script, style, noscript, iframe, aside, .ad, .ads, .advertisement, " +
    "[class*=ad-], [class*=-ad], [class*=social], [class*=share], " +
    ".related, .recommended, .newsletter, .subscribe, " +
    ".breadcrumb, .pagination, .popup, .cookie-banner, " +
    ".toolbar, .actions, .sticky, form, input, button"
  ).remove();

  // Clean attributes (keep only essential ones, rewrite URLs)
  cleanAttributes($clean, baseUrl);

  // Remove empty elements that clutter output
  $clean.find("*").each(function() {
    const el = this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $el = $clean.find(this as any);
    const tag = el.tagName.toLowerCase();
    const text = $el.text().trim();
    const hasChildren = $el.children().length > 0;
    const hasMedia = tag === "img" || tag === "video" || tag === "audio" || tag === "picture";

    if (!hasChildren && !text && !hasMedia) {
      $el.remove();
    } else {
      // Strip dangerous attributes
      delete el.attribs?.["style"];
      delete el.attribs?.["onclick"];
      delete el.attribs?.["onload"];
    }
  });

  let content = $clean.html() ?? "";

  // Limit very large pages
  if (content.length > 150_000) {
    content = content.slice(0, 150_000) + "\n<p>……（内容过长，已截断）</p>";
  }

  return {
    title: title?.slice(0, 200),
    description: description?.slice(0, 300),
    content,
  };
}

// ──────────────────────────────────────────────
// Attribute cleaning & URL rewriting
// ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanAttributes($root: CheerioAny, baseUrl: string) {
  const ALLOWED_ATTRS = new Set([
    "href", "src", "alt", "title",
    "width", "height",
    "class", "id",
    "colspan", "rowspan", "scope",
  ]);

  const SAFE_PROTOCOLS = ["https:", "http:"];

  $root.find("*").each(function() {
    const el = this as { attribs?: Record<string, string> };
    if (!el.attribs) return;

    for (const attr of Object.keys(el.attribs)) {
      const val = el.attribs[attr];

      if (attr === "href" || attr === "src") {
        if (!val) { delete el.attribs[attr]; continue; }
        try {
          const resolved = new URL(val, baseUrl);
          if (!SAFE_PROTOCOLS.includes(resolved.protocol)) {
            delete el.attribs[attr];
            continue;
          }
          el.attribs[attr] = resolved.href;
        } catch {
          delete el.attribs[attr];
        }
        continue;
      }

      if (!ALLOWED_ATTRS.has(attr)) {
        delete el.attribs[attr];
      }
    }
  });

  // Clean img attributes
  $root.find("img").each(function() {
    const el = this as { attribs?: Record<string, string> };
    if (!el.attribs) return;
    delete el.attribs["srcset"];
    delete el.attribs["sizes"];
    delete el.attribs["loading"];
    if (el.attribs["alt"] && !el.attribs["title"]) {
      el.attribs["title"] = el.attribs["alt"];
    }
  });

  // Rewrite external <a href> through our /view proxy
  $root.find("a").each(function() {
    const el = this as { attribs?: Record<string, string> };
    if (!el.attribs?.href) return;
    const href = el.attribs.href;
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const resolved = new URL(href, baseUrl);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        el.attribs.href = `/view?url=${encodeURIComponent(resolved.href)}`;
      }
    } catch {
      // leave as-is
    }
  });
}
