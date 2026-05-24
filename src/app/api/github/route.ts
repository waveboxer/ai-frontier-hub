import { NextResponse } from "next/server";
import { fetchGitHubProjects } from "@/lib/fetchers/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await fetchGitHubProjects();
    return NextResponse.json({
      data,
      updatedAt: new Date().toISOString(),
      source: "GitHub Trending + GitHub Search API",
      counts: {
        trending: data.trending.length,
        latest: data.latest.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub projects", message: String(error) },
      { status: 500 }
    );
  }
}
