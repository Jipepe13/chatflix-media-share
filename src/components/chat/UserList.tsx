import { User } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserProfileCard } from "./UserProfileCard";

interface UserListProps {
  selectedUser: User | null | undefined;
  onSelectUser: (user: User) => void;
  onSelectChannel: (channel: null) => void;
}

export const UserList = ({ selectedUser, onSelectUser, onSelectChannel }: UserListProps) => {
  const mockUsers: User[] = [
    { id: "1", username: "Alice", isOnline: true },
    { id: "2", username: "Bob", isOnline: false },
    { id: "3", username: "Charlie", isOnline: true },
  ];

  return (
    <div className="space-y-1">
      <h2 className="font-semibold text-xs">Messages Privés</h2>
      {mockUsers.map((user) => (
        <UserProfileCard key={user.id} user={user}>
          <div
            className={cn(
              "flex items-center space-x-2 p-1 rounded-lg hover:bg-muted cursor-pointer",
              selectedUser?.id === user.id && "bg-muted"
            )}
            onClick={() => {
              onSelectUser(user);
              onSelectChannel(null);
            }}
          >
            <div className="relative">
              <Avatar className="h-5 w-5">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-[10px]">{user.username[0]}</AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-[1px] border-background" />
              )}
            </div>
            <span className="text-xs truncate">{user.username}</span>
          </div>
        </UserProfileCard>
      ))}
    </div>
  );
};