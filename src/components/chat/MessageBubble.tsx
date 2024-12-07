import { Message } from "@/types/chat";
import { preventImageCopy } from "@/utils/image";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isCurrentUser = message.sender === "currentUser";
  
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} py-1 px-2 hover:bg-secondary/50`}>
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-1">
          <span className="font-medium">
            {isCurrentUser ? "Vous" : message.sender}:
          </span>
          {message.isPrivate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              <span>MP</span>
            </div>
          )}
        </div>
        
        {message.image && (
          <div className="relative">
            <img
              src={message.image}
              alt="Shared"
              className="rounded-lg max-w-xs select-none"
              onContextMenu={preventImageCopy}
              draggable="false"
              style={{ WebkitUserSelect: "none", userSelect: "none" }}
            />
            <div className="absolute bottom-3 right-3 text-white text-sm bg-black/50 px-2 py-1 rounded">
              {message.sender}
            </div>
          </div>
        )}
        
        <p>{message.content}</p>
        
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};