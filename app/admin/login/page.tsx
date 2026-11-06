"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "فشل الدخول");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-stone text-ivory flex items-center justify-center" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-bronze/40 bg-bronze/10 p-8"
      >
        <h1 className="text-2xl font-light mb-6 text-center">دخول رواق</h1>

        <label className="block text-sm text-ivory/60 mb-2">البريد الإلكتروني</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-stone border border-bronze/50 px-4 py-3 mb-4 text-ivory focus:border-gold outline-none"
          required
        />

        <label className="block text-sm text-ivory/60 mb-2">كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-stone border border-bronze/50 px-4 py-3 mb-6 text-ivory focus:border-gold outline-none"
          required
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-stone py-3 text-sm hover:bg-gold/90 transition disabled:opacity-50"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
