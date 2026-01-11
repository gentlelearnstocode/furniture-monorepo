CREATE TABLE "site_intros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"content_html" text NOT NULL,
	"intro_image_id" uuid,
	"background_image_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_intros" ADD CONSTRAINT "site_intros_intro_image_id_assets_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_intros" ADD CONSTRAINT "site_intros_background_image_id_assets_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;