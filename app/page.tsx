export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone text-ivory" dir="rtl">
      <header className="border-b border-bronze/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/">
            <img src="/logo.svg" alt="رواق" className="h-10" />
          </a>
          <nav className="flex gap-8 text-sm tracking-wide">
            <a href="/store" className="hover:text-gold transition">المتجر</a>
            <a href="/about" className="hover:text-gold transition">من نحن</a>
            <a href="/contact" className="hover:text-gold transition">تواصل</a>
          </nav>
          <a href="/cart" className="rounded border border-gold/50 px-4 py-2 text-sm hover:bg-gold hover:text-stone transition">
            السلة (٠)
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest text-gold">رواق — منتجات رقمية فاخرة</p>
            <h1 className="text-5xl font-light leading-tight md:text-6xl">
              أناقة تُلمس<br />بالنظر
            </h1>
            <p className="mt-6 max-w-md text-ivory/70 leading-relaxed">
              عطور oud، زيوت فاخرة، ومنتجات رقمية مختارة بعناية. كل قطعة تحمل توقيع رواق.
            </p>
            <div className="mt-10 flex gap-4">
              <a href="/store" className="bg-gold px-8 py-3 text-sm text-stone hover:bg-gold/90 transition">
                تسوّق الآن
              </a>
              <a href="/about" className="border border-ivory/30 px-8 py-3 text-sm hover:border-gold transition">
                تعرّف علينا
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/assets/flacon-3d.png"
              alt="قارورة عطر رواق"
              className="w-full max-w-sm drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-bronze/30 bg-bronze/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-3xl font-light">أحدث المنتجات</h2>
            <a href="/store" className="text-sm text-gold hover:underline">عرض الكل</a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <ProductCard key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { title: "شحن ثابت", desc: "رسوم شحن واضحة ١٥ ريال لكل طلب داخل السعودية." },
            { title: "منتجات رقمية", desc: "توصيل فوري عبر رابط تحميل آمن بعد الدفع." },
            { title: "جودة مضمونة", desc: "منتجات مختارة من موردين موثوقين بعقود حماية." },
          ].map((f) => (
            <div key={f.title} className="border-t border-gold/40 pt-6">
              <h3 className="text-lg text-gold">{f.title}</h3>
              <p className="mt-2 text-sm text-ivory/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-bronze/40 py-8 text-center text-xs text-ivory/40">
        جميع الحقوق محفوظة © ٢٠٢٦ رواق
      </footer>
    </main>
  );
}

function ProductCard() {
  return (
    <a href="/product/1" className="group block border border-bronze/40 bg-stone p-4 transition hover:border-gold/60">
      <div className="aspect-square bg-bronze/20" />
      <h3 className="mt-4 text-sm group-hover:text-gold transition">اسم المنتج</h3>
      <p className="mt-1 text-gold">٠ ر.س</p>
    </a>
  );
}
