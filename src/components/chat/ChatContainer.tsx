import { useState } from "react";
import { Message, User } from "@/types/chat";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { VideoCall } from "./VideoCall";

export const ChatContainer = () => {
  // Simuler un utilisateur courant
  const currentUser: User = {
    id: "current-user",
    username: "Moi",
    isOnline: true
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bienvenue dans le salon général !",
      createdAt: new Date(),
      createdBy: "system",
      connectedUsers: [
        currentUser, // Ajouter l'utilisateur courant
        { id: "1", username: "Alice", isOnline: true },
        { id: "2", username: "Bob", isOnline: true },
      ]
    }
  ]);

  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      createdBy: currentUser.id,
    };
    setMessages([...messages, newMessage]);
  };

  const handleStartVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar currentUser={currentUser} onStartVideoCall={handleStartVideoCall} />
      <div className="flex-1 flex flex-col">
        {isVideoCallActive && <VideoCall onEndCall={handleEndVideoCall} />}
        <MessageList messages={messages} currentUser={currentUser} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};