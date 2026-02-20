import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260210184732 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "content_page" drop constraint if exists "content_page_slug_locale_unique";`);
    this.addSql(`create table if not exists "content_page" ("id" text not null, "title" text not null, "slug" text not null, "locale" text not null, "published" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "content_page_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_content_page_deleted_at" ON "content_page" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_content_page_slug_locale_unique" ON "content_page" ("slug", "locale") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "content_block" ("id" text not null, "type" text check ("type" in ('HERO', 'FEATURED_PRODUCTS', 'RICH_TEXT', 'CTA', 'BANNER')) not null, "sort_order" integer not null default 0, "data" jsonb not null, "medusa_handle" text null, "page_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "content_block_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_content_block_page_id" ON "content_block" ("page_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_content_block_deleted_at" ON "content_block" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "content_block" add constraint "content_block_page_id_foreign" foreign key ("page_id") references "content_page" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "content_block" drop constraint if exists "content_block_page_id_foreign";`);

    this.addSql(`drop table if exists "content_page" cascade;`);

    this.addSql(`drop table if exists "content_block" cascade;`);
  }

}
