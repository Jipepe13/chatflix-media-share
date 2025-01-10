import { Channel } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Hash, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  onDelete: () => void;
}

export const ChannelItem = ({
  channel,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onDelete,
}: ChannelItemProps) => {
  return (
    <div className="space-y-0.5">
      <div
        className={cn(
          "flex items-center space-x-1 p-1 rounded-lg hover:bg-muted cursor-pointer text-xs group",
          isSelected && "bg-muted"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={onToggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
        <div className="flex items-center flex-1" onClick={onSelect}>
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
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        )}
      </div>

      {isExpanded && channel.connectedUsers && (
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
  );
};