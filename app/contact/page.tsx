"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

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
            <Link href="/contact" className="text-gold">تواصل</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-5xl font-light">تواصل</h1>
        <p className="mt-4 text-ivory/60">
          نسعد بسماعك. أرسل رسالتك وسنرد خلال أربع وعشرين ساعة.
        </p>

        {sent ? (
          <div className="mt-12 border border-gold/40 p-10 text-center">
            <p className="text-gold">تم إرسال رسالتك بنجاح.</p>
            <p className="mt-2 text-sm text-ivory/50">سنرد عليك قريباً.</p>
          </div>
        ) : (
          <form
            className="mt-12 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div>
              <label className="block text-sm text-ivory/60 mb-2">الاسم</label>
              <input
                type="text"
                required
                className="w-full border border-bronze/50 bg-stone px-4 py-3 text-ivory outline-none focus:border-gold transition"
              />
            </div>
            <div>
              <label className="block text-sm text-ivory/60 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                className="w-full border border-bronze/50 bg-stone px-4 py-3 text-ivory outline-none focus:border-gold transition"
              />
            </div>
            <div>
              <label className="block text-sm text-ivory/60 mb-2">الرسالة</label>
              <textarea
                required
                rows={5}
                className="w-full border border-bronze/50 bg-stone px-4 py-3 text-ivory outline-none focus:border-gold transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold py-4 text-sm text-stone hover:bg-gold/90 transition"
            >
              إرسال
            </button>
          </form>
        )}

        <div className="mt-16 grid gap-6 sm:grid-cols-2 text-sm text-ivory/50">
          <div>
            <p className="text-gold mb-1">البريد</p>
            <p>info@rawaq.store</p>
          </div>
          <div>
            <p className="text-gold mb-1">الموقع</p>
            <p>جدة، المملكة العربية السعودية</p>
          </div>
        </div>
      </div>
    </main>
  );
}
