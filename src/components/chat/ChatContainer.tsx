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
    connectedUsers: []  // Initialize empty
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

      channel
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync:', channel.presenceState());
          
          // Get all presences
          const presences = channel.presenceState();
          const connectedUsers: User[] = [];
          
          // First add current user
          connectedUsers.push(currentUser);
          
          // Then add other users from presences
          Object.values(presences)
            .flat()
            .forEach((presence: any) => {
              if (presence.user_id !== currentUser.id) {
                connectedUsers.push({
                  id: presence.user_id,
                  username: presence.username,
                  isOnline: true
                });
              }
            });
          
          console.log('Connected users after sync:', connectedUsers);
          
          setSelectedChannel(prev => {
            if (!prev) return null;
            return {
              ...prev,
              connectedUsers
            };
          });
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
          setSelectedChannel(prev => {
            if (!prev || !prev.connectedUsers) return prev;
            
            const newUser = newPresences[0];
            // Don't add if it's the current user
            if (newUser.user_id === currentUser.id) return prev;
            
            // Don't add if user already exists
            if (prev.connectedUsers.some(user => user.id === newUser.user_id)) {
              return prev;
            }
            
            const newConnectedUser = {
              id: newUser.user_id,
              username: newUser.username,
              isOnline: true
            };
            
            return {
              ...prev,
              connectedUsers: [...prev.connectedUsers, newConnectedUser]
            };
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
          setSelectedChannel(prev => {
            if (!prev || !prev.connectedUsers) return prev;
            
            // Keep current user and remove others that left
            const updatedUsers = prev.connectedUsers.filter(user => 
              user.id === currentUser.id || 
              !leftPresences.some((presence: any) => presence.user_id === user.id)
            );
            
            return {
              ...prev,
              connectedUsers: updatedUsers
            };
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Channel subscribed, tracking presence...');
            await channel.track({
              user_id: currentUser.id,
              username: currentUser.username,
              online_at: new Date().toISOString(),
            });
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
        connectedUsers: []  // Start empty and let presence handle it
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
