// Device settings and configuration management

export interface DeviceSettings {
  deviceId: string;
  deviceName: string;
  allowPrivacyMode: boolean;
  allowEndCall: boolean;
  maxCallDuration: number | null; // null means unlimited
  autoAcceptCalls: boolean;
  adminLocked: boolean;
}

// Default settings for all devices
const defaultSettings: DeviceSettings = {
  deviceId: "",
  deviceName: "",
  allowPrivacyMode: true,
  allowEndCall: true,
  maxCallDuration: null, // unlimited
  autoAcceptCalls: true,
  adminLocked: false,
};

// In-memory store of device settings
// In a real app, this would be stored in a database
const deviceSettingsStore: Record<string, DeviceSettings> = {};

// Active sessions tracking
// Maps deviceId to sessionId
const activeSessions: Record<string, string> = {};

/**
 * Generate a unique device ID
 */
export function generateDeviceId(): string {
  return "device-" + Math.random().toString(36).substring(2, 9);
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
      ...defaultSettings,
      deviceId,
      deviceName: `Device ${Object.keys(deviceSettingsStore).length + 1}`,
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
