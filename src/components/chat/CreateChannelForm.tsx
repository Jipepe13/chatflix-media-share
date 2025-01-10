import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface CreateChannelFormProps {
  onChannelCreated: (name: string) => void;
  onCancel: () => void;
}

export const CreateChannelForm = ({ onChannelCreated, onCancel }: CreateChannelFormProps) => {
  const [newChannelName, setNewChannelName] = useState("");
  const { toast } = useToast();

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onChannelCreated(newChannelName.trim().toLowerCase());
      setNewChannelName("");
    }
  };

  return (
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
  );
};