import { db, notifications } from '@repo/database';
import { auth } from '@/auth';

export type NotificationType = 'entity_created' | 'entity_updated' | 'entity_deleted' | 'system';

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  userId?: string; // Specific recipient, if null goes to all admins/editors logic can be added later
}

export async function createNotification({
  type,
  title,
  message,
  link,
  userId,
}: CreateNotificationParams) {
  try {
    const session = await auth();
    const creatorId = session?.user?.id;

    await db.insert(notifications).values({
      type,
      title,
      message,
      link,
      userId,
      creatorId,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    // We don't want to throw error here to avoid breaking the main action
  }
}
