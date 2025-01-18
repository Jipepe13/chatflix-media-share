import { useState, useEffect } from "react";
import { Message, User, Channel } from "@/types/chat";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { VideoCall } from "./VideoCall";
import { supabase } from "@/integrations/supabase/client";

export const ChatContainer = () => {
  const currentUser: User = {
    id: "current-user",
    username: "Moi",
    isOnline: true
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>({
    id: "1",
    name: "général",
    createdAt: new Date(),
    createdBy: "system",
    connectedUsers: [currentUser]
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bienvenue dans le salon général !",
      sender: "system",
      timestamp: new Date(),
      createdAt: new Date(),
      createdBy: "system",
    }
  ]);

  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedChannel) {
      console.log("Initializing channel presence for:", selectedChannel.name);
      
      const channel = supabase.channel(`room_${selectedChannel.id}`, {
        config: {
          presence: {
            key: currentUser.id,
          },
        },
      });

      const handlePresenceSync = () => {
        console.log('Presence sync event triggered');
        const state = channel.presenceState();
        console.log('Current presence state:', state);
        
        // Get all presences as an array
        const presences = Object.values(state).flat();
        console.log('Flattened presences:', presences);
        
        // Start with current user
        const users = [currentUser];
        
        // Add other users from presences
        presences.forEach((presence: any) => {
          if (presence.user_id !== currentUser.id) {
            const newUser = {
              id: presence.user_id,
              username: presence.username || 'Anonymous',
              isOnline: true
            };
            console.log('Adding user from presence:', newUser);
            users.push(newUser);
          }
        });
        
        console.log('Final users list:', users);
        
        setSelectedChannel(prev => {
          if (!prev) return null;
          return {
            ...prev,
            connectedUsers: users
          };
        });
      };

      channel
        .on('presence', { event: 'sync' }, handlePresenceSync)
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Join event:', { key, newPresences });
          handlePresenceSync();
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Leave event:', { key, leftPresences });
          handlePresenceSync();
        })
        .subscribe(async (status) => {
          console.log('Channel subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('Tracking presence for current user:', currentUser);
            const trackResult = await channel.track({
              user_id: currentUser.id,
              username: currentUser.username,
              online_at: new Date().toISOString(),
            });
            console.log('Track result:', trackResult);
          }
        });

      return () => {
        console.log('Cleaning up channel subscription');
        channel.unsubscribe();
      };
    }
  }, [selectedChannel?.id]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser.username,
      timestamp: new Date(),
      createdAt: new Date(),
      createdBy: currentUser.id,
    };
    setMessages([...messages, newMessage]);
  };

  const handleStartVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image selected:", e.target.files?.[0]);
  };

  const handleSelectChannel = (channel: Channel | null) => {
    console.log("Selecting channel:", channel);
    if (channel) {
      setSelectedChannel({
        ...channel,
        connectedUsers: [currentUser]
      });
    } else {
      setSelectedChannel(null);
    }
    setMessages([
      {
        id: Date.now().toString(),
        content: `Bienvenue dans le salon ${channel?.name} !`,
        sender: "system",
        timestamp: new Date(),
        createdAt: new Date(),
        createdBy: "system",
      }
    ]);
  };

  const handleSelectUser = (user: User | null) => {
    console.log("Selecting user for DM:", user);
    setSelectedUser(user);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar 
        currentUser={currentUser} 
        onStartVideoCall={handleStartVideoCall}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        selectedChannel={selectedChannel}
        onSelectChannel={handleSelectChannel}
      />
      <div className="flex-1 flex flex-col">
        {isVideoCallActive && (
          <VideoCall 
            isInitiator={true}
            userId="other-user"
            onClose={handleEndVideoCall}
            onEndCall={handleEndVideoCall}
          />
        )}
        <MessageList messages={messages} currentUser={currentUser} />
        <MessageInput 
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={(e) => {
            e.preventDefault();
            handleSendMessage(newMessage);
            setNewMessage("");
          }}
          handleImageSelect={handleImageSelect}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};
