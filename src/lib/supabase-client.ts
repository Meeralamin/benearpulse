import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Use provided Supabase credentials
const supabaseUrl = "https://pahbrjjdhumqcpmnqyxw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaGJyampkaHVtcWNwbW5xeXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3Njk2NTMsImV4cCI6MjA1NzM0NTY1M30.MDJN8CdNNueoOcgVTin0ay6u0rwcjrDRrpsTcJlRyQc";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (
  email: string,
  password: string,
  fullName: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "parent",
      },
    },
  });

  if (error) throw error;

  // Create user record in our users table
  if (data.user) {
    await supabase.from("users").insert({
      id: data.user.id,
      email: email,
      password: "HASHED_IN_AUTH", // We don't store actual passwords in our table
      full_name: fullName,
      role: "parent",
      is_verified: false,
    });
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Update last login time
  if (data.user) {
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.user.id);
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Admin functions
export const createAdmin = async (
  email: string,
  password: string,
  fullName: string,
) => {
  // Only existing admins should be able to create new admins
  const { data: adminSession } = await supabase.auth.getSession();
  if (!adminSession.session) throw new Error("Unauthorized");

  const { data: currentUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", adminSession.session.user.id)
    .single();

  if (currentUser?.role !== "admin")
    throw new Error("Only admins can create other admins");

  // Create the admin user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "admin",
      },
    },
  });

  if (error) throw error;

  // Create user record in our users table
  if (data.user) {
    await supabase.from("users").insert({
      id: data.user.id,
      email: email,
      password: "HASHED_IN_AUTH",
      full_name: fullName,
      role: "admin",
      is_verified: true,
    });
  }

  return data;
};

// Import mock functions for development
import { generateDeviceId as mockGenerateDeviceId } from "./deviceSettings.mock";

// Device management functions
export const generateDeviceId = async () => {
  try {
    const { data, error } = await supabase.rpc("generate_device_id");

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Using mock device ID generation", err);
    // Fallback to client-side generation
    return mockGenerateDeviceId();
  }
};

export const createDevice = async (userId: string, deviceName: string) => {
  const deviceId = await generateDeviceId();

  const { data, error } = await supabase
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

  if (error) throw error;
  return data[0];
};

export const getDevices = async (userId: string) => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const getDeviceSettings = async (deviceId: string) => {
  const { data, error } = await supabase
    .from("devices")
    .select("settings")
    .eq("id", deviceId)
    .single();

  if (error) throw error;
  return data.settings;
};

export const updateDeviceSettings = async (deviceId: string, settings: any) => {
  const { data, error } = await supabase
    .from("devices")
    .update({ settings })
    .eq("id", deviceId)
    .select();

  if (error) throw error;
  return data[0];
};

// Session management
export const startSession = async (deviceId: string, parentId: string) => {
  // Check if device already has an active session
  const { data: existingSessions } = await supabase
    .from("active_sessions")
    .select("*")
    .eq("device_id", deviceId)
    .is("ended_at", null);

  if (existingSessions && existingSessions.length > 0) {
    return { error: "Device already has an active session" };
  }

  // Generate a session ID
  const sessionId =
    "session-" + Math.random().toString(36).substring(2, 15) + "-" + Date.now();

  // Create a new session
  const { data, error } = await supabase
    .from("active_sessions")
    .insert({
      device_id: deviceId,
      session_id: sessionId,
      parent_id: parentId,
    })
    .select();

  if (error) throw error;

  // Also create an activity log entry
  await supabase.from("activity_logs").insert({
    device_id: deviceId,
    parent_id: parentId,
    action: "start_monitoring",
    status: "ongoing",
    started_at: new Date().toISOString(),
  });

  // Update device status
  await supabase
    .from("devices")
    .update({
      status: "online",
      last_connection: new Date().toISOString(),
    })
    .eq("id", deviceId);

  return { sessionId: sessionId, session: data[0] };
};

export const endSession = async (deviceId: string, sessionId: string) => {
  const now = new Date();

  // Find the session
  const { data: session } = await supabase
    .from("active_sessions")
    .select("*")
    .eq("device_id", deviceId)
    .eq("session_id", sessionId)
    .is("ended_at", null)
    .single();

  if (!session) {
    return { error: "Session not found" };
  }

  // Calculate duration
  const startedAt = new Date(session.started_at);
  const duration = Math.floor((now.getTime() - startedAt.getTime()) / 1000); // in seconds

  // Update the session
  const { data, error } = await supabase
    .from("active_sessions")
    .update({
      ended_at: now.toISOString(),
      duration: duration,
    })
    .eq("id", session.id)
    .select();

  if (error) throw error;

  // Update the activity log
  await supabase
    .from("activity_logs")
    .update({
      status: "completed",
      ended_at: now.toISOString(),
      duration: duration,
    })
    .eq("device_id", deviceId)
    .eq("parent_id", session.parent_id)
    .eq("status", "ongoing");

  return { success: true, session: data[0] };
};

// Import mock functions
import { hasActiveSession as mockHasActiveSession } from "./deviceSettings.mock";

export const hasActiveSession = async (deviceId: string) => {
  try {
    const { data, error } = await supabase
      .from("active_sessions")
      .select("*")
      .eq("device_id", deviceId)
      .is("ended_at", null);

    if (error) throw error;
    return data && data.length > 0;
  } catch (err) {
    console.warn("Using mock session check", err);
    // Fallback to mock implementation
    return mockHasActiveSession(deviceId);
  }
};

// Subscription management
export const getSubscriptionPlans = async () => {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;
  return data;
};

export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plan:plan_id(*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0];
};

export const createSubscription = async (userId: string, planId: string) => {
  // In a real app, this would integrate with a payment processor
  const now = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

  const { data, error } = await supabase
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

  if (error) throw error;
  return data[0];
};

// Check if user can add more devices based on subscription
export const canAddDevice = async (userId: string) => {
  // Get user's active subscription
  const subscription = await getUserSubscription(userId);
  if (!subscription) return { canAdd: false, reason: "No active subscription" };

  // Get current device count
  const { count, error } = await supabase
    .from("devices")
    .select("id", { count: "exact" })
    .eq("user_id", userId);

  if (error) throw error;

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
};
