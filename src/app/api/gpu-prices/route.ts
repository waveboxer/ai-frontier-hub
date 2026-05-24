import { NextResponse } from "next/server";
import {
  fetchHardwarePrices,
  getHardwareSummary,
} from "@/lib/fetchers/hardware-prices";

export const revalidate = 1800;

/** @deprecated Use /api/hardware instead */
export async function GET() {
  try {
    const listings = await fetchHardwarePrices();
    const summary = getHardwareSummary(listings);
    return NextResponse.json({
      data: listings,
      summary,
      updatedAt: new Date().toISOString(),
      source: "NowInStock.net",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GPU prices", message: String(error) },
      { status: 500 }
    );
  }
}
