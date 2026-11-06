const TAP_SECRET_KEY = process.env.TAP_SECRET_KEY;
const TAP_API_URL = "https://api.tap.company/v2";

export type CreateChargeInput = {
  amount: number;
  currency?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId: string;
  description?: string;
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, string>;
};

export async function createTapCharge(input: CreateChargeInput) {
  if (!TAP_SECRET_KEY) {
    throw new Error("TAP_SECRET_KEY is not set");
  }

  const res = await fetch(`${TAP_API_URL}/charges`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TAP_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency ?? "SAR",
      customer: {
        name: input.customerName,
        phone: input.customerPhone ? { country_code: "966", number: input.customerPhone.replace(/^0/, "") } : undefined,
        email: input.customerEmail,
      },
      source: { id: "src_all" },
      redirect: { url: input.redirectUrl },
      post: input.webhookUrl ? { url: input.webhookUrl } : undefined,
      description: input.description ?? `طلب رواق #${input.orderId}`,
      metadata: { order_id: input.orderId, ...input.metadata },
      reference: { transaction: input.orderId, order: input.orderId },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Tap charge failed: ${res.status}`);
  }

  return res.json() as Promise<{
    id: string;
    status: string;
    transaction: { url: string };
  }>;
}

export async function retrieveTapCharge(chargeId: string) {
  if (!TAP_SECRET_KEY) {
    throw new Error("TAP_SECRET_KEY is not set");
  }

  const res = await fetch(`${TAP_API_URL}/charges/${chargeId}`, {
    headers: { Authorization: `Bearer ${TAP_SECRET_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Tap retrieve failed: ${res.status}`);
  }

  return res.json() as Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    reference: { order?: string };
    metadata?: Record<string, string>;
  }>;
}
