import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
} from "lucide-react";

interface VideoMonitorProps {
  deviceId?: string;
  deviceName?: string;
  isConnected?: boolean;
  onEndSession?: () => void;
  videoStream?: MediaStream | null;
  isTwoWay?: boolean;
}

const VideoMonitor = ({
  deviceId = "device-1",
  deviceName = "Child Device",
  isConnected = true,
  onEndSession = () => {},
  videoStream = null,
  isTwoWay = true,
}: VideoMonitorProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Effect to attach remote video stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && videoStream) {
      remoteVideoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  // Effect to get local camera/mic for two-way communication
  useEffect(() => {
    if (isTwoWay) {
      const setupLocalStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setLocalStream(stream);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera/microphone:", err);
        }
      };

      setupLocalStream();

      return () => {
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [isTwoWay]);

  const toggleMute = () => setIsMuted(!isMuted);
  const togglePause = () => setIsPaused(!isPaused);

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled;
        setCameraEnabled(!cameraEnabled);
      }
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
        setMicEnabled(!micEnabled);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background border-2 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">{deviceName}</CardTitle>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <Button variant="destructive" size="sm" onClick={onEndSession}>
          <X className="mr-1 h-4 w-4" /> End Session
        </Button>
      </CardHeader>

      <CardContent className="p-0 relative bg-black">
        <div className="relative">
          {/* Remote video (child) - MAIN DISPLAY */}
          {!videoStream || isPaused ? (
            <div className="aspect-video flex items-center justify-center bg-slate-900 text-white">
              {isPaused ? (
                <div className="text-center">
                  <Pause className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p>Video paused</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg">Connecting to {deviceName}...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Waiting for video stream
                  </p>
                </div>
              )}
            </div>
          ) : (
            <video
              ref={remoteVideoRef}
              className="w-full aspect-video object-cover"
              autoPlay
              playsInline
              muted={isMuted}
            />
          )}

          {/* Local video (parent) - picture-in-picture */}
          {isTwoWay && localStream && (
            <div className="absolute bottom-4 right-4 w-1/4 max-w-[180px] rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video
                ref={localVideoRef}
                className="w-full aspect-video object-cover"
                autoPlay
                playsInline
                muted={true} // Always mute local video to prevent feedback
              />
              {!cameraEnabled && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <CameraOff className="h-8 w-8 text-white opacity-70" />
                </div>
              )}
            </div>
          )}

          {/* Connection status overlay */}
          {isConnected && (
            <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-1 text-white text-sm animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              Live
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 bg-muted/10">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePause}
            disabled={!videoStream}
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            disabled={!videoStream}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          {isTwoWay && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleCamera}
                disabled={!localStream}
              >
                {cameraEnabled ? (
                  <Camera className="h-4 w-4" />
                ) : (
                  <CameraOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleMic}
                disabled={!localStream}
              >
                {micEnabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {isConnected ? "Connected to " + deviceName : "Disconnected"}
          </p>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            disabled={!videoStream}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoMonitor;
