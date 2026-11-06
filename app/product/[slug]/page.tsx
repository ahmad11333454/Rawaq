"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  name_ar: string;
  slug: string;
  description_ar: string | null;
  price: string;
  image_url: string | null;
  category: { name_ar: string; slug: string };
  is_digital: boolean;
  stock: number;
  status: string;
  product_suppliers: { supplier: { name: string }; unit_cost: string }[];
);

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setProduct(null);
        else setProduct(data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone px-6 py-20 text-center text-ivory/50" dir="rtl">
        جاري التحميل...
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-stone px-6 py-20 text-center text-ivory/50" dir="rtl">
        المنتج غير موجود.
        <br />
        <Link href="/store" className="mt-4 inline-block text-gold hover:underline">
          العودة للمتجر
        </Link>
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

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
        <div className="aspect-square overflow-hidden bg-bronze/20">
          {product.image_url && (
            <img src={product.image_url} alt={product.name_ar} className="h-full w-full object-cover" />
          )}
        </div>

        <div>
          <p className="text-sm text-ivory/50">{product.category.name_ar}</p>
          <h1 className="mt-2 text-4xl font-light">{product.name_ar}</h1>
          <p className="mt-6 text-3xl text-gold">
            {Number(product.price).toLocaleString("ar-SA")} ر.س
          </p>

          {product.description_ar && (
            <p className="mt-6 text-ivory/70 leading-relaxed">{product.description_ar}</p>
          )}

          {product.is_digital && (
            <span className="mt-4 inline-block text-sm text-gold/70">منتج رقمي — يوصل فوراً</span>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-bronze/50">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 text-lg hover:text-gold transition"
              >
                −
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-2 text-lg hover:text-gold transition"
              >
                +
              </button>
            </div>
            <button
              onClick={() => setAdded(true)}
              className="bg-gold px-8 py-3 text-sm text-stone hover:bg-gold/90 transition"
            >
              {added ? "تمت الإضافة ✓" : "أضف للسلة"}
            </button>
          </div>

          <Link href="/store" className="mt-8 inline-block text-sm text-ivory/50 hover:text-gold transition">
            ← العودة للمتجر
          </Link>
        </div>
      </div>
    </main>
  );
}
