import { db } from "@repo/database";
import { notFound } from "next/navigation";
import { CollectionForm } from "../components/collection-form";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/ui/button";

export const dynamic = 'force-dynamic';

interface EditCollectionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = await params;

  const collection = await db.query.collections.findFirst({
    where: (collections, { eq }) => eq(collections.id, id),
    with: {
      banner: true,
      products: true,
    },
  });

  if (!collection) {
    notFound();
  }

  const allProducts = await db.query.products.findMany({
    orderBy: (products, { asc }) => [asc(products.name)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/collections">
            <Button variant="outline" size="icon">
                <MoveLeft className="h-4 w-4" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Collection</h1>
            <p className="text-sm text-gray-500">Update collection details and manage products.</p>
        </div>
      </div>
      <CollectionForm 
        initialData={collection} 
        availableProducts={allProducts} 
      />
    </div>
  );
}
