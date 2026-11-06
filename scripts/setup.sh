#!/bin/bash
set -e

echo "→ رواق: إعداد المشروع"

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✓ تم إنشاء .env.local — عدّل DATABASE_URL"
fi

npm install

echo "→ طبّق الترحيل يدوياً:"
echo "  psql $DATABASE_URL -f prisma/migrations/001_init/migration.sql"

npx prisma generate

echo "✓ جاهز. شغّل: npm run dev"