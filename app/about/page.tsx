import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone text-ivory" dir="rtl">
      <header className="border-b border-bronze/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <img src="/logo.svg" alt="رواق" className="h-10" />
          </Link>
          <nav className="flex gap-8 text-sm">
            <Link href="/store" className="hover:text-gold transition">المتجر</Link>
            <Link href="/about" className="text-gold">من نحن</Link>
            <Link href="/contact" className="hover:text-gold transition">تواصل</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-5xl font-light">من نحن</h1>
        <p className="mt-8 text-lg text-ivory/70 leading-relaxed">
          رواق منصة تجارة إلكترونية فاخرة تأسست على فكرة بسيطة: الجمال يستحق مساحة خاصة.
        </p>
        <p className="mt-6 text-ivory/70 leading-relaxed">
          نختار منتجاتنا بعناية — عطور عود، زيوت نادرة، ساعات، وقطع جلدية — من مصادر موثوقة حول العالم، ونقدمها بتجربة رقمية راقية تعكس قيمة كل قطعة.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {[
            { num: "٠١", title: "اختيار دقيق", desc: "كل منتج يمر بفحص جودة قبل العرض." },
            { num: "٠٢", title: "شحن موثوق", desc: "تسليم آمن داخل المملكة خلال أيام." },
            { num: "٠٣", title: "دعم حقيقي", desc: "فريق يجيب على استفساراتك مباشرة." },
          ].map((item) => (
            <div key={item.num} className="border-t border-gold/40 pt-6">
              <p className="text-gold">{item.num}</p>
              <h3 className="mt-2 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-ivory/60">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 border border-bronze/40 p-10 text-center">
          <p className="text-ivory/60">تبي تعرف أكثر؟</p>
          <Link
            href="/contact"
            className="mt-4 inline-block bg-gold px-8 py-3 text-sm text-stone hover:bg-gold/90 transition"
          >
            تواصل معنا
          </Link>
        </div>
      </div>
    </main>
  );
}
