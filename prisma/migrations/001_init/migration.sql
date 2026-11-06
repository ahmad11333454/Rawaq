-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name_ar" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "name_ar" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description_ar" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "cost" DECIMAL(10,2),
    "margin_pct" DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN cost > 0 THEN ROUND((price - cost) / price * 100, 2) ELSE NULL END) STORED,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "is_digital" BOOLEAN DEFAULT false,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft' CHECK ("status" IN ('draft','active','archived')),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "city" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "branches_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_stock" (
    "branch_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "branch_stock_pk" PRIMARY KEY ("branch_id","product_id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "non_circumvention" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "suppliers_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_suppliers" (
    "product_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "supplier_sku" TEXT,
    "unit_cost" DECIMAL(10,2),

    CONSTRAINT "product_suppliers_pk" PRIMARY KEY ("product_id","supplier_id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone" TEXT,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "branch_id" UUID,
    "status" TEXT NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending','paid','shipped','delivered','cancelled')),
    "subtotal" DECIMAL(10,2) NOT NULL,
    "shipping_fee" DECIMAL(10,2) NOT NULL DEFAULT 15,
    "total" DECIMAL(10,2) NOT NULL,
    "payment_method" TEXT,
    "shipping_address" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "is_digital" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "order_items_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_deliveries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_item_id" UUID NOT NULL,
    "download_url" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ,
    "downloaded_at" TIMESTAMPTZ,

    CONSTRAINT "digital_deliveries_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_stock" ADD CONSTRAINT "branch_stock_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_stock" ADD CONSTRAINT "branch_stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_suppliers" ADD CONSTRAINT "product_suppliers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_suppliers" ADD CONSTRAINT "product_suppliers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_deliveries" ADD CONSTRAINT "digital_deliveries_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- SeedData
INSERT INTO "categories" ("name_ar", "slug") VALUES
  ('عطور عود', 'oud'),
  ('زيوت فاخرة', 'oils'),
  ('ساعات', 'watches'),
  ('منتجات رقمية', 'digital');

INSERT INTO "branches" ("name", "city") VALUES
  ('رواق جدة', 'Jeddah'),
  ('رواق الرياض', 'Riyadh');