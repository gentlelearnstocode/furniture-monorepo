ALTER TABLE "product_assets" ADD COLUMN "focus_point" jsonb;--> statement-breakpoint
ALTER TABLE "product_assets" ADD COLUMN "aspect_ratio" text DEFAULT 'original';--> statement-breakpoint
ALTER TABLE "product_assets" ADD COLUMN "object_fit" text DEFAULT 'cover';