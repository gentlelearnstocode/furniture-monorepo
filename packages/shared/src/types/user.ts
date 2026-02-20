import { EntityBase } from './common';

export type UserRole = 'admin' | 'editor';

export interface User extends EntityBase {
  name: string | null;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export interface Session {
  user: User;
  expires: string;
}
