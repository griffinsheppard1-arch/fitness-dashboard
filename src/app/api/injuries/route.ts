import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.RENDER_API_URL || "https://strava-mcp-e0fy.onrender.com";
const API_KEY = process.env.API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_URL}/api/injuries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to create injury" },
      { status: 500 }
    );
  }
}
