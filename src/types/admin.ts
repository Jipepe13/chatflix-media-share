export interface User {
  id: string;
  email: string | null;
  role: string;
  last_sign_in_at: string | null;
}

export type RoleOption = 'all' | 'admin' | 'moderator' | 'user';