ALTER TABLE "catalogs" DROP CONSTRAINT "catalogs_image_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_catalog_id_catalogs_id_fk";
--> statement-breakpoint
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_parent_id_catalogs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."catalogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_image_id_assets_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_catalog_id_catalogs_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalogs"("id") ON DELETE set null ON UPDATE no action;