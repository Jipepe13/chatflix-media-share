import { useState, useEffect } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { User, Channel } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export const useChannelPresence = (
  selectedChannel: Channel | null,
  currentUser: User
) => {
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
          return connectedUsers;
        };

        currentChannel
          .on('presence', { event: 'sync' }, () => handlePresenceSync())
          .on('presence', { event: 'join' }, () => {
            console.log('Join event received');
            handlePresenceSync();
          })
          .on('presence', { event: 'leave' }, () => {
            console.log('Leave event received');
            handlePresenceSync();
          });

        try {
          await currentChannel.subscribe((status) => {
            console.log("Channel subscription status:", status);
            
            if (status === "SUBSCRIBED") {
              console.log("Channel successfully subscribed, tracking presence");
              const presenceData = {
                user_id: currentUser.id,
                username: currentUser.username,
                online_at: new Date().toISOString(),
              };

              currentChannel?.track(presenceData)
                .then(() => {
                  console.log("Presence tracked successfully");
                  setChannel(currentChannel);
                })
                .catch((error) => {
                  console.error("Error tracking presence:", error);
                });
            }
          });
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
  }, [selectedChannel?.id, currentUser]);

  return channel;
};