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
