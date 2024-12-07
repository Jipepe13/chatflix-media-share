import { Channel } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Hash } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ChannelListProps {
  selectedChannel: Channel | null | undefined;
  onSelectChannel: (channel: Channel | null) => void;
  onSelectUser: (user: null) => void;
}

export const ChannelList = ({ selectedChannel, onSelectChannel, onSelectUser }: ChannelListProps) => {
  const [channels, setChannels] = useState<Channel[]>([
    { id: "1", name: "général", createdAt: new Date(), createdBy: "system" },
    { id: "2", name: "aide", createdAt: new Date(), createdBy: "system" },
  ]);
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
        <div className="flex gap-1">
          <Input
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="nom-du-salon"
            className="text-xs h-6"
          />
          <Button size="sm" className="h-6 text-xs px-2" onClick={handleCreateChannel}>
            Créer
          </Button>
        </div>
      )}

      {channels.map((channel) => (
        <div
          key={channel.id}
          className={cn(
            "flex items-center space-x-1 p-1 rounded-lg hover:bg-muted cursor-pointer text-xs",
            selectedChannel?.id === channel.id && "bg-muted"
          )}
          onClick={() => {
            onSelectChannel(channel);
            onSelectUser(null);
          }}
        >
          <Hash className="h-3 w-3" />
          <span>{channel.name}</span>
        </div>
      ))}
    </div>
  );
};