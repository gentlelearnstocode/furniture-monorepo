'use server';

import { db, notifications } from '@repo/database';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];

  try {
    return await db.query.notifications.findMany({
      where: (notifications, { eq, or, isNull }) =>
        or(eq(notifications.userId, userId), isNull(notifications.userId)),
      orderBy: [desc(notifications.createdAt)],
      limit: 20,
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
}

export async function markAsRead(id: string) {
  try {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    revalidatePath('/'); // Revalidate header
    return { success: true };
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return { error: 'Failed to update notification' };
  }
}

export async function markAllAsRead() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: 'Unauthorized' };

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return { error: 'Failed to update notifications' };
  }
}
