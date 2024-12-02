import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlus, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  image?: string;
}

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

  const preventImageCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Tentative de copie d'image bloquée");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 hidden md:block">
        <h2 className="font-semibold mb-4">Conversations</h2>
        <div className="space-y-2">
          {["Alice", "Bob", "Charlie"].map((user) => (
            <div
              key={user}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
            >
              <Avatar>
                <AvatarFallback>{user[0]}</AvatarFallback>
              </Avatar>
              <span>{user}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <h1 className="font-semibold">Chat Public</h1>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "currentUser" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`message-bubble ${
                    message.sender === "currentUser"
                      ? "message-bubble-sent"
                      : "message-bubble-received"
                  }`}
                >
                  {message.image && (
                    <div className="relative">
                      <img
                        src={message.image}
                        alt="Shared"
                        className="rounded-lg mb-2 max-w-xs select-none"
                        onContextMenu={preventImageCopy}
                        draggable="false"
                        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                      />
                      <div className="absolute bottom-3 right-3 text-white text-sm bg-black/50 px-2 py-1 rounded">
                        @{message.sender}
                      </div>
                    </div>
                  )}
                  <p>{message.content}</p>
                  <span className="text-xs opacity-50">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-input"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => document.getElementById("image-input")?.click()}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;