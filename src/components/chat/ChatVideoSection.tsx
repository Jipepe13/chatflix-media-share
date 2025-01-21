import { VideoCall } from "./VideoCall";

interface ChatVideoSectionProps {
  isVideoCallActive: boolean;
  onEndVideoCall: () => void;
}

export const ChatVideoSection = ({
  isVideoCallActive,
  onEndVideoCall,
}: ChatVideoSectionProps) => {
  if (!isVideoCallActive) return null;

  return (
    <VideoCall
      isInitiator={true}
      userId="other-user"
      onClose={onEndVideoCall}
      onEndCall={onEndVideoCall}
    />
  );
};