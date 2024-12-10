import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VideoCallProps {
  isInitiator: boolean;
  userId: string;
  onClose: () => void;
  onEndCall: () => void;
}

export const VideoCall = ({ isInitiator, userId, onClose, onEndCall }: VideoCallProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    console.log("Initializing video call...");
    const startCall = async () => {
      try {
        console.log("Requesting media devices...");
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media devices acquired successfully");
        setStream(userMedia);
        
        if (myVideo.current) {
          myVideo.current.srcObject = userMedia;
        }

        const peerOptions = {
          initiator: isInitiator,
          trickle: false,
          stream: userMedia,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        };

        console.log("Creating peer with options:", peerOptions);
        const peer = new Peer(peerOptions);

        peer.on("signal", (data) => {
          console.log("Signal generated:", data);
          // Here you would send the signal to the other peer through your signaling server
        });

        peer.on("stream", (remoteStream) => {
          console.log("Received remote stream");
          if (peerVideo.current) {
            peerVideo.current.srcObject = remoteStream;
          }
        });

        peer.on("error", (err) => {
          console.error("Peer error:", err);
          toast({
            title: "Erreur de connexion",
            description: "Une erreur est survenue lors de l'appel vidéo",
            variant: "destructive",
          });
        });

        peerRef.current = peer;
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast({
          title: "Erreur",
          description: "Impossible d'accéder à la caméra ou au microphone",
          variant: "destructive",
        });
      }
    };

    startCall();

    return () => {
      console.log("Cleaning up video call...");
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [isInitiator]);

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-4 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <video
              ref={myVideo}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg bg-muted"
            />
            <span className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
              Vous
            </span>
          </div>
          <div className="relative">
            <video
              ref={peerVideo}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-muted"
            />
            <span className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
              {userId}
            </span>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            variant={isVideoEnabled ? "outline" : "destructive"}
            size="icon"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? (
              <Video className="h-4 w-4" />
            ) : (
              <VideoOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant={isAudioEnabled ? "outline" : "destructive"}
            size="icon"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </Button>
          <Button variant="destructive" size="icon" onClick={onClose}>
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
