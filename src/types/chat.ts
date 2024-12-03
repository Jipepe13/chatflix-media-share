export interface Message {
  id: string;
  content: string;
  sender: string;
  recipient?: string;
  isPrivate?: boolean;
  timestamp: Date;
  image?: string;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
}