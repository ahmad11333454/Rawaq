# رواق (Rawaq)

منصة تجارة إلكترونية فاخرة — Next.js + PostgreSQL + Prisma

## الألوان

- حجر غامق: `#12110e`
- عاجي: `#F3EFE6`
- ذهبي: `#C6A15B`
- برونزي: `#3A342A`

## التشغيل

```bash
npm install
cp .env.local.example .env.local
# عدّل DATABASE_URL
npx prisma db push
npm run dev
```

## هيكل المشروع

- `app/` — الصفحات وواجهات API
- `components/` — مكوّنات واجهة المستخدم
- `lib/` — طبقة قاعدة البيانات
- `prisma/` — مخطط قاعدة البيانات
- `public/` — الشعار والأصول
