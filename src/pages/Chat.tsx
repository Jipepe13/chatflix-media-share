import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { Message, User } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { VideoCall } from "@/components/chat/VideoCall";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || selectedImage) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "currentUser",
        timestamp: new Date(),
        image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        isPrivate: !!selectedUser,
        recipient: selectedUser?.id,
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setSelectedImage(null);

      if (selectedUser) {
        toast({
          title: "Message privé envoyé",
          description: `Message envoyé à ${selectedUser.username}`,
        });
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const startVideoCall = () => {
    if (!selectedUser) {
      toast({
        title: "Impossible de démarrer l'appel",
        description: "Veuillez sélectionner un utilisateur pour démarrer un appel vidéo",
        variant: "destructive",
      });
      return;
    }
    setIsInCall(true);
  };

  const filteredMessages = messages.filter(
    (message) =>
      !message.isPrivate ||
      (message.isPrivate &&
        ((message.sender === "currentUser" && message.recipient === selectedUser?.id) ||
          (message.sender === selectedUser?.id && message.recipient === "currentUser")))
  );

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h1 className="font-semibold">
            {selectedUser ? `Chat Privé avec ${selectedUser.username}` : "Chat Public"}
          </h1>
          {selectedUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={startVideoCall}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Appel vidéo
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
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

      {isInCall && selectedUser && (
        <VideoCall
          isInitiator={true}
          userId={selectedUser.username}
          onClose={() => setIsInCall(false)}
        />
      )}
    </div>
  );
};

export default Chat;