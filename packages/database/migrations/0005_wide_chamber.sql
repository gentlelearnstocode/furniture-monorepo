CREATE TABLE "catalog_collections" (
	"catalog_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL,
	CONSTRAINT "catalog_collections_catalog_id_collection_id_pk" PRIMARY KEY("catalog_id","collection_id")
);
--> statement-breakpoint
ALTER TABLE "catalog_collections" ADD CONSTRAINT "catalog_collections_catalog_id_catalogs_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_collections" ADD CONSTRAINT "catalog_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;