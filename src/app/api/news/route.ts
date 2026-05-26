import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchers/news";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await fetchNews();
    return NextResponse.json({
      data,
      updatedAt: new Date().toISOString(),
      count: data.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news", message: String(error) },
      { status: 500 }
    );
  }
}
