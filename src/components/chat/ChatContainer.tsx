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

      channel
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync:', channel.presenceState());
          const presences = channel.presenceState();
          
          // Transform presences into User array and include current user
          const connectedUsers = Object.values(presences)
            .flat()
            .map((presence: any) => ({
              id: presence.user_id,
              username: presence.username,
              isOnline: true
            }));

          // Add current user if not already in the list
          if (!connectedUsers.some(user => user.id === currentUser.id)) {
            connectedUsers.unshift(currentUser);
          }
          
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
            const newConnectedUser = {
              id: newUser.user_id,
              username: newUser.username,
              isOnline: true
            };
            
            if (!prev.connectedUsers.some(user => user.id === newConnectedUser.id)) {
              const updatedUsers = [...prev.connectedUsers];
              if (!updatedUsers.some(user => user.id === currentUser.id)) {
                updatedUsers.unshift(currentUser);
              }
              updatedUsers.push(newConnectedUser);
              return {
                ...prev,
                connectedUsers: updatedUsers
              };
            }
            return prev;
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
          setSelectedChannel(prev => {
            if (!prev || !prev.connectedUsers) return prev;
            const updatedUsers = prev.connectedUsers.filter(
              user => !leftPresences.some((presence: any) => presence.user_id === user.id)
            );
            // Make sure current user is still in the list
            if (!updatedUsers.some(user => user.id === currentUser.id)) {
              updatedUsers.unshift(currentUser);
            }
            return {
              ...prev,
              connectedUsers: updatedUsers
            };
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Channel subscribed, tracking presence...');
            const presenceTrackStatus = await channel.track({
              user_id: currentUser.id,
              username: currentUser.username,
              online_at: new Date().toISOString(),
            });
            console.log('Presence tracked:', presenceTrackStatus);
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
        connectedUsers: [currentUser] // Always initialize with current user
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