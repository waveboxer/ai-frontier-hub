import { NextResponse } from "next/server";
import { fetchTutorials } from "@/lib/data/tutorials";

export async function GET() {
  const data = fetchTutorials();
  return NextResponse.json({
    data,
    updatedAt: new Date().toISOString(),
    count: data.length,
  });
}
