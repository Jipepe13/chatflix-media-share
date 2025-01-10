import { Channel, User } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Hash, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChannelListProps {
  selectedChannel: Channel | null | undefined;
  onSelectChannel: (channel: Channel | null) => void;
  onSelectUser: (user: null) => void;
}

export const ChannelList = ({ selectedChannel, onSelectChannel, onSelectUser }: ChannelListProps) => {
  const [channels, setChannels] = useState<Channel[]>([
    { 
      id: "1", 
      name: "général", 
      createdAt: new Date(), 
      createdBy: "system",
      connectedUsers: [
        { id: "1", username: "Alice", isOnline: true },
        { id: "2", username: "Bob", isOnline: true },
      ]
    },
    { 
      id: "2", 
      name: "aide", 
      createdAt: new Date(), 
      createdBy: "system",
      connectedUsers: [
        { id: "3", username: "Charlie", isOnline: true },
      ]
    },
  ]);
  const [newChannelName, setNewChannelName] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [expandedChannels, setExpandedChannels] = useState<string[]>(["1", "2"]);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const { toast } = useToast();

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      const newChannel: Channel = {
        id: Date.now().toString(),
        name: newChannelName.trim().toLowerCase(),
        createdAt: new Date(),
        createdBy: "currentUser",
        connectedUsers: []
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
        <div key={channel.id} className="space-y-0.5">
          <div
            className={cn(
              "flex items-center space-x-1 p-1 rounded-lg hover:bg-muted cursor-pointer text-xs group",
              selectedChannel?.id === channel.id && "bg-muted"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => toggleChannelExpand(channel.id)}
            >
              {expandedChannels.includes(channel.id) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
            <div 
              className="flex items-center flex-1"
              onClick={() => {
                onSelectChannel(channel);
                onSelectUser(null);
              }}
            >
              <Hash className="h-3 w-3" />
              <span>{channel.name}</span>
              <span className="ml-1 text-muted-foreground">
                ({channel.connectedUsers?.length || 0})
              </span>
            </div>
            {channel.createdBy !== "system" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChannel(channel);
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            )}
          </div>
          
          {expandedChannels.includes(channel.id) && channel.connectedUsers && (
            <div className="ml-6 space-y-0.5">
              {channel.connectedUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <AlertDialog open={!!channelToDelete} onOpenChange={() => setChannelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le salon #{channelToDelete?.name} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteChannel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};