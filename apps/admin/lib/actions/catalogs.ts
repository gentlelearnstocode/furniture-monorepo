"use server";

import { db, catalogs } from "@repo/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCatalogSchema, type CreateCatalogInput } from "@/lib/validations/catalogs";

export async function createCatalog(data: CreateCatalogInput) {
  const validated = createCatalogSchema.safeParse(data);

  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  const { name, slug, description } = validated.data;

  try {
    // Check for existing slug
    const existing = await db.query.catalogs.findFirst({
        where: (catalogs, { eq }) => eq(catalogs.slug, slug)
    });
    
    if (existing) {
        return { error: "Slug already exists." };
    }

    await db.insert(catalogs).values({
      name,
      slug,
      description: description || null,
    });
  } catch (error) {
    console.error("Failed to create catalog:", error);
    return { error: "Database error: Failed to create catalog." };
  }

  revalidatePath("/catalogs");
  redirect("/catalogs");
}
