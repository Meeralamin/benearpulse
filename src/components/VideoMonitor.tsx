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
  sessionId?: string;
}

const VideoMonitor = ({
  deviceId = "",
  deviceName = "Device",
  isConnected = false,
  onEndSession = () => {},
  videoStream = null,
  isTwoWay = false,
  sessionId = "",
}: VideoMonitorProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle incoming video stream
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  // Handle mute/unmute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle local video toggle
  const toggleLocalVideo = () => {
    setIsLocalVideoEnabled(!isLocalVideoEnabled);
    // In a real implementation, you would disable the local video track here
  };

  // Handle local audio toggle
  const toggleLocalAudio = () => {
    setIsLocalAudioEnabled(!isLocalAudioEnabled);
    // In a real implementation, you would disable the local audio track here
  };

  return (
    <Card className="w-full bg-gray-900" ref={containerRef}>
      <CardHeader className="bg-gray-800 text-white flex flex-row items-center justify-between p-4">
        <div className="flex items-center">
          <CardTitle className="text-lg font-medium">{deviceName}</CardTitle>
          {isConnected && (
            <Badge className="ml-2 bg-green-500">Connected</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
          onClick={onEndSession}
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 relative bg-black aspect-video">
        {/* Main video (child's video) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Connection status overlay */}
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 text-white">
            <div className="text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-medium">Not Connected</p>
              <p className="text-sm text-gray-400 mt-2">
                Click connect to start monitoring
              </p>
            </div>
          </div>
        )}

        {/* Local video (parent's video) - only shown in two-way mode */}
        {isTwoWay && isConnected && (
          <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-800 rounded overflow-hidden border-2 border-gray-700">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isLocalVideoEnabled ? "hidden" : ""}`}
            />
            {!isLocalVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <CameraOff className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-700"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>

          {isTwoWay && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-gray-700 ${isLocalAudioEnabled ? "text-white" : "text-gray-500"}`}
                onClick={toggleLocalAudio}
              >
                {isLocalAudioEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-gray-700 ${isLocalVideoEnabled ? "text-white" : "text-gray-500"}`}
                onClick={toggleLocalVideo}
              >
                {isLocalVideoEnabled ? (
                  <Camera className="h-5 w-5" />
                ) : (
                  <CameraOff className="h-5 w-5" />
                )}
              </Button>
            </>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-700"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoMonitor;
