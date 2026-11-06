"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutCallbackPage() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const tapId = params.get("tap_id");
  const [status, setStatus] = useState<"loading" | "paid" | "failed" | "pending">("loading");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "paid") setStatus("paid");
        else if (data.status === "cancelled") setStatus("failed");
        else setStatus("pending");
      })
      .catch(() => setStatus("failed"));
  }, [orderId, tapId]);

  return (
    <main className="min-h-screen bg-stone text-ivory" dir="rtl">
      <header className="border-b border-bronze/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <img src="/logo.svg" alt="رواق" className="h-10" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        {status === "loading" && <p className="text-ivory/50">جاري التحقق من الدفع...</p>}

        {status === "paid" && (
          <>
            <p className="text-4xl text-gold">✓</p>
            <h1 className="mt-4 text-3xl font-light">تم الدفع بنجاح</h1>
            <p className="mt-4 text-ivory/60">طلبك قيد التجهيز. رقم الطلب: {orderId?.slice(0, 8)}</p>
            <Link href="/store" className="mt-8 inline-block bg-gold px-8 py-3 text-sm text-stone hover:bg-gold/90 transition">
              متابعة التسوق
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <p className="text-4xl text-red-400">✗</p>
            <h1 className="mt-4 text-3xl font-light">لم يتم الدفع</h1>
            <p className="mt-4 text-ivory/60">جرّب مرة أخرى أو تواصل معنا.</p>
            <Link href="/cart" className="mt-8 inline-block border border-gold/50 px-8 py-3 text-sm hover:bg-gold hover:text-stone transition">
              العودة للسلة
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <p className="text-4xl text-gold/60">…</p>
            <h1 className="mt-4 text-3xl font-light">الدفع قيد المعالجة</h1>
            <p className="mt-4 text-ivory/60">سنرسل لك تأكيداً عند اكتماله.</p>
          </>
        )}
      </div>
    </main>
  );
}
