"use server";

import { db, products, productAssets } from "@repo/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProductSchema, type CreateProductInput } from "@/lib/validations/products";
import { eq } from "drizzle-orm";

export async function createProduct(data: CreateProductInput) {
  const validated = createProductSchema.safeParse(data);

  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  const { name, slug, description, shortDescription, basePrice, catalogId, isActive, dimensions, images } = validated.data;

  try {
    // Check for existing slug
    const existing = await db.query.products.findFirst({
        where: (products, { eq }) => eq(products.slug, slug)
    });
    
    if (existing) {
        return { error: "Slug already exists. Please choose a unique name or slug." };
    }

    const [product] = await db.insert(products).values({
      name,
      slug,
      description: description || null,
      shortDescription: shortDescription || null,
      basePrice: basePrice.toString(), // Decimal types often expect strings in ORMs to preserve precision
      catalogId: catalogId || null,
      isActive,
      dimensions: dimensions || null,
    }).returning();

    if (product && images && images.length > 0) {
      await db.insert(productAssets).values(
        images.map((img, index) => ({
          productId: product.id,
          assetId: img.assetId,
          position: index,
          isPrimary: img.isPrimary,
        }))
      );
    }
  } catch (error) {
    console.error("Failed to create product:", error);
    return { error: "Database error: Failed to create product." };
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(id: string, data: CreateProductInput) {
  const validated = createProductSchema.safeParse(data);

  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  const { name, slug, description, shortDescription, basePrice, catalogId, isActive, dimensions, images } = validated.data;

  try {
    // Check for existing slug (excluding current product)
    const existing = await db.query.products.findFirst({
        where: (products, { eq, and, ne }) => and(eq(products.slug, slug), ne(products.id, id))
    });
    
    if (existing) {
        return { error: "Slug already exists. Please choose a unique name or slug." };
    }

    await db.update(products)
      .set({
        name,
        slug,
        description: description || null,
        shortDescription: shortDescription || null,
        basePrice: basePrice.toString(),
        catalogId: catalogId || null,
        isActive,
        dimensions: dimensions || null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    // Update images: delete old ones and insert new ones
    // A more efficient way would be to diff, but for now this is simpler
    await db.delete(productAssets).where(eq(productAssets.productId, id));

    if (images && images.length > 0) {
      await db.insert(productAssets).values(
        images.map((img, index) => ({
          productId: id,
          assetId: img.assetId,
          position: index,
          isPrimary: img.isPrimary,
        }))
      );
    }
  } catch (error) {
    console.error("Failed to update product:", error);
    return { error: "Database error: Failed to update product." };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}/edit`);
  redirect("/products");
}

export async function deleteProduct(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { error: "Failed to delete product" };
  }
}
