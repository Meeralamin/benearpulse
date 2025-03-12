import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Video, Clock, Wifi, WifiOff, Eye, Settings } from "lucide-react";

import {
  DeviceSettings,
  generateDeviceId,
  hasActiveSession,
} from "@/lib/deviceSettings";

interface Device {
  id: string;
  name: string;
  status: "online" | "offline" | "privacy";
  lastConnection: string;
  settings?: DeviceSettings;
}

interface DeviceListProps {
  devices?: Device[];
  onStartMonitoring?: (deviceId: string) => void;
}

const DeviceList = ({
  devices = [
    {
      id: generateDeviceId(),
      name: "Sarah's iPhone",
      status: "online",
      lastConnection: "2 minutes ago",
    },
    {
      id: generateDeviceId(),
      name: "Tommy's iPad",
      status: "offline",
      lastConnection: "3 hours ago",
    },
    {
      id: generateDeviceId(),
      name: "Alex's Android",
      status: "privacy",
      lastConnection: "10 minutes ago",
    },
    {
      id: generateDeviceId(),
      name: "Emma's Tablet",
      status: "online",
      lastConnection: "Just now",
    },
  ],
  onConfigureDevice = (deviceId: string) =>
    console.log(`Configure device ${deviceId}`),
  onRefreshDevices = () => console.log("Refreshing devices"),
  onAddDevice = () => console.log("Adding new device"),
  onRemoveDevice = (deviceId: string) =>
    console.log(`Remove device ${deviceId}`),
  onViewDeviceHistory = (deviceId: string) =>
    console.log(`View history for device ${deviceId}`),
  showAdminControls = true,
  onStartMonitoring = (deviceId) => {
    console.log(`Start monitoring device ${deviceId}`);
    // For demo purposes, we'll just open the child route
    // In a real app with Supabase, we would check for active sessions
    window.open(`/child/dashboard?deviceId=${deviceId}`, "_blank");
  },
}: DeviceListProps) => {
  const getStatusIcon = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case "privacy":
        return <Eye className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500">
            Online
          </Badge>
        );
      case "offline":
        return (
          <Badge variant="secondary" className="bg-gray-300">
            Offline
          </Badge>
        );
      case "privacy":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Privacy Mode
          </Badge>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Connected Devices</h2>
          <p className="text-gray-500">
            Monitor your child's devices in real-time
          </p>
        </div>
        {showAdminControls && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefreshDevices()}
            >
              Refresh
            </Button>
            <Button size="sm" onClick={() => onAddDevice()}>
              Add Device
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => (
          <Card key={device.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{device.name}</CardTitle>
                {getStatusBadge(device.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                {getStatusIcon(device.status)}
                <span>
                  Status:{" "}
                  {device.status.charAt(0).toUpperCase() +
                    device.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last active: {device.lastConnection}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t p-3">
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1"
                  onClick={() => onStartMonitoring(device.id)}
                  disabled={
                    device.status !== "online" || hasActiveSession(device.id)
                  }
                >
                  <Video className="mr-2 h-4 w-4" />
                  {hasActiveSession(device.id) ? "In Use" : "Start Call"}
                </Button>

                {showAdminControls && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onConfigureDevice(device.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
