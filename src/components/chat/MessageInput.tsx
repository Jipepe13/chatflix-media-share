import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleImageSelect,
}: MessageInputProps) => {
  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t">
      <div className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          id="image-input"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => document.getElementById("image-input")?.click()}
        >
          <ImagePlus className="h-4 w-4" />
        </Button>
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};