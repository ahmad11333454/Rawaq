"use client";

import Link from "next/link";

export default function CartPage() {
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

      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-light">السلة</h1>

        <div className="mt-16 border border-bronze/40 bg-stone p-10 text-center">
          <p className="text-ivory/50">السلة فارغة حالياً.</p>
          <Link
            href="/store"
            className="mt-6 inline-block bg-gold px-8 py-3 text-sm text-stone hover:bg-gold/90 transition"
          >
            تسوّق الآن
          </Link>
        </div>

        <div className="mt-10 border-t border-bronze/30 pt-8">
          <div className="flex justify-between text-sm text-ivory/60">
            <span>الشحن</span>
            <span>١٥ ر.س</span>
          </div>
          <div className="mt-4 flex justify-between text-lg">
            <span>الإجمالي</span>
            <span className="text-gold">١٥ ر.س</span>
          </div>
          <button className="mt-8 w-full bg-gold py-4 text-sm text-stone hover:bg-gold/90 transition">
            إتمام الطلب
          </button>
        </div>
      </div>
    </main>
  );
}
