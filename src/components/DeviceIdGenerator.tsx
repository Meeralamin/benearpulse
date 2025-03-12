import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { generateDeviceId, getDeviceSettings } from "@/lib/deviceSettings";
import { Copy, RefreshCw } from "lucide-react";

interface DeviceIdGeneratorProps {
  onDeviceCreated?: (deviceId: string) => void;
}

const DeviceIdGenerator = ({ onDeviceCreated }: DeviceIdGeneratorProps) => {
  const [deviceId, setDeviceId] = useState(generateDeviceId());
  const [deviceName, setDeviceName] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerateId = () => {
    setDeviceId(generateDeviceId());
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deviceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createDevice = () => {
    // Get the device settings to initialize it
    const settings = getDeviceSettings(deviceId);

    // Update the device name if provided
    if (deviceName) {
      settings.deviceName = deviceName;
    }

    if (onDeviceCreated) {
      onDeviceCreated(deviceId);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Generate Device ID</CardTitle>
        <p className="text-sm text-gray-500">
          Create a unique ID for a child device
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="deviceName">Device Name (Optional)</Label>
          <Input
            id="deviceName"
            placeholder="e.g. Sarah's iPhone"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deviceId">Device ID</Label>
          <div className="flex gap-2">
            <Input
              id="deviceId"
              value={deviceId}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={regenerateId}
              title="Generate new ID"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-green-600">Copied to clipboard!</p>
          )}
        </div>

        <div className="bg-blue-50 p-3 rounded-md text-sm">
          <p className="text-blue-700">
            Share this Device ID with the child. They will need it to log in to
            the Child Monitor app.
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={createDevice}>
          Create Device
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceIdGenerator;
