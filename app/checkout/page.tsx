"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  name_ar: string;
  slug: string;
  price: string;
  quantity: number;
  image_url: string | null;
  is_digital: boolean;
};

type CustomerForm = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
};

const SHIPPING_FEE = 15;

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rawaq_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const hasDigital = items.some((i) => i.is_digital);
  const hasPhysical = items.some((i) => !i.is_digital);
  const shipping = hasPhysical ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.phone.trim()) {
      setError("الاسم ورقم الجوال مطلوبان");
      return;
    }
    if (items.length === 0) {
      setError("السلة فارغة");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            unit_price: i.price,
            is_digital: i.is_digital,
          })),
          subtotal,
          shipping_fee: shipping,
          total,
          shipping_address: hasPhysical
            ? {
                city: form.city,
                address: form.address,
                notes: form.notes,
              }
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء إنشاء الطلب");
        setLoading(false);
        return;
      }

      if (data.payment_url) {
        localStorage.removeItem("rawaq_cart");
        window.location.href = data.payment_url;
      } else {
        window.location.href = `/order/${data.order_id}`;
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone text-ivory" dir="rtl">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="text-3xl font-light">السلة فارغة</h1>
          <p className="mt-4 text-ivory/60">أضف منتجات من المتجر قبل إتمام الطلب</p>
          <Link
            href="/store"
            className="mt-8 inline-block bg-gold px-8 py-3 text-sm text-stone hover:bg-gold/90 transition"
          >
            العودة للمتجر
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone text-ivory" dir="rtl">
      <header className="border-b border-bronze/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <img src="/logo.svg" alt="رواق" className="h-10" />
          </Link>
          <nav className="flex gap-8 text-sm">
            <Link href="/store" className="hover:text-gold transition">
              المتجر
            </Link>
            <Link href="/cart" className="text-gold">
              السلة
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-light">إتمام الطلب</h1>
          <p className="mt-2 text-ivory/60">أدخل بياناتك لإتمام عملية الشراء</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="الاسم الكامل"
                value={form.name}
                onChange={(v) => updateField("name", v)}
                required
              />
              <Field
                label="رقم الجوال"
                value={form.phone}
                onChange={(v) => updateField("phone", v)}
                required
                dir="ltr"
              />
            </div>

            <Field
              label="البريد الإلكتروني (اختياري)"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              type="email"
              dir="ltr"
            />

            {hasPhysical && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field
                    label="المدينة"
                    value={form.city}
                    onChange={(v) => updateField("city", v)}
                    required
                  />
                  <Field
                    label="الحي"
                    value={form.address}
                    onChange={(v) => updateField("address", v)}
                    required
                  />
                </div>
                <Field
                  label="ملاحظات التوصيل (اختياري)"
                  value={form.notes}
                  onChange={(v) => updateField("notes", v)}
                  textarea
                />
              </>
            )}

            {error && (
              <p className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold py-4 text-sm text-stone transition hover:bg-gold/90 disabled:opacity-50"
            >
              {loading ? "جاري المعالجة..." : `ادفع ${total.toLocaleString("ar-SA")} ر.س`}
            </button>
          </form>
        </div>

        <div className="border border-bronze/40 bg-bronze/10 p-8">
          <h2 className="text-xl font-light">ملخص الطلب</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 bg-bronze/20">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name_ar}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{item.name_ar}</p>
                  <p className="text-xs text-ivory/50">
                    {item.quantity} × {Number(item.price).toLocaleString("ar-SA")} ر.س
                  </p>
                </div>
                <p className="text-sm text-gold">
                  {(Number(item.price) * item.quantity).toLocaleString("ar-SA")} ر.س
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3 border-t border-bronze/30 pt-6 text-sm">
            <Row label="المجموع الفرعي" value={subtotal} />
            {hasPhysical && <Row label="الشحن" value={shipping} />}
            {hasDigital && !hasPhysical && (
              <p className="text-xs text-gold/70">منتج رقمي — لا رسوم شحن</p>
            )}
            <div className="flex justify-between border-t border-bronze/30 pt-3 text-base text-gold">
              <span>الإجمالي</span>
              <span>{total.toLocaleString("ar-SA")} ر.س</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  dir,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  dir?: string;
  textarea?: boolean;
}) {
  const cls = "w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none transition focus:border-gold";
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-ivory/60">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          dir={dir}
          className={cls}
        />
      )}
    </label>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-ivory/70">
      <span>{label}</span>
      <span>{value.toLocaleString("ar-SA")} ر.س</span>
    </div>
  );
}
