import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.categories.findMany({
    orderBy: { sort_order: "asc" },
  });
  return NextResponse.json(categories);
}
