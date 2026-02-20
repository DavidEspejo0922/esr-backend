import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260210184728 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "device_model" drop constraint if exists "device_model_slug_unique";`);
    this.addSql(`alter table if exists "device_series" drop constraint if exists "device_series_slug_unique";`);
    this.addSql(`alter table if exists "device_brand" drop constraint if exists "device_brand_slug_unique";`);
    this.addSql(`create table if not exists "device_brand" ("id" text not null, "name" text not null, "slug" text not null, "logo_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "device_brand_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_device_brand_slug_unique" ON "device_brand" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_device_brand_deleted_at" ON "device_brand" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "device_series" ("id" text not null, "name" text not null, "slug" text not null, "device_brand_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "device_series_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_device_series_slug_unique" ON "device_series" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_device_series_device_brand_id" ON "device_series" ("device_brand_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_device_series_deleted_at" ON "device_series" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "device_model" ("id" text not null, "name" text not null, "slug" text not null, "image_url" text null, "device_series_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "device_model_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_device_model_slug_unique" ON "device_model" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_device_model_device_series_id" ON "device_model" ("device_series_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_device_model_deleted_at" ON "device_model" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "device_series" add constraint "device_series_device_brand_id_foreign" foreign key ("device_brand_id") references "device_brand" ("id") on update cascade;`);

    this.addSql(`alter table if exists "device_model" add constraint "device_model_device_series_id_foreign" foreign key ("device_series_id") references "device_series" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "device_series" drop constraint if exists "device_series_device_brand_id_foreign";`);

    this.addSql(`alter table if exists "device_model" drop constraint if exists "device_model_device_series_id_foreign";`);

    this.addSql(`drop table if exists "device_brand" cascade;`);

    this.addSql(`drop table if exists "device_series" cascade;`);

    this.addSql(`drop table if exists "device_model" cascade;`);
  }

}
