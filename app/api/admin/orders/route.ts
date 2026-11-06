import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const orders = await db.orders.findMany({
      include: { customer: true },
      orderBy: { created_at: "desc" },
      take: 20,
    });

    return NextResponse.json(
      orders.map((o) => ({
        id: o.id,
        customer_name: o.customer?.name ?? o.customer?.phone ?? null,
        total: o.total,
        status: o.status,
        created_at: o.created_at,
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "تعذر جلب الطلبات" },
      { status: 500 }
    );
  }
}
