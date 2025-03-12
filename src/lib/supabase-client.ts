// Use SQLite adapter for local development
import sqliteAdapter from "./sqlite-adapter";

// Import mock functions for development
import {
  generateDeviceId as mockGenerateDeviceId,
  hasActiveSession as mockHasActiveSession,
} from "./deviceSettings.mock";

// Export the SQLite adapter as if it were the Supabase client
export const supabase = sqliteAdapter;

// Authentication functions
export const signUp = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    // Use the SQLite adapter's auth.signUp method
    const result = await sqliteAdapter.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "parent",
        },
      },
    });

    if (result.error) throw result.error;

    // Create user record in our users table
    if (result.data?.user) {
      await sqliteAdapter.from("users").insert({
        id: result.data.user.id,
        email: email,
        password: "HASHED_IN_AUTH", // We don't store actual passwords in our table
        full_name: fullName,
        role: "parent",
        is_verified: false,
      });
    }

    return result.data;
  } catch (error) {
    console.error("Error in signUp:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await sqliteAdapter.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) throw result.error;

    // Update last login time
    if (result.data?.user) {
      await sqliteAdapter
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", result.data.user.id);
    }

    return result.data;
  } catch (error) {
    console.error("Error in signIn:", error);
    throw error;
  }
};

export const signOut = async () => {
  const result = await sqliteAdapter.auth.signOut();
  if (result.error) throw result.error;
  return result;
};

// Admin functions
export const createAdmin = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    // Only existing admins should be able to create new admins
    const adminSession = await sqliteAdapter.auth.getSession();
    if (!adminSession.data.session) throw new Error("Unauthorized");

    const currentUser = await sqliteAdapter
      .from("users")
      .select("role")
      .eq("id", adminSession.data.session.user.id)
      .single();

    if (currentUser.data?.role !== "admin")
      throw new Error("Only admins can create other admins");

    // Create the admin user
    const result = await sqliteAdapter.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "admin",
        },
      },
    });

    if (result.error) throw result.error;

    // Create user record in our users table
    if (result.data?.user) {
      await sqliteAdapter.from("users").insert({
        id: result.data.user.id,
        email: email,
        password: "HASHED_IN_AUTH",
        full_name: fullName,
        role: "admin",
        is_verified: true,
      });
    }

    return result.data;
  } catch (error) {
    console.error("Error in createAdmin:", error);
    throw error;
  }
};

// Device management functions
export const generateDeviceId = async () => {
  try {
    const result = await sqliteAdapter.rpc("generate_device_id");

    if (result.error) throw result.error;
    return result.data;
  } catch (err) {
    console.warn("Using mock device ID generation", err);
    // Fallback to client-side generation
    return mockGenerateDeviceId();
  }
};

export const createDevice = async (userId: string, deviceName: string) => {
  try {
    const deviceId = await generateDeviceId();

    const result = await sqliteAdapter
      .from("devices")
      .insert({
        id: deviceId,
        user_id: userId,
        name: deviceName,
        status: "offline",
        settings: {
          allowPrivacyMode: true,
          allowEndCall: true,
          maxCallDuration: null,
          autoAcceptCalls: true,
          adminLocked: false,
        },
      })
      .select();

    if (result.error) throw result.error;
    return result.data[0];
  } catch (error) {
    console.error("Error in createDevice:", error);
    throw error;
  }
};

export const getDevices = async (userId: string) => {
  try {
    const result = await sqliteAdapter
      .from("devices")
      .select("*")
      .eq("user_id", userId);

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error("Error in getDevices:", error);
    throw error;
  }
};

export const getDeviceSettings = async (deviceId: string) => {
  try {
    const result = await sqliteAdapter
      .from("devices")
      .select("settings")
      .eq("id", deviceId)
      .single();

    if (result.error) throw result.error;
    return result.data.settings;
  } catch (error) {
    console.error("Error in getDeviceSettings:", error);
    throw error;
  }
};

export const updateDeviceSettings = async (deviceId: string, settings: any) => {
  try {
    const result = await sqliteAdapter
      .from("devices")
      .update({ settings })
      .eq("id", deviceId)
      .select();

    if (result.error) throw result.error;
    return result.data[0];
  } catch (error) {
    console.error("Error in updateDeviceSettings:", error);
    throw error;
  }
};

// Session management
export const startSession = async (deviceId: string, parentId: string) => {
  try {
    // Check if device already has an active session
    const existingSessions = await sqliteAdapter
      .from("active_sessions")
      .select("*")
      .eq("device_id", deviceId)
      .is("ended_at", null);

    if (existingSessions.data && existingSessions.data.length > 0) {
      return { error: "Device already has an active session" };
    }

    // Generate a session ID
    const sessionId =
      "session-" +
      Math.random().toString(36).substring(2, 15) +
      "-" +
      Date.now();

    // Create a new session
    const result = await sqliteAdapter
      .from("active_sessions")
      .insert({
        device_id: deviceId,
        session_id: sessionId,
        parent_id: parentId,
      })
      .select();

    if (result.error) throw result.error;

    // Also create an activity log entry
    await sqliteAdapter.from("activity_logs").insert({
      device_id: deviceId,
      parent_id: parentId,
      action: "start_monitoring",
      status: "ongoing",
      started_at: new Date().toISOString(),
    });

    // Update device status
    await sqliteAdapter
      .from("devices")
      .update({
        status: "online",
        last_connection: new Date().toISOString(),
      })
      .eq("id", deviceId);

    return { sessionId: sessionId, session: result.data[0] };
  } catch (error) {
    console.error("Error in startSession:", error);
    throw error;
  }
};

export const endSession = async (deviceId: string, sessionId: string) => {
  try {
    const now = new Date();

    // Find the session
    const session = await sqliteAdapter
      .from("active_sessions")
      .select("*")
      .eq("device_id", deviceId)
      .eq("session_id", sessionId)
      .is("ended_at", null)
      .single();

    if (!session.data) {
      return { error: "Session not found" };
    }

    // Calculate duration
    const startedAt = new Date(session.data.started_at);
    const duration = Math.floor((now.getTime() - startedAt.getTime()) / 1000); // in seconds

    // Update the session
    const result = await sqliteAdapter
      .from("active_sessions")
      .update({
        ended_at: now.toISOString(),
        duration: duration,
      })
      .eq("id", session.data.id)
      .select();

    if (result.error) throw result.error;

    // Update the activity log
    await sqliteAdapter
      .from("activity_logs")
      .update({
        status: "completed",
        ended_at: now.toISOString(),
        duration: duration,
      })
      .eq("device_id", deviceId)
      .eq("parent_id", session.data.parent_id)
      .eq("status", "ongoing");

    return { success: true, session: result.data[0] };
  } catch (error) {
    console.error("Error in endSession:", error);
    throw error;
  }
};

export const hasActiveSession = async (deviceId: string) => {
  try {
    const result = await sqliteAdapter
      .from("active_sessions")
      .select("*")
      .eq("device_id", deviceId)
      .is("ended_at", null);

    if (result.error) throw result.error;
    return result.data && result.data.length > 0;
  } catch (err) {
    console.warn("Using mock session check", err);
    // Fallback to mock implementation
    return mockHasActiveSession(deviceId);
  }
};

// Subscription management
export const getSubscriptionPlans = async () => {
  try {
    const result = await sqliteAdapter
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true);

    if (result.error) throw result.error;
    console.log("Subscription plans from DB:", result.data);
    return result.data || [];
  } catch (err) {
    console.error("Error fetching subscription plans:", err);
    // Return fallback plans if database fetch fails
    return [
      {
        id: "basic-monthly",
        name: "Basic Plan",
        description: "Perfect for monitoring a single child's device",
        price: 9.99,
        currency: "USD",
        billing_cycle: "monthly",
        device_limit: 1,
        is_active: true,
        features: {
          videoQuality: "Standard",
          cloudRecording: false,
          historyRetention: "7 days",
          prioritySupport: false,
        },
      },
      {
        id: "family-monthly",
        name: "Family Plan",
        description: "Monitor multiple devices with enhanced features",
        price: 19.99,
        currency: "USD",
        billing_cycle: "monthly",
        device_limit: 3,
        is_active: true,
        features: {
          videoQuality: "HD",
          cloudRecording: true,
          historyRetention: "14 days",
          prioritySupport: false,
        },
      },
      {
        id: "premium-monthly",
        name: "Premium Plan",
        description: "Unlimited devices with all premium features",
        price: 29.99,
        currency: "USD",
        billing_cycle: "monthly",
        device_limit: 5,
        is_active: true,
        features: {
          videoQuality: "4K",
          cloudRecording: true,
          historyRetention: "30 days",
          prioritySupport: true,
        },
      },
    ];
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const result = await sqliteAdapter
      .from("subscriptions")
      .select("*, plan:plan_id(*)")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    if (result.error) throw result.error;
    return result.data[0];
  } catch (error) {
    console.error("Error in getUserSubscription:", error);
    throw error;
  }
};

export const createSubscription = async (userId: string, planId: string) => {
  try {
    // In a real app, this would integrate with a payment processor
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    const result = await sqliteAdapter
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_id: planId,
        status: "active",
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true,
      })
      .select();

    if (result.error) throw result.error;
    return result.data[0];
  } catch (error) {
    console.error("Error in createSubscription:", error);
    throw error;
  }
};

// Check if user can add more devices based on subscription
export const canAddDevice = async (userId: string) => {
  try {
    // Get user's active subscription
    const subscription = await getUserSubscription(userId);
    if (!subscription)
      return { canAdd: false, reason: "No active subscription" };

    // Get current device count
    const countResult = await sqliteAdapter
      .from("devices")
      .select("id", { count: "exact" })
      .eq("user_id", userId);

    if (countResult.error) throw countResult.error;
    const count = countResult.count || 0;

    // Check if user has reached device limit
    const deviceLimit = subscription.plan.device_limit;
    if (count >= deviceLimit) {
      return {
        canAdd: false,
        reason: `Device limit reached (${count}/${deviceLimit}). Please upgrade your subscription.`,
        currentCount: count,
        limit: deviceLimit,
      };
    }

    return {
      canAdd: true,
      currentCount: count,
      limit: deviceLimit,
    };
  } catch (error) {
    console.error("Error in canAddDevice:", error);
    throw error;
  }
};
