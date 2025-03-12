import { supabase } from "./supabase-client";

/**
 * Migrate subscription plans to the database
 */
async function migratePricingPlans() {
  try {
    console.log("Starting pricing plans migration...");

    // Check if subscription_plans table exists
    const { data: tableExists } = await supabase
      .from("subscription_plans")
      .select("count(*)")
      .limit(1)
      .catch(() => ({ data: null }));

    // If table doesn't exist, create it
    if (!tableExists) {
      const { error: createTableError } = await supabase.rpc(
        "create_subscription_plans_table",
      );
      if (createTableError) throw createTableError;
      console.log("Subscription plans table created");
    }

    // Define the pricing plans
    const plans = [
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
        id: "basic-yearly",
        name: "Basic Plan",
        description: "Perfect for monitoring a single child's device",
        price: 99.99,
        currency: "USD",
        billing_cycle: "yearly",
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
        id: "family-yearly",
        name: "Family Plan",
        description: "Monitor multiple devices with enhanced features",
        price: 199.99,
        currency: "USD",
        billing_cycle: "yearly",
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
      {
        id: "premium-yearly",
        name: "Premium Plan",
        description: "Unlimited devices with all premium features",
        price: 299.99,
        currency: "USD",
        billing_cycle: "yearly",
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

    // Insert plans one by one to handle conflicts
    for (const plan of plans) {
      const { error: insertError } = await supabase
        .from("subscription_plans")
        .upsert(plan, { onConflict: "id" });

      if (insertError) {
        console.error(`Error inserting plan ${plan.id}:`, insertError);
      } else {
        console.log(`Plan ${plan.id} inserted or updated successfully`);
      }
    }

    console.log("Pricing plans migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Pricing plans migration failed:", error);
    return { success: false, error };
  }
}

export default migratePricingPlans;
