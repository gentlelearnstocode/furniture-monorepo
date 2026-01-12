'use server';

import { db, projects, projectAssets } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { projectSchema, type ProjectInput } from '@/lib/validations/project';

export async function getProjects() {
  try {
    const data = await db.query.projects.findMany({
      orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
      with: {
        image: true,
      },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function getProject(id: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        image: true,
        gallery: {
          with: {
            asset: true,
          },
          orderBy: (assets, { asc }) => [asc(assets.position)],
        },
      },
    });

    if (!project) return null;

    return {
      ...project,
      imageUrl: project.image?.url,
      images: project.gallery.map((g) => ({
        assetId: g.assetId,
        url: g.asset.url,
        isPrimary: g.isPrimary,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

export async function upsertProject(data: ProjectInput & { id?: string }) {
  const validated = projectSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const { images, ...projectData } = validated.data;
    const primaryImage = images.find((img) => img.isPrimary) || images[0];

    const [result] = await db
      .insert(projects)
      .values({
        id: data.id,
        ...projectData,
        imageId: primaryImage?.assetId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          ...projectData,
          imageId: primaryImage?.assetId,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!result) {
      throw new Error('Failed to upsert project');
    }

    if (data.id) {
      await db.delete(projectAssets).where(eq(projectAssets.projectId, result.id));
    }

    if (images.length > 0) {
      await db.insert(projectAssets).values(
        images.map((img, index) => ({
          projectId: result.id,
          assetId: img.assetId,
          position: index,
          isPrimary: img.isPrimary,
        }))
      );
    }

    revalidatePath('/projects');
    revalidatePath('/'); // Revalidate homepage if projects are displayed there
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return { error: 'Slug already exists' };
    }
    console.error('Failed to upsert project:', error);
    return { error: 'Database error: Failed to save project.' };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { error: 'Database error: Failed to delete project.' };
  }
}

export async function bulkDeleteProjects(ids: string[]) {
  try {
    const { inArray } = await import('drizzle-orm');
    await db.delete(projects).where(inArray(projects.id, ids));
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to bulk delete projects:', error);
    return { error: 'Failed to bulk delete projects' };
  }
}
