'use server';

import { db, inboxMessages } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function markAsRead(id: string) {
  try {
    await db.update(inboxMessages).set({ isRead: true }).where(eq(inboxMessages.id, id));
    revalidatePath('/inbox');
    return { success: true };
  } catch (error) {
    console.error('Failed to mark as read:', error);
    return { success: false, message: 'Failed to update status' };
  }
}
