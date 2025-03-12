// Mock implementation of device settings for development without Supabase
import { DeviceSettings } from "./deviceSettings";

// In-memory store of device settings
const deviceSettingsStore: Record<string, DeviceSettings> = {};

// Active sessions tracking
const activeSessions: Record<string, string> = {};

/**
 * Generate a unique device ID
 */
export function generateDeviceId(): string {
  return "DEV-" + Math.random().toString(36).substring(2, 9).toUpperCase();
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return (
    "session-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now()
  );
}

/**
 * Get settings for a specific device
 */
export function getDeviceSettings(deviceId: string): DeviceSettings {
  if (!deviceSettingsStore[deviceId]) {
    // Create default settings for this device
    deviceSettingsStore[deviceId] = {
      deviceId,
      deviceName: `Device ${Object.keys(deviceSettingsStore).length + 1}`,
      allowPrivacyMode: true,
      allowEndCall: true,
      maxCallDuration: null,
      autoAcceptCalls: true,
      adminLocked: false,
    };
  }

  return deviceSettingsStore[deviceId];
}

/**
 * Update settings for a specific device
 */
export function updateDeviceSettings(
  deviceId: string,
  settings: Partial<DeviceSettings>,
): DeviceSettings {
  const currentSettings = getDeviceSettings(deviceId);
  deviceSettingsStore[deviceId] = {
    ...currentSettings,
    ...settings,
  };

  return deviceSettingsStore[deviceId];
}

/**
 * Check if a device has an active session
 */
export function hasActiveSession(deviceId: string): boolean {
  return !!activeSessions[deviceId];
}

/**
 * Start a new session for a device
 * Returns false if device already has an active session
 */
export function startSession(deviceId: string): string | false {
  if (hasActiveSession(deviceId)) {
    return false; // Device already has an active session
  }

  const sessionId = generateSessionId();
  activeSessions[deviceId] = sessionId;
  return sessionId;
}

/**
 * End a session for a device
 */
export function endSession(deviceId: string): boolean {
  if (!hasActiveSession(deviceId)) {
    return false; // No active session to end
  }

  delete activeSessions[deviceId];
  return true;
}

/**
 * Validate a session for a device
 */
export function validateSession(deviceId: string, sessionId: string): boolean {
  return activeSessions[deviceId] === sessionId;
}
