"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name_ar: string;
  slug: string;
  price: string;
  cost: string | null;
  stock: number;
  is_digital: boolean;
  status: string;
  image_url: string | null;
  category: { name_ar: string; slug: string } | null;
  margin_pct: string | null;
);

type Category = { id: string; name_ar: string; slug: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({ status: "draft", is_digital: false });

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts);
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ status: "draft", is_digital: false, stock: 0 });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setShowForm(true);
  };

  const save = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("حذف المنتج نهائياً؟")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <main className="min-h-screen bg-stone text-ivory" dir="rtl">
      <header className="border-b border-bronze/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/admin" className="text-sm text-gold hover:underline">
            ← لوحة التحكم
          </Link>
          <h1 className="text-lg">إدارة المنتجات</h1>
          <button
            onClick={openNew}
            className="rounded bg-gold px-4 py-2 text-sm text-stone hover:bg-gold/90"
          >
            + منتج جديد
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {showForm && (
          <div className="mb-10 rounded border border-bronze/40 bg-bronze/10 p-6">
            <h2 className="mb-6 text-lg text-gold">{editing ? "تعديل منتج" : "منتج جديد"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم">
                <input
                  className={inputClass}
                  value={form.name_ar ?? ""}
                  onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                />
              </Field>
              <Field label="الرابط (slug)">
                <input
                  className={inputClass}
                  value={form.slug ?? ""}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </Field>
              <Field label="السعر (ر.س)">
                <input
                  className={inputClass}
                  type="number"
                  value={form.price ?? ""}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </Field>
              <Field label="التكلفة (ر.س)">
                <input
                  className={inputClass}
                  type="number"
                  value={form.cost ?? ""}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                />
              </Field>
              <Field label="المخزون">
                <input
                  className={inputClass}
                  type="number"
                  value={form.stock ?? 0}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </Field>
              <Field label="التصنيف">
                <select
                  className={inputClass}
                  value={form.category_id ?? ""}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">بدون</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}
                    >
                      {c.name_ar}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="رابط الصورة">
                <input
                  className={inputClass}
                  value={form.image_url ?? ""}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
              </Field>
              <Field label="الحالة">
                <select
                  className={inputClass}
                  value={form.status ?? "draft"}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="draft">مسودة</option>
                  <option value="active">نشط</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </Field>
              <Field label="">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_digital ?? false}
                    onChange={(e) => setForm({ ...form, is_digital: e.target.checked })}
                  />
                  منتج رقمي
                </label>
              </Field>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={save}
                className="rounded bg-gold px-6 py-2 text-sm text-stone hover:bg-gold/90"
              >
                حفظ
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded border border-bronze/50 px-6 py-2 text-sm hover:border-gold"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bronze/40 text-right text-ivory/50">
                <th className="pb-3">المنتج</th>
                <th className="pb-3">التصنيف</th>
                <th className="pb-3">السعر</th>
                <th className="pb-3">الهامش</th>
                <th className="pb-3">المخزون</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id} className="border-b border-bronze/20">
                  <td className="py-3">{p.name_ar}</td>
                  <td className="py-3 text-ivory/50">{p.category?.name_ar ?? "—"}</td>
                  <td className="py-3 text-gold">{Number(p.price).toLocaleString("ar-SA")}</td>
                  <td className="py-3">{p.margin_pct ? `${p.margin_pct}%` : "—"}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3">
                    <span
                      className={
                        p.status === "active"
                          ? "text-green-400"
                          : p.status === "draft"
                          ? "text-gold"
                          : "text-ivory/40"
                      }
                    >
                      {p.status === "active" ? "نشط" : p.status === "draft" ? "مسودة" : "مؤرشف"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="ml-3 text-gold hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-red-400 hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products?.length === 0 && (
            <p className="mt-10 text-center text-ivory/40">لا توجد منتجات بعد.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs text-ivory/50">{label}</label>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded border border-bronze/50 bg-stone px-3 py-2 text-sm outline-none focus:border-gold";
