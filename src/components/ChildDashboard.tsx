import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Bell, Settings, Info, Shield } from "lucide-react";
import ChildPanel from "./ChildPanel";
import ActivityLog from "./ActivityLog";

import { DeviceSettings, getDeviceSettings } from "@/lib/deviceSettings";

interface ChildDashboardProps {
  userName?: string;
  deviceName?: string;
  deviceId?: string;
}

const ChildDashboard = ({
  userName = "Child",
  deviceName = "Sarah's iPhone",
  deviceId = "",
}: ChildDashboardProps) => {
  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings | null>(
    null,
  );

  // Load device settings
  useEffect(() => {
    if (deviceId) {
      const settings = getDeviceSettings(deviceId);
      setDeviceSettings(settings);
    }
  }, [deviceId]);
  const [activeTab, setActiveTab] = useState<string>("status");
  const [isBeingWatched, setIsBeingWatched] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  // Simulate incoming monitoring requests for demo
  useEffect(() => {
    // In a real app, this would be triggered by WebRTC signaling
    const simulateIncomingCall = () => {
      if (!privacyMode) {
        setIsBeingWatched(true);

        // No auto-end timer - calls are unlimited duration
      }
    };

    // For demo purposes only - remove in real app
    const demoTimer = setTimeout(simulateIncomingCall, 10000); // 10 seconds after load

    return () => clearTimeout(demoTimer);
  }, [privacyMode]);

  const handlePrivacyModeToggle = (enabled: boolean) => {
    setPrivacyMode(enabled);
    if (enabled && isBeingWatched) {
      setIsBeingWatched(false);
    }
  };

  const handleAcceptCall = () => {
    console.log("Call accepted automatically");
    // In a real app, this would handle WebRTC connection setup
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Child Monitor</h1>
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-gray-600 hidden md:block">Hello, {userName}</p>
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
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>

          <TabsContent value="status" className="mt-0">
            <div className="space-y-6">
              <ChildPanel
                deviceId={deviceId}
                deviceName={deviceName}
                isBeingWatched={isBeingWatched}
                onPrivacyModeToggle={handlePrivacyModeToggle}
                onAcceptCall={handleAcceptCall}
                autoAcceptCalls={deviceSettings?.autoAcceptCalls ?? true}
                deviceSettings={deviceSettings}
              />

              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-medium mb-2">How It Works</h3>
                <p className="text-sm text-gray-600">
                  Your parent can monitor your device at any time. When
                  monitoring begins, you'll see a clear notification. Privacy
                  mode allows you to temporarily disable monitoring for up to 30
                  minutes.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <ActivityLog
              title="Monitoring History"
              entries={[
                {
                  id: "1",
                  deviceName: "Mom's Phone",
                  timestamp: "Today, 3:45 PM",
                  duration: "5m 23s",
                  status: "completed",
                },
                {
                  id: "2",
                  deviceName: "Dad's Phone",
                  timestamp: "Today, 1:12 PM",
                  duration: "2m 10s",
                  status: "interrupted",
                },
                {
                  id: "3",
                  deviceName: "Mom's Phone",
                  timestamp: "Yesterday, 7:30 PM",
                  duration: "8m 45s",
                  status: "completed",
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 Parent Monitor App. All rights reserved.</p>
          <p className="mt-1">Your privacy and safety are important to us.</p>
        </div>
      </footer>
    </div>
  );
};

export default ChildDashboard;
