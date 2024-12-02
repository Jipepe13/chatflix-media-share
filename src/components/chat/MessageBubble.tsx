import { Message } from "@/types/chat";
import { preventImageCopy } from "@/utils/image";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isCurrentUser = message.sender === "currentUser";
  
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`message-bubble ${
          isCurrentUser ? "message-bubble-sent" : "message-bubble-received"
        }`}
      >
        {message.image && (
          <div className="relative">
            <img
              src={message.image}
              alt="Shared"
              className="rounded-lg mb-2 max-w-xs select-none"
              onContextMenu={preventImageCopy}
              draggable="false"
              style={{ WebkitUserSelect: "none", userSelect: "none" }}
            />
            <div className="absolute bottom-3 right-3 text-white text-sm bg-black/50 px-2 py-1 rounded">
              @{message.sender}
            </div>
          </div>
        )}
        <p>{message.content}</p>
        <span className="text-xs opacity-50">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};