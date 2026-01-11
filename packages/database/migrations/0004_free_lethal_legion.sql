CREATE TABLE "site_heros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"subtitle" text,
	"button_text" text,
	"button_link" text,
	"background_type" text DEFAULT 'image' NOT NULL,
	"background_image_id" uuid,
	"background_video_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "home_layout" text DEFAULT 'full' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_heros" ADD CONSTRAINT "site_heros_background_image_id_assets_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_heros" ADD CONSTRAINT "site_heros_background_video_id_assets_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;