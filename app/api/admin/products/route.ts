import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const products = await db.products.findMany({
    include: { category: true },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name_ar,
    slug,
    description_ar,
    price,
    cost,
    stock,
    is_digital,
    image_url,
    status,
    category_id,
  } = body;

  if (!name_ar || !slug || price === undefined) {
    return NextResponse.json({ error: "الاسم والرابط والسعر مطلوبة" }, { status: 400 });
  }

  const product = await db.products.create({
    data: {
      name_ar,
      slug,
      description_ar: description_ar || null,
      price: Number(price),
      cost: cost ? Number(cost) : null,
      stock: Number(stock) || 0,
      is_digital: Boolean(is_digital),
      image_url: image_url || null,
      status: status || "draft",
      category_id: category_id || null,
    },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
