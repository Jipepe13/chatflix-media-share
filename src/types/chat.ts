export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  image?: string;
}