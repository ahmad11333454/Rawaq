import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retrieveTapCharge } from "@/lib/tap";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chargeId = body.id as string | undefined;
    if (!chargeId) {
      return NextResponse.json({ error: "missing charge id" }, { status: 400 });
    }

    const charge = await retrieveTapCharge(chargeId);
    const orderId = charge.reference?.order ?? charge.metadata?.order_id;
    if (!orderId) {
      return NextResponse.json({ error: "missing order reference" }, { status: 400 });
    }

    const statusMap: Record<string, string> = {
      CAPTURED: "paid",
      FAILED: "cancelled",
      CANCELLED: "cancelled",
      DECLINED: "cancelled",
      INITIATED: "pending",
      ABANDONED: "cancelled",
    };

    const newStatus = statusMap[charge.status] ?? "pending";

    await db.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        paymentMethod: "tap",
      },
    });

    if (newStatus === "paid") {
      const order = await db.order.findUnique({ where: { id: orderId }, include: { orderItems: true } });
      if (order) {
        for (const item of order.orderItems) {
          if (item.isDigital) {
            await db.digitalDelivery.create({ data: { orderItemId: item.id, downloadUrl: "" } });
          }
          await db.branchStock.updateMany({ where: { productId: item.productId }, data: { stock: { decrement: item.quantity } } });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
