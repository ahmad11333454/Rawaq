"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  products: number;
  orders: number;
  revenue: number;
  pending: number;
);

type Order = {
  id: string;
  customer_name: string;
  total: string;
  status: string;
  created_at: string;
);

const statusColor: Record<string, string> = {
  pending: "text-gold",
  paid: "text-green-400",
  shipped: "text-blue-400",
  delivered: "text-emerald-400",
  cancelled: "text-red-400",
);

const statusLabel: Record<string, string> = {
  pending: "معلق",
  paid: "مدفوع",
  shipped: "مشحون",
  delivered: "مُسلَّم",
  cancelled: "ملغي",
);

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => setOrders(null));
  }, []);

  const cards = stats
    ? [
        { label: "المنتجات", value: stats.products },
        { label: "الطلبات", value: stats.orders },
        { label: "الإيرادات (ر.س)", value: Number(stats.revenue).toLocaleString("ar-SA") },
        { label: "معلقة", value: stats.pending },
      ]
    : [];

  return (
    <main className="min-h-screen bg-stone text-ivory" dir="rtl">
      <header className="border-b border-bronze/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <img src="/logo.svg" alt="رواق" className="h-10" />
          </Link>
          <span className="text-sm text-gold">لوحة التحكم</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-light mb-10">نظرة عامة</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="border border-bronze/40 bg-bronze/10 p-6"
            >
              <p className="text-sm text-ivory/50">{c.label}</p>
              <p className="mt-2 text-3xl text-gold">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-light mb-6">آخر الطلبات</h2>
          <div className="overflow-x-auto border border-bronze/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bronze/40 text-ivory/50">
                  <th className="px-4 py-3 text-right">رقم الطلب</th>
                  <th className="px-4 py-3 text-right">العميل</th>
                  <th className="px-4 py-3 text-right">المبلغ</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                  <th className="px-4 py-3 text-right">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((o) => (
                  <tr key={o.id} className="border-b border-bronze/20">
                    <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">{o.customer_name || "—"}</td>
                    <td className="px-4 py-3 text-gold">
                      {Number(o.total).toLocaleString("ar-SA")} ر.س
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusColor[o.status] || "text-ivory/50"}
                      >
                        {statusLabel[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ivory/40">
                      {new Date(o.created_at).toLocaleDateString("ar-SA")}
                    </td>
                  </tr>
                ))}
                {orders?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-ivory/40">
                      لا توجد طلبات بعد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
