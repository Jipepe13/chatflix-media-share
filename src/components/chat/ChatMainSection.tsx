import { Message, User } from "@/types/chat";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatMainSectionProps {
  messages: Message[];
  currentUser: User;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (content: string) => void;
}

export const ChatMainSection = ({
  messages,
  currentUser,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleImageSelect,
  onSendMessage,
}: ChatMainSectionProps) => {
  return (
    <>
      <MessageList messages={messages} currentUser={currentUser} />
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        handleImageSelect={handleImageSelect}
        onSendMessage={onSendMessage}
      />
    </>
  );
};