import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { Message } from "@/types/chat";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bonjour ! Comment ça va ?",
      sender: "user1",
      timestamp: new Date(),
    },
    {
      id: "2",
      content: "Très bien, merci ! Et toi ?",
      sender: "currentUser",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || selectedImage) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "currentUser",
        timestamp: new Date(),
        image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <h1 className="font-semibold">Chat Public</h1>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleImageSelect={handleImageSelect}
        />
      </div>
    </div>
  );
};

export default Chat;