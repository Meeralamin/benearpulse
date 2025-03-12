import { supabase } from "./supabase-client";

/**
 * Migrate database tables for the Parent-Child Monitoring App
 */
async function migrateDatabase() {
  try {
    console.log("Starting database migration...");

    // Create subscription_plans table
    try {
      const { data: plansExist } = await supabase
        .from("subscription_plans")
        .select("count(*)")
        .limit(1);

      if (!plansExist || plansExist.length === 0) {
        console.log("Creating subscription plans table...");
        await supabase.from("subscription_plans").insert([
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
        ]);
      }
    } catch (error) {
      console.error("Error creating subscription plans:", error);
    }

    // Create admin user if it doesn't exist
    try {
      const { data: adminExists } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin")
        .limit(1);

      if (!adminExists || adminExists.length === 0) {
        console.log("Creating admin user...");
        // Create admin user in auth
        const { data: authUser, error: authError } = await supabase.auth.signUp(
          {
            email: "admin@parentconnect.com",
            password: "Admin123!",
            options: {
              data: {
                full_name: "System Administrator",
                role: "admin",
              },
            },
          },
        );

        if (authError) throw authError;

        if (authUser && authUser.user) {
          // Insert into users table
          await supabase.from("users").insert({
            id: authUser.user.id,
            email: "admin@parentconnect.com",
            password: "HASHED_IN_AUTH",
            full_name: "System Administrator",
            role: "admin",
            is_verified: true,
            status: "active",
          });
        }
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }

    console.log("Database migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Database migration failed:", error);
    return { success: false, error };
  }
}

export default migrateDatabase;
