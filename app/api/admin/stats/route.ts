import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [products, orders, revenue, pending] = await Promise.all([
      db.products.count(),
      db.orders.count(),
      db.orders.aggregate({ _sum: { total: true } }),
      db.orders.count({ where: { status: "pending" } }),
    ]);

    return NextResponse.json({
      products,
      orders,
      revenue: revenue._sum.total ?? 0,
      pending,
    });
  } catch {
    return NextResponse.json(
      { error: "تعذر جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
