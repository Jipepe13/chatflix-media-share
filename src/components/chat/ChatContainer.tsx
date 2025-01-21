import { useState, useEffect } from "react";
import { Message, User, Channel } from "@/types/chat";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { VideoCall } from "./VideoCall";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

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
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let currentChannel: RealtimeChannel | null = null;

    const setupChannel = async () => {
      if (selectedChannel) {
        console.log("Initializing channel presence for:", selectedChannel.name);
        
        if (currentChannel) {
          console.log("Cleaning up previous channel");
          await currentChannel.unsubscribe();
        }

        currentChannel = supabase.channel(`room_${selectedChannel.id}`, {
          config: {
            presence: {
              key: currentUser.id,
            },
          },
        });

        const handlePresenceSync = () => {
          console.log('Presence sync event triggered');
          const state = currentChannel?.presenceState() || {};
          console.log('Current presence state:', state);
          
          const connectedUsers: User[] = [currentUser];
          
          Object.entries(state).forEach(([userId, presences]) => {
            if (Array.isArray(presences) && presences.length > 0) {
              const presence = presences[0] as any;
              if (userId !== currentUser.id) {
                connectedUsers.push({
                  id: userId,
                  username: presence.username || 'Anonymous',
                  isOnline: true
                });
              }
            }
          });
          
          console.log('Updated connected users:', connectedUsers);
          
          setSelectedChannel(prev => prev ? {
            ...prev,
            connectedUsers
          } : null);
        };

        currentChannel
          .on('presence', { event: 'sync' }, handlePresenceSync)
          .on('presence', { event: 'join' }, () => {
            console.log('Join event received');
            handlePresenceSync();
          })
          .on('presence', { event: 'leave' }, () => {
            console.log('Leave event received');
            handlePresenceSync();
          });

        try {
          const status = await currentChannel.subscribe();
          console.log("Channel subscription status:", status);

          if (status === 'SUBSCRIBED') {
            console.log("Channel successfully subscribed, tracking presence");
            const presenceData = {
              user_id: currentUser.id,
              username: currentUser.username,
              online_at: new Date().toISOString(),
            };

            try {
              await currentChannel.track(presenceData);
              console.log("Presence tracked successfully");
              setChannel(currentChannel);
            } catch (error) {
              console.error("Error tracking presence:", error);
            }
          }
        } catch (error) {
          console.error("Error subscribing to channel:", error);
        }
      }
    };

    setupChannel();

    return () => {
      if (currentChannel) {
        console.log("Cleaning up channel subscription");
        currentChannel.unsubscribe();
      }
    };
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
