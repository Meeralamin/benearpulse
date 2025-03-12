import sqlite from "./sqlite-client";
// Use a simple function to generate IDs instead of crypto
const generateId = () => Math.random().toString(36).substring(2, 15);

// Subscription management functions
export const getSubscriptionPlans = async () => {
  try {
    const plans = sqlite.query(
      "SELECT * FROM subscription_plans WHERE is_active = 1",
    );
    return plans.map((plan) => ({
      ...plan,
      features: JSON.parse(plan.features || "{}"),
    }));
  } catch (error) {
    throw error;
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const subscription = sqlite.queryOne(
      `SELECT s.*, p.* FROM subscriptions s 
       JOIN subscription_plans p ON s.plan_id = p.id 
       WHERE s.user_id = ? AND s.status = 'active' 
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId],
    );

    if (!subscription) return null;

    return {
      ...subscription,
      plan: {
        ...subscription,
        features: JSON.parse(subscription.features || "{}"),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const createSubscription = async (userId: string, planId: string) => {
  try {
    // In a real app, this would integrate with a payment processor
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    const subscriptionId = generateId();

    sqlite.insert("subscriptions", {
      id: subscriptionId,
      user_id: userId,
      plan_id: planId,
      status: "active",
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      auto_renew: 1,
      payment_method: "{}",
    });

    const subscription = sqlite.queryOne(
      "SELECT * FROM subscriptions WHERE id = ?",
      [subscriptionId],
    );
    return subscription;
  } catch (error) {
    throw error;
  }
};

// Check if user can add more devices based on subscription
export const canAddDevice = async (userId: string) => {
  try {
    // Get user's active subscription
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      return {
        canAdd: false,
        reason: "No active subscription",
        currentCount: 0,
        limit: 0,
      };
    }

    // Get current device count
    const devices = sqlite.query(
      "SELECT COUNT(*) as count FROM devices WHERE user_id = ?",
      [userId],
    );
    const count = devices[0].count;

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
    throw error;
  }
};
