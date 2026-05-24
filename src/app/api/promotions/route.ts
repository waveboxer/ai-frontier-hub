import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchers/news";
import { fetchPromotions } from "@/lib/fetchers/promotions";

export const revalidate = 1800;

export async function GET() {
  try {
    const news = await fetchNews();
    const data = await fetchPromotions(news);
    return NextResponse.json({
      data,
      updatedAt: new Date().toISOString(),
      count: data.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch promotions", message: String(error) },
      { status: 500 }
    );
  }
}
