export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  description?: string;
  category?: "industry" | "tech" | "product" | "general";
}

export interface HardwareListing {
  name: string;
  model: string;
  brand: string;
  category: "gpu" | "cpu" | "memory";
  status: string;
  price: string;
  priceValue: number | null;
  retailer: string;
  link?: string;
  inStock: boolean;
}

export interface HardwareSummary {
  model: string;
  brand: string;
  category: "gpu" | "cpu" | "memory";
  inStockCount: number;
  totalListings: number;
  lowestPrice: string;
  lowestPriceValue: number | null;
  status: string;
}

export interface Promotion {
  id: string;
  provider: string;
  title: string;
  description: string;
  type: "discount" | "free_tier" | "credit" | "price_drop" | "new_offer";
  region: "domestic" | "international";
  url: string;
  detectedAt: string;
  source: "official" | "news";
}

export interface ApplicationCase {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  pubDate: string;
  industry?: string;
  company?: string;
}

export interface LeaderboardModel {
  rank: number;
  model: string;
  vendor: string | null;
  score: number | null;
  ci: number | null;
  votes: number | null;
  license: string | null;
}

export interface OfficialSource {
  label: string;
  url: string;
  source: "official" | "news" | "community";
  detectedAt: string;
}

export interface TutorialStep {
  title: string;
  content: string;
}

export interface Tutorial {
  id: string;
  name: string;
  vendor: string;
  emoji: string;
  tagline: string;
  description: string;
  officialUrl: string;
  docUrl?: string;
  install: TutorialStep[];
  features: string[];
  commands: { cmd: string; desc: string }[];
  tips: string[];
  bestPractices: string[];
  officialSources?: OfficialSource[];
}

export interface GitHubRepo {
  id: string;
  fullName: string;
  owner: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  category: "trending" | "latest";
  trendLabel?: string;
  isAiRelated: boolean;
  createdAt?: string;
  updatedAt?: string;
  topics?: string[];
}

export interface GitHubProjects {
  trending: GitHubRepo[];
  latest: GitHubRepo[];
}

export interface ApiResponse<T> {
  data: T;
  updatedAt: string;
  source?: string;
}

// Legacy alias
export type GPUListing = HardwareListing;
