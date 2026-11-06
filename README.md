# رواق (Rawaq)

منصة تجارة إلكترونية فاخرة بـ Next.js و PostgreSQL و Prisma.

## الألوان

- حجر غامق: `#12110e`
- عاجي: `#F3EFE6`
- ذهبي: `#C6A15B`
- برونزي: `#3A342A`

## التشغيل

```bash
# 1. انسخ متغيرات البيئة
cp .env.example .env.local

# 2. ثبّت الحزم
npm install

# 3. شغّل الترحيل على PostgreSQL
psql $DATABASE_URL -f prisma/migrations/001_init/migration.sql

# 4. ولّد Prisma Client
npx prisma generate

# 5. شغّل السيرفر
npm run dev
```

الموقع يفتح على http://localhost:3000

## الصفحات

- `/` — الرئيسية
- `/store` — المتجر مع فلترة تصنيفات
- `/product/[slug]` — تفاصيل المنتج
- `/cart` — السلة
- `/about` — من نحن
- `/contact` — تواصل

## API

- `GET /api/products` — قائمة المنتجات (فلتر: `?category=oud`)
- `GET /api/products/[slug]` — منتج واحد

## الشحن

سعر ثابت: ١٥ ريال سعودي لكل طلب.

## الترخيص

خاص — جميع الحقوق محفوظة © ٢٠٢٦ رواق