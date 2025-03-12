import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Shield } from "lucide-react";
import { hasActiveSession } from "@/lib/deviceSettings";

const ChildLogin = () => {
  const [deviceId, setDeviceId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceId.trim()) {
      setError("Please enter your Device ID");
      return;
    }

    // Check if device is already in use
    if (hasActiveSession(deviceId)) {
      setError("This device is currently being monitored by another user.");
      return;
    }

    // Navigate to child dashboard with the device ID
    navigate(`/child/dashboard?deviceId=${deviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-600 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Child Monitor</CardTitle>
          <p className="text-gray-500 mt-2">Enter your Device ID to continue</p>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceId">Device ID</Label>
              <Input
                id="deviceId"
                placeholder="Enter your Device ID"
                value={deviceId}
                onChange={(e) => {
                  setDeviceId(e.target.value);
                  setError("");
                }}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              <p>Your Device ID was provided by your parent or guardian.</p>
              <p className="mt-1">
                If you don't know your Device ID, please ask them.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ChildLogin;
