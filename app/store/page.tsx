"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name_ar: string;
  slug: string;
  price: string;
  image_url: string | null;
  category: { name_ar: string; slug: string };
  is_digital: boolean;
};

export default function StorePage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [cats, setCats] = useState<string[] | null>(null);

  useEffect(() => {
    const url = category
      ? `/api/products?category=${category}`
      : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then(setProducts);
  }, [category]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) =>
        setCats([...new Set(data.map((p) => p.category.slug))]));
  }, []);

  return (
    <main className="min-h-screen bg-stone text-ivory" dir="rtl">
      <header className="border-b border-bronze/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <img src="/logo.svg" alt="رواق" className="h-10" />
          </Link>
          <nav className="flex gap-8 text-sm">
            <Link href="/store" className="text-gold">المتجر</Link>
            <Link href="/about" className="hover:text-gold transition">من نحن</Link>
            <Link href="/contact" className="hover:text-gold transition">تواصل</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-light mb-2">المتجر</h1>
        <p className="text-ivory/60 mb-10">منتجات مختارة بروح رواق</p>

        <div className="mb-10 flex flex-wrap gap-3">
          <button
            onClick={() => setCategory(null)}
            className={`rounded px-4 py-2 text-sm transition ${!category ? "bg-gold text-stone" : "border border-bronze/50 hover:border-gold"}`}
          >
            الكل
          </button>
          {cats?.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded px-4 py-2 text-sm transition ${category === c ? "bg-gold text-stone" : "border border-bronze/50 hover:border-gold"}`}
            >
              {c === "oud" ? "عود" : c === "oils" ? "زيوت" : c === "watches" ? "ساعات" : "رقمي"}
            </button>
          ))}
        </div>

        {products ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p.id}
                href={\`/product/${p.slug}\`}
                className="group block border border-bronze/40 bg-stone p-4 transition hover:border-gold/60"
              >
                <div className="aspect-square overflow-hidden bg-bronze/20">
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.name_ar}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-4 text-sm group-hover:text-gold transition">
                  {p.name_ar}
                </h3>
                <p className="mt-1 text-sm text-ivory/50">{p.category.name_ar}</p>
                <p className="mt-2 text-gold">
                  {Number(p.price).toLocaleString("ar-SA")} ر.س
                </p>
                {p.is_digital && (
                  <span className="mt-2 inline-block text-xs text-gold/70">
                    منتج رقمي
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-ivory/40">جاري التحميل...</p>
        )}
      </div>
    </main>
  );
}