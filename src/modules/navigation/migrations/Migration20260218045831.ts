import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260218045831 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "nav_item" ("id" text not null, "label" text not null, "slug" text not null, "url" text null, "sort_order" integer not null default 0, "is_visible" boolean not null default true, "position" text check ("position" in ('HEADER', 'FOOTER', 'MOBILE_MENU')) not null, "source_type" text check ("source_type" in ('PRODUCT_CATEGORY', 'DEVICE_BRAND', 'DEVICE_SERIES', 'CUSTOM_URL', 'PRODUCT_COLLECTION')) null, "source_id" text null, "parent_id" text null, "badge_text" text null, "highlight_color" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "nav_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_nav_item_deleted_at" ON "nav_item" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "nav_item" cascade;`);
  }

}
