ALTER TABLE "catalogs" ADD COLUMN "show_on_home" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogs" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN "show_on_home";--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN "home_layout";