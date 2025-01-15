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
    connectedUsers: []
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bienvenue dans le salon général !",
      sender: "system",
      timestamp: new Date(),
      createdAt: new Date(),
      createdBy: "system",
      connectedUsers: [
        currentUser,
        { id: "1", username: "Alice", isOnline: true },
        { id: "2", username: "Bob", isOnline: true },
      ]
    }
  ]);

  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedChannel) {
      // Subscribe to the channel's presence
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
          const connectedUsers = Object.values(presences).flat().map((presence: any) => ({
            id: presence.user_id,
            username: presence.username,
            isOnline: true
          }));
          
          setSelectedChannel(prev => prev ? {
            ...prev,
            connectedUsers
          } : null);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            const presenceTrackStatus = await channel.track({
              user_id: currentUser.id,
              username: currentUser.username,
              online_at: new Date().toISOString(),
            });
            console.log('Presence tracked:', presenceTrackStatus);
          }
        });

      return () => {
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
    setSelectedChannel(channel);
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