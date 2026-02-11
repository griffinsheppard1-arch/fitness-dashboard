import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  const secret = process.env.REVALIDATE_SECRET;

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidatePath("/daily");
  revalidatePath("/weekly");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
