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
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={cn(
          "message-bubble",
          isCurrentUser ? "message-bubble-sent" : "message-bubble-received",
          message.isPrivate && "border-2 border-primary/20"
        )}
      >
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">
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
          <div className="relative mt-1">
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
        
        <p className="mt-1">{message.content}</p>
        
        <span className="text-xs opacity-50 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};