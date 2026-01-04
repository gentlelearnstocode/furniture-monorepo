import { db } from "@repo/database";
import { notFound } from "next/navigation";
import { CatalogForm } from "../components/catalog-form";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/ui/button";

interface EditCatalogPageProps {
  params: {
    id: string;
  };
}

export default async function EditCatalogPage({ params }: EditCatalogPageProps) {
  const { id: catalogId } = await params;

  const catalog = await db.query.catalogs.findFirst({
    where: (catalogs, { eq }) => eq(catalogs.id, catalogId),
  });

  if (!catalog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/catalogs">
            <Button variant="outline" size="icon">
                <MoveLeft className="h-4 w-4" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Catalog</h1>
            <p className="text-sm text-gray-500">Update catalog category details.</p>
        </div>
      </div>
      <div className="max-w-4xl">
        <CatalogForm initialData={catalog} />
      </div>
    </div>
  );
}
