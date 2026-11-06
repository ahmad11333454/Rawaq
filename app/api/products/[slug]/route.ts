import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, status: "active" },
    include: {
      category: true,
      productSuppliers: { include: { supplier: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }
  return NextResponse.json(product);
}