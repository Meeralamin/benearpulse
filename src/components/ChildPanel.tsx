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
  Eye,
  ShieldAlert,
  Clock,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
} from "lucide-react";
import { DeviceSettings } from "@/lib/deviceSettings";

interface ChildPanelProps {
  deviceId?: string;
  deviceName?: string;
  isBeingWatched?: boolean;
  onPrivacyModeToggle?: (enabled: boolean, duration?: number) => void;
  onAcceptCall?: () => void;
  autoAcceptCalls?: boolean;
  sessionId?: string;
  deviceSettings?: DeviceSettings;
}

const ChildPanel = ({
  deviceId = "device-1",
  deviceName = "Sarah's iPhone",
  isBeingWatched = false,
  onPrivacyModeToggle = () => {},
  onAcceptCall = () => {},
  autoAcceptCalls = true,
  sessionId = "",
  deviceSettings,
}: ChildPanelProps) => {
  // Use provided device settings or default values
  const allowPrivacyMode = deviceSettings?.allowPrivacyMode ?? true;
  const allowEndCall = deviceSettings?.allowEndCall ?? true;

  const [privacyMode, setPrivacyMode] = useState(false);
  const [privacyTimeRemaining, setPrivacyTimeRemaining] = useState(0);
  const [lastWatchTime, setLastWatchTime] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Set up local camera stream
  useEffect(() => {
    if (isBeingWatched && !localStream) {
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

          // In a real app, this would be the WebRTC connection
          setLastWatchTime(new Date().toLocaleTimeString());

          // Auto-accept call if enabled
          if (autoAcceptCalls) {
            onAcceptCall();

            // For demo purposes, we'll simulate a remote stream
            // In a real app, this would come from WebRTC
            setTimeout(() => {
              setRemoteStream(stream);
            }, 1000);
          }
        } catch (err) {
          console.error("Error accessing camera/microphone:", err);
        }
      };

      setupLocalStream();
    }

    return () => {
      if (localStream && !isBeingWatched) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        setRemoteStream(null);
      }
    };
  }, [isBeingWatched, autoAcceptCalls, onAcceptCall, localStream]);

  // Connect remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Privacy mode timer
  useEffect(() => {
    let interval: number | null = null;

    if (privacyMode && privacyTimeRemaining > 0) {
      interval = window.setInterval(() => {
        setPrivacyTimeRemaining((prev) => {
          if (prev <= 1) {
            setPrivacyMode(false);
            onPrivacyModeToggle(false);
            clearInterval(interval!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [privacyMode, privacyTimeRemaining, onPrivacyModeToggle]);

  const enablePrivacyMode = (minutes: number) => {
    const seconds = minutes * 60;
    setPrivacyTimeRemaining(seconds);
    setPrivacyMode(true);
    onPrivacyModeToggle(true, minutes);
  };

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

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="bg-blue-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{deviceName}</CardTitle>
          {isBeingWatched ? (
            <Badge className="bg-red-500 animate-pulse">
              <Eye className="h-3 w-3 mr-1" /> Live Call
            </Badge>
          ) : privacyMode ? (
            <Badge
              variant="outline"
              className="border-amber-500 text-amber-500"
            >
              <ShieldAlert className="h-3 w-3 mr-1" /> Privacy Mode
            </Badge>
          ) : (
            <Badge variant="secondary">Ready</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative bg-black aspect-video w-full">
          {isBeingWatched ? (
            <div className="relative w-full h-full">
              {/* Remote video (parent) - MAIN DISPLAY */}
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <p>Waiting for parent's video...</p>
                </div>
              )}

              {/* Local video (child) - picture-in-picture */}
              {localStream && (
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

              {/* Call status indicator */}
              <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-white"></span>
                Live Call
              </div>
            </div>
          ) : privacyMode ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
              <ShieldAlert className="h-12 w-12 mb-2 text-amber-500" />
              <p className="text-lg font-medium">Privacy Mode Active</p>
              <p className="text-sm opacity-80 mt-1">
                Time remaining: {Math.floor(privacyTimeRemaining / 60)}m{" "}
                {privacyTimeRemaining % 60}s
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
              <p className="text-lg">Camera inactive</p>
              <p className="text-sm opacity-70 mt-1">
                Your camera will automatically activate when a parent starts a
                call
              </p>
              {lastWatchTime && (
                <div className="mt-4 flex items-center text-sm opacity-70">
                  <Clock className="h-4 w-4 mr-1" />
                  Last call: {lastWatchTime}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 p-4 bg-gray-50">
        {isBeingWatched ? (
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2">
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
            </div>

            {allowEndCall && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (localStream) {
                    localStream.getTracks().forEach((track) => track.stop());
                    setLocalStream(null);
                    setRemoteStream(null);
                  }
                  onPrivacyModeToggle(false);
                }}
              >
                End Call
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {autoAcceptCalls
                ? "Auto-accept calls enabled"
                : "Manual call acceptance"}
            </p>
            {!isBeingWatched && !privacyMode && allowPrivacyMode && (
              <Button
                variant="outline"
                size="sm"
                className="text-amber-600 border-amber-600 hover:bg-amber-50"
                onClick={() => enablePrivacyMode(30)}
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                Enable Privacy (30m)
              </Button>
            )}
          </div>
        )}

        {privacyMode && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setPrivacyMode(false);
              setPrivacyTimeRemaining(0);
              onPrivacyModeToggle(false);
            }}
          >
            Disable Privacy Mode
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChildPanel;
