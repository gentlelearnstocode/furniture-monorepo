'use server';

import { db, posts, postAssets } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { blogSchema, type BlogInput } from '@/lib/validations/blog';

export async function getPosts() {
  try {
    const data = await db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.updatedAt)],
      with: {
        featuredImage: true,
      },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export async function getPost(id: string) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        featuredImage: true,
        gallery: {
          with: {
            asset: true,
          },
          orderBy: (assets, { asc }) => [asc(assets.position)],
        },
      },
    });

    if (!post) return null;

    return {
      ...post,
      featuredImageUrl: post.featuredImage?.url,
      images: post.gallery.map((g) => ({
        assetId: g.assetId,
        url: g.asset.url,
        isPrimary: g.isPrimary,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export async function upsertPost(data: BlogInput & { id?: string }) {
  const validated = blogSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const { images, ...blogData } = validated.data;
    const primaryImage = images.find((img) => img.isPrimary) || images[0];

    const [result] = await db
      .insert(posts)
      .values({
        id: data.id,
        ...blogData,
        featuredImageId: primaryImage?.assetId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: posts.id,
        set: {
          ...blogData,
          featuredImageId: primaryImage?.assetId,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!result) {
      throw new Error('Failed to upsert post');
    }

    if (data.id) {
      await db.delete(postAssets).where(eq(postAssets.postId, result.id));
    }

    if (images.length > 0) {
      await db.insert(postAssets).values(
        images.map((img, index) => ({
          postId: result.id,
          assetId: img.assetId,
          position: index,
          isPrimary: img.isPrimary,
        }))
      );
    }

    revalidatePath('/blogs');
    revalidatePath('/'); // Revalidate homepage if blog posts are displayed there
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return { error: 'Slug already exists' };
    }
    console.error('Failed to upsert post:', error);
    return { error: 'Database error: Failed to save post.' };
  }
}

export async function deletePost(id: string) {
  try {
    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath('/blogs');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { error: 'Database error: Failed to delete blog post.' };
  }
}
