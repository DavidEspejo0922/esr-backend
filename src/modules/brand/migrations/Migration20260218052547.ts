import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260218052547 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "brand" add column if not exists "translations" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "brand" drop column if exists "translations";`);
  }

}
