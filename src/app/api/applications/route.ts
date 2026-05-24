import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchers/news";
import { fetchApplications } from "@/lib/fetchers/applications";

export const revalidate = 900;

export async function GET() {
  try {
    const news = await fetchNews();
    const data = await fetchApplications(news);
    return NextResponse.json({
      data,
      updatedAt: new Date().toISOString(),
      count: data.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications", message: String(error) },
      { status: 500 }
    );
  }
}
