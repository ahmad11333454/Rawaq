import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const product = await db.products.update({
    where: { id: params.id },
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

  return NextResponse.json(product);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.products.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
