import sqlite from "./sqlite-client";
// Use simple functions to generate IDs instead of crypto
const generateRandomId = () => Math.random().toString(36).substring(2, 15);
const generateRandomHex = (length: number) =>
  Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

// Device management functions
export const generateDeviceId = (): string => {
  return "DEV-" + generateRandomHex(8).toUpperCase();
};

export const createDevice = async (userId: string, deviceName: string) => {
  try {
    const deviceId = generateDeviceId();

    sqlite.insert("devices", {
      id: deviceId,
      user_id: userId,
      name: deviceName,
      status: "offline",
      settings: JSON.stringify({
        allowPrivacyMode: true,
        allowEndCall: true,
        maxCallDuration: null,
        autoAcceptCalls: true,
        adminLocked: false,
      }),
    });

    return { id: deviceId, name: deviceName, user_id: userId };
  } catch (error) {
    throw error;
  }
};

export const getDevices = async (userId: string) => {
  try {
    const devices = sqlite.query("SELECT * FROM devices WHERE user_id = ?", [
      userId,
    ]);
    return devices.map((device) => ({
      ...device,
      settings: JSON.parse(device.settings || "{}"),
    }));
  } catch (error) {
    throw error;
  }
};

export const getDeviceSettings = async (deviceId: string) => {
  try {
    const device = sqlite.queryOne(
      "SELECT settings FROM devices WHERE id = ?",
      [deviceId],
    );
    if (!device) {
      throw new Error("Device not found");
    }
    return JSON.parse(device.settings || "{}");
  } catch (error) {
    throw error;
  }
};

export const updateDeviceSettings = async (deviceId: string, settings: any) => {
  try {
    const device = sqlite.queryOne("SELECT * FROM devices WHERE id = ?", [
      deviceId,
    ]);
    if (!device) {
      throw new Error("Device not found");
    }

    sqlite.update(
      "devices",
      {
        settings: JSON.stringify(settings),
        updated_at: new Date().toISOString(),
      },
      "id = :id",
      { id: deviceId },
    );

    return { ...device, settings };
  } catch (error) {
    throw error;
  }
};

// Session management
export const startSession = async (deviceId: string, parentId: string) => {
  try {
    // Check if device already has an active session
    const existingSessions = sqlite.query(
      "SELECT * FROM active_sessions WHERE device_id = ? AND ended_at IS NULL",
      [deviceId],
    );

    if (existingSessions.length > 0) {
      return { error: "Device already has an active session" };
    }

    // Generate a session ID
    const sessionId = "session-" + generateRandomHex(16) + "-" + Date.now();
    const id = generateRandomId();

    // Create a new session
    sqlite.insert("active_sessions", {
      id,
      device_id: deviceId,
      parent_id: parentId,
      session_id: sessionId,
      started_at: new Date().toISOString(),
      ended_at: null,
      duration: null,
      settings: "{}",
    });

    // Also create an activity log entry
    sqlite.insert("activity_logs", {
      id: generateRandomId(),
      device_id: deviceId,
      parent_id: parentId,
      action: "start_monitoring",
      status: "ongoing",
      started_at: new Date().toISOString(),
      ended_at: null,
      duration: null,
      details: "{}",
    });

    // Update device status
    sqlite.update(
      "devices",
      {
        status: "online",
        last_connection: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      "id = :id",
      { id: deviceId },
    );

    return {
      sessionId,
      session: {
        id,
        device_id: deviceId,
        parent_id: parentId,
        session_id: sessionId,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const endSession = async (deviceId: string, sessionId: string) => {
  try {
    // Find the session
    const session = sqlite.queryOne(
      "SELECT * FROM active_sessions WHERE device_id = ? AND session_id = ? AND ended_at IS NULL",
      [deviceId, sessionId],
    );

    if (!session) {
      return { error: "Session not found" };
    }

    const now = new Date();
    const startedAt = new Date(session.started_at);
    const duration = Math.floor((now.getTime() - startedAt.getTime()) / 1000); // in seconds

    // Update the session
    sqlite.update(
      "active_sessions",
      {
        ended_at: now.toISOString(),
        duration: duration,
      },
      "id = :id",
      { id: session.id },
    );

    // Update the activity log
    sqlite.update(
      "activity_logs",
      {
        status: "completed",
        ended_at: now.toISOString(),
        duration: duration,
      },
      "device_id = :deviceId AND parent_id = :parentId AND status = :status",
      {
        deviceId: deviceId,
        parentId: session.parent_id,
        status: "ongoing",
      },
    );

    return {
      success: true,
      session: { ...session, ended_at: now.toISOString(), duration },
    };
  } catch (error) {
    throw error;
  }
};

export const hasActiveSession = async (deviceId: string) => {
  try {
    const activeSessions = sqlite.query(
      "SELECT COUNT(*) as count FROM active_sessions WHERE device_id = ? AND ended_at IS NULL",
      [deviceId],
    );
    return activeSessions[0].count > 0;
  } catch (error) {
    throw error;
  }
};
