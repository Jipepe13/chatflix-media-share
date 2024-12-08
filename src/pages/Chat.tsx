import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { Message, User, Channel } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { VideoCall } from "@/components/chat/VideoCall";
import { Button } from "@/components/ui/button";
import { Video, Hash } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bonjour ! Comment ça va ?",
      sender: "user1",
      timestamp: new Date(),
      channelId: "1"
    },
    {
      id: "2",
      content: "Très bien, merci ! Et toi ?",
      sender: "currentUser",
      timestamp: new Date(),
      channelId: "1"
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>({
    id: "1",
    name: "général",
    createdAt: new Date(),
    createdBy: "system",
    connectedUsers: [
      { id: "1", username: "Alice", isOnline: true },
      { id: "2", username: "Bob", isOnline: true },
    ]
  });
  const [isInCall, setIsInCall] = useState(false);
  const { toast } = useToast();

  console.log("Selected channel:", selectedChannel);
  console.log("Connected users:", selectedChannel?.connectedUsers);

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
        channelId: selectedChannel?.id
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
      (selectedChannel && message.channelId === selectedChannel.id) ||
      (!selectedChannel &&
        message.isPrivate &&
        ((message.sender === "currentUser" && message.recipient === selectedUser?.id) ||
          (message.sender === selectedUser?.id && message.recipient === "currentUser")))
  );

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} className="bg-card">
            <ChatSidebar 
              selectedUser={selectedUser} 
              onSelectUser={setSelectedUser}
              selectedChannel={selectedChannel}
              onSelectChannel={setSelectedChannel}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={60}>
            <div className="flex flex-col h-full bg-white/80 backdrop-blur-sm">
              <div className="border-b p-4 flex justify-between items-center bg-white/90">
                <h1 className="font-semibold flex items-center gap-2">
                  {selectedChannel ? (
                    <>
                      <Hash className="h-5 w-5" />
                      {selectedChannel.name}
                    </>
                  ) : (
                    `Chat Privé avec ${selectedUser?.username}`
                  )}
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
          </ResizablePanel>

          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full border-l bg-card p-4">
              <h2 className="font-semibold text-sm mb-4">Utilisateurs connectés</h2>
              {selectedChannel?.connectedUsers?.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 p-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm">{user.username}</span>
                </div>
              ))}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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