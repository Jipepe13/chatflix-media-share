import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/chat";
import { cn } from "@/lib/utils";

const mockUsers: User[] = [
  { id: "1", username: "Alice", isOnline: true },
  { id: "2", username: "Bob", isOnline: false },
  { id: "3", username: "Charlie", isOnline: true },
];

interface ChatSidebarProps {
  selectedUser?: User | null;
  onSelectUser: (user: User | null) => void;
}

export const ChatSidebar = ({ selectedUser, onSelectUser }: ChatSidebarProps) => {
  return (
    <div className="w-64 border-r bg-card p-4 hidden md:block">
      <h2 className="font-semibold mb-4">Conversations</h2>
      <div className="space-y-2">
        <div 
          className={cn(
            "flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer",
            !selectedUser && "bg-muted"
          )}
          onClick={() => onSelectUser(null)}
        >
          <span>Chat Public</span>
        </div>
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className={cn(
              "flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer",
              selectedUser?.id === user.id && "bg-muted"
            )}
            onClick={() => onSelectUser(user)}
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
  );
};