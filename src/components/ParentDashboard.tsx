import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Bell, Settings, Info, Plus, RefreshCw, QrCode } from "lucide-react";
import DeviceList from "./DeviceList";
import VideoMonitor from "./VideoMonitor";
import ActivityLog from "./ActivityLog";
import AdminSettings from "./AdminSettings";
import DeviceIdGenerator from "./DeviceIdGenerator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  generateDeviceId,
  getDeviceSettings,
  startSession,
  endSession,
} from "@/lib/deviceSettings";

interface Device {
  id: string;
  name: string;
  status: "online" | "offline" | "privacy";
  lastConnection: string;
}

interface ParentDashboardProps {
  userName?: string;
  devices?: Device[];
}

const ParentDashboard = ({
  userName = "Parent",
  devices = [
    {
      id: "1",
      name: "Sarah's iPhone",
      status: "online",
      lastConnection: "2 minutes ago",
    },
    {
      id: "2",
      name: "Tommy's iPad",
      status: "offline",
      lastConnection: "3 hours ago",
    },
    {
      id: "3",
      name: "Alex's Android",
      status: "privacy",
      lastConnection: "10 minutes ago",
    },
    {
      id: "4",
      name: "Emma's Tablet",
      status: "online",
      lastConnection: "Just now",
    },
  ],
}: ParentDashboardProps) => {
  const [activeTab, setActiveTab] = useState<string>("devices");
  const [showDeviceGenerator, setShowDeviceGenerator] = useState(false);
  const [monitoringDevice, setMonitoringDevice] = useState<Device | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  const handleStartMonitoring = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device && device.status === "online") {
      // Start a new session
      const newSessionId = startSession(deviceId);
      if (newSessionId === false) {
        alert("This device is already being monitored by another user.");
        return;
      }

      setSessionId(newSessionId);
      setMonitoringDevice(device);
      setActiveTab("monitoring");
    }
  };

  const handleConfigureDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setSettingsOpen(true);
  };

  const handleAddDevice = () => {
    setShowDeviceGenerator(true);
  };

  const handleDeviceCreated = (deviceId: string) => {
    // Get the device settings
    const settings = getDeviceSettings(deviceId);

    const newDevice: Device = {
      id: deviceId,
      name: settings.deviceName || `New Device ${devices.length + 1}`,
      status: "offline",
      lastConnection: "Never",
    };

    // In a real app, this would save to a database
    // For demo, we'll just add it to the local state
    devices.push(newDevice);

    // Hide the generator and open settings
    setShowDeviceGenerator(false);
    handleConfigureDevice(deviceId);
  };

  const handleEndSession = () => {
    if (monitoringDevice) {
      endSession(monitoringDevice.id);
    }
    setMonitoringDevice(null);
    setSessionId("");
    setActiveTab("devices");
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <Eye className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Parent Monitor</h1>
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-gray-600 hidden md:block">Welcome, {userName}</p>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="font-medium text-blue-600">
                {userName.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="monitoring" disabled={!monitoringDevice}>
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>

          <TabsContent value="devices" className="mt-0">
            <DeviceList
              devices={devices}
              onStartMonitoring={handleStartMonitoring}
              onConfigureDevice={handleConfigureDevice}
              onRefreshDevices={() => console.log("Refreshing devices")}
              onAddDevice={handleAddDevice}
              showAdminControls={true}
            />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-0">
            {monitoringDevice ? (
              <div className="space-y-6">
                <VideoMonitor
                  deviceId={monitoringDevice.id}
                  deviceName={monitoringDevice.name}
                  isConnected={true}
                  onEndSession={handleEndSession}
                  isTwoWay={true}
                  sessionId={sessionId}
                />

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="font-medium mb-2">Monitoring Information</h3>
                  <p className="text-sm text-gray-600">
                    You are currently monitoring {monitoringDevice.name}. The
                    device owner is notified when monitoring is active.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border p-8">
                <p className="text-gray-500 mb-4">
                  No device is currently being monitored
                </p>
                <Button onClick={() => setActiveTab("devices")}>
                  Select a Device
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </main>

      {/* Admin Settings Dialog */}
      <AdminSettings
        deviceId={selectedDeviceId}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSettingsChanged={(settings) => {
          console.log("Settings updated:", settings);
          // In a real app, this would update the device in the list

          // Update the device name in the list
          const device = devices.find((d) => d.id === settings.deviceId);
          if (device) {
            device.name = settings.deviceName;
          }
        }}
      />

      {/* Device Generator Dialog */}
      {showDeviceGenerator && (
        <Dialog
          open={showDeviceGenerator}
          onOpenChange={setShowDeviceGenerator}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Generate a unique ID for a child's device
              </DialogDescription>
            </DialogHeader>
            <DeviceIdGenerator onDeviceCreated={handleDeviceCreated} />
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 Parent Monitor App. All rights reserved.</p>
          <p className="mt-1">Privacy and security are our top priorities.</p>
        </div>
      </footer>
    </div>
  );
};

// Import for the Eye icon used in the header
const Eye = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default ParentDashboard;
