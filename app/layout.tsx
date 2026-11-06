import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "رواق — Rawaq",
  description: "منصة تجارة إلكترونية فاخرة | Luxury e-commerce platform",
  openGraph: {
    title: "رواق",
    description: "أناقة تُلمس بالنظر",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}