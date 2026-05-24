import { NextResponse } from "next/server";
import { fetchLeaderboard } from "@/lib/fetchers/leaderboard";

export const revalidate = 3600;

export async function GET() {
  try {
    const result = await fetchLeaderboard();
    return NextResponse.json({
      data: result.models,
      updatedAt: result.fetchedAt,
      source: result.source,
      count: result.models.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard", message: String(error) },
      { status: 500 }
    );
  }
}
