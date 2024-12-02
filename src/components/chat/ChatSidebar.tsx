import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const users = ["Alice", "Bob", "Charlie"];

export const ChatSidebar = () => {
  return (
    <div className="w-64 border-r bg-card p-4 hidden md:block">
      <h2 className="font-semibold mb-4">Conversations</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
          >
            <Avatar>
              <AvatarFallback>{user[0]}</AvatarFallback>
            </Avatar>
            <span>{user}</span>
          </div>
        ))}
      </div>
    </div>
  );
};