import { EntityBase } from './common';

export type NotificationType = 'entity_created' | 'entity_updated' | 'entity_deleted' | 'system';

export interface Notification extends EntityBase {
  userId: string | null;
  creatorId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
}
