import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  DeviceSettings,
  getDeviceSettings,
  updateDeviceSettings,
} from "@/lib/deviceSettings";

interface AdminSettingsProps {
  deviceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsChanged?: (settings: DeviceSettings) => void;
}

const AdminSettings = ({
  deviceId,
  open,
  onOpenChange,
  onSettingsChanged,
}: AdminSettingsProps) => {
  const [settings, setSettings] = useState<DeviceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && deviceId) {
      // Load device settings
      const deviceSettings = getDeviceSettings(deviceId);
      setSettings(deviceSettings);
      setLoading(false);
    }
  }, [deviceId, open]);

  const handleSave = () => {
    if (settings) {
      const updatedSettings = updateDeviceSettings(deviceId, settings);
      if (onSettingsChanged) {
        onSettingsChanged(updatedSettings);
      }
      onOpenChange(false);
    }
  };

  const handleChange = (key: keyof DeviceSettings, value: any) => {
    if (settings) {
      setSettings({
        ...settings,
        [key]: value,
      });
    }
  };

  if (loading || !settings) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Device Settings</DialogTitle>
          <DialogDescription>
            Configure settings for {settings.deviceName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deviceName" className="text-right">
              Device Name
            </Label>
            <Input
              id="deviceName"
              value={settings.deviceName}
              onChange={(e) => handleChange("deviceName", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deviceId" className="text-right">
              Device ID
            </Label>
            <Input
              id="deviceId"
              value={settings.deviceId}
              readOnly
              className="col-span-3 bg-muted"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Allow Privacy Mode</Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                checked={settings.allowPrivacyMode}
                onCheckedChange={(checked) =>
                  handleChange("allowPrivacyMode", checked)
                }
              />
              <span className="text-sm text-muted-foreground">
                {settings.allowPrivacyMode
                  ? "Child can enable privacy mode"
                  : "Privacy mode disabled"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Allow End Call</Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                checked={settings.allowEndCall}
                onCheckedChange={(checked) =>
                  handleChange("allowEndCall", checked)
                }
              />
              <span className="text-sm text-muted-foreground">
                {settings.allowEndCall
                  ? "Child can end calls"
                  : "Only parent can end calls"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Auto-Accept Calls</Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                checked={settings.autoAcceptCalls}
                onCheckedChange={(checked) =>
                  handleChange("autoAcceptCalls", checked)
                }
              />
              <span className="text-sm text-muted-foreground">
                {settings.autoAcceptCalls
                  ? "Calls are automatically accepted"
                  : "Child must manually accept calls"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Admin Lock</Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                checked={settings.adminLocked}
                onCheckedChange={(checked) =>
                  handleChange("adminLocked", checked)
                }
              />
              <span className="text-sm text-muted-foreground">
                {settings.adminLocked
                  ? "Settings locked by admin"
                  : "Settings can be changed"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxCallDuration" className="text-right">
              Max Call Duration
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="maxCallDuration"
                type="number"
                min="0"
                value={settings.maxCallDuration || ""}
                placeholder="Unlimited"
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? null : parseInt(e.target.value);
                  handleChange("maxCallDuration", value);
                }}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                minutes (empty = unlimited)
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettings;
