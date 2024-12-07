import { User, Channel } from "@/types/chat";
import { ChannelList } from "./ChannelList";
import { UserList } from "./UserList";

interface ChatSidebarProps {
  selectedUser?: User | null;
  onSelectUser: (user: User | null) => void;
  selectedChannel?: Channel | null;
  onSelectChannel: (channel: Channel | null) => void;
}

export const ChatSidebar = ({ 
  selectedUser, 
  onSelectUser, 
  selectedChannel, 
  onSelectChannel 
}: ChatSidebarProps) => {
  return (
    <div className="w-64 border-r bg-card p-2 hidden md:block">
      <div className="space-y-2">
        <ChannelList
          selectedChannel={selectedChannel}
          onSelectChannel={onSelectChannel}
          onSelectUser={onSelectUser}
        />
        <UserList
          selectedUser={selectedUser}
          onSelectUser={onSelectUser}
          onSelectChannel={onSelectChannel}
        />
      </div>
    </div>
  );
};