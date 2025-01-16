import { Channel, User } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CreateChannelForm } from "./CreateChannelForm";
import { DeleteChannelDialog } from "./DeleteChannelDialog";
import { ChannelItem } from "./ChannelItem";

interface ChannelListProps {
  selectedChannel: Channel | null | undefined;
  onSelectChannel: (channel: Channel | null) => void;
  onSelectUser: (user: null) => void;
}

export const ChannelList = ({ selectedChannel, onSelectChannel, onSelectUser }: ChannelListProps) => {
  const mockUsers: User[] = [
    { id: "1", username: "Alice", isOnline: true },
    { id: "2", username: "Bob", isOnline: true },
    { id: "3", username: "Charlie", isOnline: true },
  ];

  const [channels, setChannels] = useState<Channel[]>([
    { 
      id: "1", 
      name: "général", 
      createdAt: new Date(), 
      createdBy: "system",
      connectedUsers: mockUsers
    },
    { 
      id: "2", 
      name: "aide", 
      createdAt: new Date(), 
      createdBy: "system",
      connectedUsers: mockUsers
    },
  ]);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [expandedChannels, setExpandedChannels] = useState<string[]>(["1", "2"]);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const { toast } = useToast();

  const handleCreateChannel = (name: string) => {
    const newChannel: Channel = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      createdBy: "currentUser",
      connectedUsers: mockUsers
    };
    setChannels([...channels, newChannel]);
    setIsCreatingChannel(false);
    toast({
      title: "Salon créé",
      description: `Le salon #${newChannel.name} a été créé avec succès.`
    });
  };

  const handleDeleteChannel = (channel: Channel) => {
    if (channel.createdBy === "system") {
      toast({
        title: "Action non autorisée",
        description: "Les salons système ne peuvent pas être supprimés.",
        variant: "destructive"
      });
      return;
    }
    setChannelToDelete(channel);
  };

  const confirmDeleteChannel = () => {
    if (channelToDelete) {
      setChannels(channels.filter(c => c.id !== channelToDelete.id));
      if (selectedChannel?.id === channelToDelete.id) {
        onSelectChannel(null);
      }
      toast({
        title: "Salon supprimé",
        description: `Le salon #${channelToDelete.name} a été supprimé.`
      });
      setChannelToDelete(null);
    }
  };

  const toggleChannelExpand = (channelId: string) => {
    setExpandedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xs">Salons</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCreatingChannel(true)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      {isCreatingChannel && (
        <CreateChannelForm
          onChannelCreated={handleCreateChannel}
          onCancel={() => setIsCreatingChannel(false)}
        />
      )}

      {channels.map((channel) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isSelected={selectedChannel?.id === channel.id}
          isExpanded={expandedChannels.includes(channel.id)}
          onSelect={() => {
            onSelectChannel(channel);
            onSelectUser(null);
          }}
          onToggleExpand={() => toggleChannelExpand(channel.id)}
          onDelete={() => handleDeleteChannel(channel)}
        />
      ))}

      {channelToDelete && (
        <DeleteChannelDialog
          channel={channelToDelete}
          onConfirm={confirmDeleteChannel}
          onCancel={() => setChannelToDelete(null)}
        />
      )}
    </div>
  );
};