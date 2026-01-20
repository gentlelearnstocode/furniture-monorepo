CREATE TABLE "recommended_products" (
	"source_product_id" uuid NOT NULL,
	"recommended_product_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "recommended_products_source_product_id_recommended_product_id_pk" PRIMARY KEY("source_product_id","recommended_product_id")
);
--> statement-breakpoint
ALTER TABLE "catalogs" ADD COLUMN "name_vi" text;--> statement-breakpoint
ALTER TABLE "catalogs" ADD COLUMN "description_vi" text;--> statement-breakpoint
ALTER TABLE "catalogs" ADD COLUMN "product_image_ratio" text DEFAULT '4:5' NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "name_vi" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "description_vi" text;--> statement-breakpoint
ALTER TABLE "footer_addresses" ADD COLUMN "label_vi" text;--> statement-breakpoint
ALTER TABLE "footer_addresses" ADD COLUMN "address_vi" text;--> statement-breakpoint
ALTER TABLE "footer_contacts" ADD COLUMN "label_vi" text;--> statement-breakpoint
ALTER TABLE "option_values" ADD COLUMN "label_vi" text;--> statement-breakpoint
ALTER TABLE "options" ADD COLUMN "name_vi" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "title_vi" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "excerpt_vi" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "content_html_vi" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_title_vi" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_description_vi" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_keywords_vi" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "name_vi" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description_vi" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "short_description_vi" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "title_vi" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "content_html_vi" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "seo_title_vi" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "seo_description_vi" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "seo_keywords_vi" text;--> statement-breakpoint
ALTER TABLE "sale_section_settings" ADD COLUMN "title_vi" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "title_vi" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "description_html_vi" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_title_vi" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_description_vi" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_keywords_vi" text;--> statement-breakpoint
ALTER TABLE "site_footer" ADD COLUMN "intro_vi" text;--> statement-breakpoint
ALTER TABLE "site_footer" ADD COLUMN "description_vi" text;--> statement-breakpoint
ALTER TABLE "site_heros" ADD COLUMN "title_vi" text;--> statement-breakpoint
ALTER TABLE "site_heros" ADD COLUMN "subtitle_vi" text;--> statement-breakpoint
ALTER TABLE "site_heros" ADD COLUMN "button_text_vi" text;--> statement-breakpoint
ALTER TABLE "site_intros" ADD COLUMN "title_vi" text;--> statement-breakpoint
ALTER TABLE "site_intros" ADD COLUMN "subtitle_vi" text;--> statement-breakpoint
ALTER TABLE "site_intros" ADD COLUMN "content_html_vi" text;--> statement-breakpoint
ALTER TABLE "recommended_products" ADD CONSTRAINT "recommended_products_source_product_id_products_id_fk" FOREIGN KEY ("source_product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommended_products" ADD CONSTRAINT "recommended_products_recommended_product_id_products_id_fk" FOREIGN KEY ("recommended_product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;