import * as cheerio from "cheerio";
import type { HardwareListing, HardwareSummary } from "@/lib/types";

type HardwareCategory = "gpu" | "cpu" | "memory";

interface HardwareSource {
  category: HardwareCategory;
  brand: string;
  model: string;
  slug: string;
}

const HARDWARE_SOURCES: HardwareSource[] = [
  // GPU
  { category: "gpu", brand: "NVIDIA", model: "RTX 5090", slug: "nvidia/rtx5090" },
  { category: "gpu", brand: "NVIDIA", model: "RTX 5080", slug: "nvidia/rtx5080" },
  { category: "gpu", brand: "NVIDIA", model: "RTX 5070 Ti", slug: "nvidia/rtx5070ti" },
  { category: "gpu", brand: "NVIDIA", model: "RTX 4090", slug: "nvidia/rtx4090" },
  { category: "gpu", brand: "AMD", model: "RX 9070 XT", slug: "amd/rx9070xt" },
  { category: "gpu", brand: "AMD", model: "RX 7900 XTX", slug: "amd/rx7900xtx" },
  // CPU
  { category: "cpu", brand: "Intel", model: "Core Ultra 9 285K", slug: "intel/coreultra9285k" },
  { category: "cpu", brand: "Intel", model: "Core i9-14900K", slug: "intel/corei914900k" },
  { category: "cpu", brand: "AMD", model: "Ryzen 9 9950X", slug: "amd/ryzen99950x" },
  { category: "cpu", brand: "AMD", model: "Ryzen 7 9800X3D", slug: "amd/ryzen79800x3d" },
  // Memory
  { category: "memory", brand: "DDR5", model: "32GB Kit", slug: "ddr5/32gb" },
  { category: "memory", brand: "DDR5", model: "64GB Kit", slug: "ddr5/64gb" },
  { category: "memory", brand: "DDR5", model: "96GB Kit", slug: "ddr5/96gb" },
];

const CATEGORY_PATH: Record<HardwareCategory, string> = {
  gpu: "videocards",
  cpu: "cpucoolers",
  memory: "memory",
};

function parsePrice(price: string): number | null {
  if (!price || price === "-" || /see site/i.test(price)) return null;
  const match = price.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

async function fetchHardwareModel(
  category: HardwareCategory,
  brand: string,
  model: string,
  slug: string
): Promise<HardwareListing[]> {
  try {
    const basePath = CATEGORY_PATH[category];
    const res = await fetch(
      `https://www.nowinstock.net/computers/${basePath}/${slug}/`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AI-Frontier-Hub/1.0)" },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const listings: HardwareListing[] = [];

    $("table tr").each((_, el) => {
      const tds = $(el).find("td");
      if (tds.length < 4) return;

      const name = $(tds[0]).text().trim();
      const status = $(tds[1]).text().trim();
      const price = $(tds[2]).text().trim();
      const link = $(tds[0]).find("a").attr("href");
      const retailer = name.split(":").pop()?.trim() ?? "Unknown";
      const inStock = /in stock/i.test(status);

      if (!name) return;

      listings.push({
        name: name.split(":")[0]?.trim() ?? name,
        model,
        brand,
        category,
        status,
        price,
        priceValue: parsePrice(price),
        retailer,
        link,
        inStock,
      });
    });

    return listings;
  } catch {
    return [];
  }
}

export async function fetchHardwarePrices(): Promise<HardwareListing[]> {
  const results = await Promise.all(
    HARDWARE_SOURCES.map(({ category, brand, model, slug }) =>
      fetchHardwareModel(category, brand, model, slug)
    )
  );

  const all = results.flat();
  const inStock = all.filter((g) => g.inStock && g.priceValue !== null);
  const outOfStock = all.filter((g) => !g.inStock && g.priceValue !== null);

  inStock.sort((a, b) => (a.priceValue ?? 0) - (b.priceValue ?? 0));
  outOfStock.sort((a, b) => (a.priceValue ?? 0) - (b.priceValue ?? 0));

  return [...inStock, ...outOfStock].slice(0, 60);
}

export function getHardwareSummary(
  listings: HardwareListing[]
): HardwareSummary[] {
  const byModel = new Map<string, HardwareListing[]>();
  for (const item of listings) {
    const key = `${item.category}-${item.brand}-${item.model}`;
    if (!byModel.has(key)) byModel.set(key, []);
    byModel.get(key)!.push(item);
  }

  return Array.from(byModel.entries()).map(([, items]) => {
    const inStockItems = items.filter((i) => i.inStock && i.priceValue);
    const pricedItems = items.filter((i) => i.priceValue);
    const cheapest = inStockItems.length
      ? inStockItems.reduce((a, b) =>
          (a.priceValue ?? Infinity) < (b.priceValue ?? Infinity) ? a : b
        )
      : pricedItems.length
        ? pricedItems.reduce((a, b) =>
            (a.priceValue ?? Infinity) < (b.priceValue ?? Infinity) ? a : b
          )
        : null;

    const first = items[0];
    return {
      model: `${first.brand} ${first.model}`,
      brand: first.brand,
      category: first.category,
      inStockCount: inStockItems.length,
      totalListings: items.length,
      lowestPrice: cheapest?.price ?? "N/A",
      lowestPriceValue: cheapest?.priceValue ?? null,
      status: inStockItems.length > 0 ? "有货" : "缺货",
    };
  });
}

// Legacy exports
export const fetchGPUPrices = fetchHardwarePrices;
export const getGPUSummary = getHardwareSummary;
