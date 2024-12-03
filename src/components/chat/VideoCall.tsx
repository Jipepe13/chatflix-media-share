import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VideoCallProps {
  isInitiator: boolean;
  userId: string;
  onClose: () => void;
}

export const VideoCall = ({ isInitiator, userId, onClose }: VideoCallProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        const peer = new Peer({
          initiator: isInitiator,
          trickle: false,
          stream,
        });

        peer.on("signal", (data) => {
          // Ici, vous devriez envoyer le signal au serveur
          console.log("Signal généré:", data);
        });

        peer.on("stream", (remoteStream) => {
          if (peerVideo.current) {
            peerVideo.current.srcObject = remoteStream;
          }
        });

        peerRef.current = peer;
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible d'accéder à la caméra ou au microphone",
          variant: "destructive",
        });
        console.error("Erreur d'accès aux périphériques:", err);
      }
    };

    startCall();

    return () => {
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