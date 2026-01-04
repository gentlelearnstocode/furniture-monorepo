export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  name: string | null;
  username: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
