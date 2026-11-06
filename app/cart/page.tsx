"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  slug: string;
  name_ar: string;
  price: string;
  qty: number;
);

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cart = JSON.parse(localStorage.getItem("rawaq_cart") || "[]");
    setItems(cart);
  }, []);

  function updateQty(slug: string, qty: number) {
    const next = items.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i));
    setItems(next);
    localStorage.setItem("rawaq_cart", JSON.stringify(next));
  }

  function removeItem(slug: string) {
    const next = items.filter((i) => i.slug !== slug);
    setItems(next);
    localStorage.setItem("rawaq_cart", JSON.stringify(next));
  }

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
  const shipping = items.length > 0 ? 15 : 0;

  if (!mounted) {
    return (
      <main className="min-h-screen bg-stone px-6 py-20 text-center text-ivory/50" dir="rtl">
        جاري التحميل...
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
            <Link href="/about" className="hover:text-gold transition">من نحن</Link>
            <Link href="/contact" className="hover:text-gold transition">تواصل</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-light">السلة</h1>

        {items.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-ivory/50">السلة فارغة</p>
            <Link href="/store" className="mt-6 inline-block bg-gold px-8 py-3 text-sm text-stone hover:bg-gold/90 transition">
              تسوّق الآن
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 space-y-6">
              {items.map((item) => (
                <div key={item.slug} className="flex items-center justify-between border-b border-bronze/40 pb-6">
                  <div>
                    <Link href={"/product/" + item.slug} className="text-lg hover:text-gold transition">
                      {item.name_ar}
                    </Link>
                    <p className="mt-1 text-sm text-gold">
                      {Number(item.price).toLocaleString("ar-SA")} ر.س
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex border border-bronze/50">
                      <button
                        onClick={() => updateQty(item.slug, item.qty - 1)}
                        className="px-3 py-1 hover:text-gold transition"
                      >
                        −
                      </button>
                      <span className="px-4 py-1">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.slug, item.qty + 1)}
                        className="px-3 py-1 hover:text-gold transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="text-xs text-ivory/40 hover:text-red-400 transition"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-3 border-t border-bronze/40 pt-6 text-sm">
              <div className="flex justify-between text-ivory/60">
                <span>المجموع الفرعي</span>
                <span>{total.toLocaleString("ar-SA")} ر.س</span>
              </div>
              <div className="flex justify-between text-ivory/60">
                <span>الشحن</span>
                <span>{shipping.toLocaleString("ar-SA")} ر.س</span>
              </div>
              <div className="flex justify-between text-lg text-gold">
                <span>الإجمالي</span>
                <span>{(total + shipping).toLocaleString("ar-SA")} ر.س</span>
              </div>
            </div>

            <button className="mt-10 w-full bg-gold py-4 text-sm text-stone hover:bg-gold/90 transition">
              إتمام الطلب
            </button>
          </>
        )}
      </div>
    </main>
  );
}
