import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Channel } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Plus, Hash, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const mockUsers: User[] = [
  { id: "1", username: "Alice", isOnline: true },
  { id: "2", username: "Bob", isOnline: false },
  { id: "3", username: "Charlie", isOnline: true },
];

const defaultChannels: Channel[] = [
  { id: "1", name: "général", createdAt: new Date(), createdBy: "system" },
  { id: "2", name: "aide", createdAt: new Date(), createdBy: "system" },
];

interface ChatSidebarProps {
  selectedUser?: User | null;
  onSelectUser: (user: User | null) => void;
  selectedChannel?: Channel | null;
  onSelectChannel: (channel: Channel | null) => void;
}

export const ChatSidebar = ({ 
  selectedUser, 
  onSelectUser, 
  selectedChannel, 
  onSelectChannel 
}: ChatSidebarProps) => {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [newChannelName, setNewChannelName] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const { toast } = useToast();

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      const newChannel: Channel = {
        id: Date.now().toString(),
        name: newChannelName.trim().toLowerCase(),
        createdAt: new Date(),
        createdBy: "currentUser",
      };
      setChannels([...channels, newChannel]);
      setNewChannelName("");
      setIsCreatingChannel(false);
      toast({
        title: "Salon créé",
        description: `Le salon #${newChannel.name} a été créé avec succès.`
      });
    }
  };

  return (
    <div className="w-64 border-r bg-card p-4 hidden md:block">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Salons</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCreatingChannel(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {isCreatingChannel && (
            <div className="flex gap-2">
              <Input
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="nom-du-salon"
                className="text-sm"
              />
              <Button size="sm" onClick={handleCreateChannel}>
                Créer
              </Button>
            </div>
          )}

          {channels.map((channel) => (
            <div
              key={channel.id}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer",
                selectedChannel?.id === channel.id && "bg-muted"
              )}
              onClick={() => {
                onSelectChannel(channel);
                onSelectUser(null);
              }}
            >
              <Hash className="h-4 w-4" />
              <span>{channel.name}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">Messages Privés</h2>
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer",
                selectedUser?.id === user.id && "bg-muted"
              )}
              onClick={() => {
                onSelectUser(user);
                onSelectChannel(null);
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};