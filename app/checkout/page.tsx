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

const SHIPPING_FEE = 15;

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rawaq_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );
  const hasDigital = items.some((i) => i.is_digital);
  const hasPhysical = items.some((i) => !i.is_digital);
  const shipping = hasPhysical ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("الاسم ورقم الجوال مطلوبان");
      return;
    }
    if (hasPhysical && (!city.trim() || !address.trim())) {
      setError("المدينة والعنوان مطلوبان للمنتجات المادية");
      return;
    }
    if (items.length === 0) {
      setError("السلة فاضية");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name.trim(), phone: phone.trim(), email: email.trim() || null },
          shipping_address: hasPhysical
            ? { city: city.trim(), address: address.trim(), notes: notes.trim() || null }
            : null,
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            unit_price: i.price,
            is_digital: i.is_digital,
          })),
          subtotal,
          shipping_fee: shipping,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل إنشاء الطلب");

      if (data.payment_url) {
        localStorage.removeItem("rawaq_cart");
        window.location.href = data.payment_url;
      } else {
        localStorage.removeItem("rawaq_cart");
        window.location.href = `/checkout/callback?order=${data.order_id}`;
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone px-6 py-20 text-center text-ivory/50" dir="rtl">
        جاري التحميل...
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone text-ivory" dir="rtl">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="text-3xl font-light">السلة فاضية</h1>
          <p className="mt-4 text-ivory/60">ما فيه منتجات تنتظر الدفع</p>
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
            <Link href="/store" className="hover:text-gold transition">المتجر</Link>
            <Link href="/cart" className="hover:text-gold transition">السلة</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          <div>
            <h1 className="text-3xl font-light">إتمام الطلب</h1>
            <p className="mt-2 text-ivory/60">عبّي بياناتك وبنجهّز طلبك</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg text-gold">البيانات الشخصية</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-ivory/50">الاسم الكامل</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="اسمك"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-ivory/50">رقم الجوال</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  dir="ltr"
                  className="w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-ivory/50">البريد الإلكتروني (اختياري)</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                dir="ltr"
                className="w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none focus:border-gold"
                placeholder="name@example.com"
              />
            </div>
          </section>

          {hasPhysical && (
            <section className="space-y-4">
              <h2 className="text-lg text-gold">عنوان الشحن</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-ivory/50">المدينة</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none focus:border-gold"
                    placeholder="جدة"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ivory/50">الرمز البريدي (اختياري)</label>
                  <input
                    className="w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none focus:border-gold"
                    placeholder="21421"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-ivory/50">العنوان التفصيلي</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="الحي، الشارع، رقم المبنى"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-ivory/50">ملاحظات للتوصيل (اختياري)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-bronze/50 bg-stone px-4 py-3 text-sm outline-none focus:border-gold"
                  placeholder="مثلاً: التسليم بعد العصر"
                />
              </div>
            </section>
          )}

          {error && (
            <p className="border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold py-4 text-sm text-stone transition hover:bg-gold/90 disabled:opacity-50"
          >
            {submitting ? "جاري المعالجة..." : `ادفع ${total.toLocaleString("ar-SA")} ر.س`}
          </button>
        </form>

        <aside className="lg:col-span-2">
          <div className="sticky top-8 border border-bronze/40 bg-bronze/10 p-6">
            <h2 className="text-lg text-gold">ملخص الطلب</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
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
                    <p className="mt-1 text-xs text-ivory/50">
                      {item.quantity} × {Number(item.price).toLocaleString("ar-SA")} ر.س
                    </p>
                  </div>
                  <p className="text-sm text-gold">
                    {(Number(item.price) * item.quantity).toLocaleString("ar-SA")} ر.س
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-bronze/30 pt-4 text-sm">
              <div className="flex justify-between text-ivory/60">
                <span>المجموع الفرعي</span>
                <span>{subtotal.toLocaleString("ar-SA")} ر.س</span>
              </div>
              {hasPhysical && (
                <div className="flex justify-between text-ivory/60">
                  <span>الشحن</span>
                  <span>{shipping.toLocaleString("ar-SA")} ر.س</span>
                </div>
              )}
              <div className="flex justify-between border-t border-bronze/30 pt-2 text-base text-gold">
                <span>الإجمالي</span>
                <span>{total.toLocaleString("ar-SA")} ر.س</span>
              </div>
            </div>

            {hasDigital && (
              <p className="mt-4 text-xs text-ivory/40">
                المنتجات الرقمية تُسلَّم عبر رابط تحميل بعد تأكيد الدفع
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
