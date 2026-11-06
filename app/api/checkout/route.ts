import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTapCharge } from "@/lib/tap";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, branchId } = body as {
      items: { productId: string; quantity: number }[];
      customer: { name?: string; phone?: string; email?: string };
      branchId?: string;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    const products = await db.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, status: "active" },
    });

    if (products.length !== items.length) {
      return NextResponse.json({ error: "بعض المنتجات غير متوفرة" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const line = Number(product.price) * item.quantity;
      subtotal += line;
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        isDigital: product.isDigital,
      };
    });

    const shippingFee = 15;
    const total = subtotal + shippingFee;

    const customerRecord = customer.phone
      ? await db.customer.upsert({
          where: { phone: customer.phone },
          update: { name: customer.name, email: customer.email },
          create: { phone: customer.phone, name: customer.name, email: customer.email },
        })
      : await db.customer.create({ data: { name: customer.name, email: customer.email } });

    const order = await db.order.create({
      data: {
        customerId: customerRecord.id,
        branchId,
        status: "pending",
        subtotal,
        shippingFee,
        total,
        orderItems: { create: orderItems },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const charge = await createTapCharge({
      amount: total,
      orderId: order.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      description: `طلب رواق #${order.id.slice(0, 8)}`,
      redirectUrl: `${appUrl}/checkout/callback?order=${order.id}`,
      webhookUrl: `${appUrl}/api/webhooks/tap`,
      metadata: { order_id: order.id },
    });

    return NextResponse.json({ orderId: order.id, paymentUrl: charge.transaction.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "خطأ في الدفع" }, { status: 500 });
  }
}
