export interface Message {
  id: string;
  content: string;
  sender: string;
  recipient?: string;
  isPrivate?: boolean;
  timestamp: Date;
  image?: string;
  channelId?: string;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
}