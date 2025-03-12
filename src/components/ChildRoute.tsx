import React, { useState, useEffect } from "react";
import ChildDashboard from "./ChildDashboard";
import { getDeviceSettings, hasActiveSession } from "@/lib/deviceSettings";

const ChildRoute = () => {
  const [deviceId, setDeviceId] = useState<string>("");
  const [deviceSettings, setDeviceSettings] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    // Get deviceId from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get("deviceId");

    if (id) {
      setDeviceId(id);

      // Check if device is already in use
      if (hasActiveSession(id)) {
        setIsAvailable(false);
      } else {
        // Load device settings
        const settings = getDeviceSettings(id);
        setDeviceSettings(settings);
      }
    }
  }, []);

  if (!isAvailable) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Device Unavailable
          </h2>
          <p className="mb-4">
            This device is currently being monitored by another user.
          </p>
          <p className="text-sm text-gray-500">
            Please try again later or contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <ChildDashboard
        deviceName={deviceSettings?.deviceName || "Child Device"}
        deviceId={deviceId}
      />
    </div>
  );
};

export default ChildRoute;
