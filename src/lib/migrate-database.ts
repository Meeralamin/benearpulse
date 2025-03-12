import { supabase } from "./supabase-client";

/**
 * Migrate database tables for the Parent-Child Monitoring App
 */
async function migrateDatabase() {
  try {
    console.log("Starting database migration...");

    // Create users table
    const { error: usersError } = await supabase.rpc("create_users_table");
    if (usersError) throw usersError;
    console.log("Users table created or already exists");

    // Create subscription_plans table
    const { error: plansError } = await supabase.rpc(
      "create_subscription_plans_table",
    );
    if (plansError) throw plansError;
    console.log("Subscription plans table created or already exists");

    // Create subscriptions table
    const { error: subsError } = await supabase.rpc(
      "create_subscriptions_table",
    );
    if (subsError) throw subsError;
    console.log("Subscriptions table created or already exists");

    // Create devices table
    const { error: devicesError } = await supabase.rpc("create_devices_table");
    if (devicesError) throw devicesError;
    console.log("Devices table created or already exists");

    // Create active_sessions table
    const { error: sessionsError } = await supabase.rpc(
      "create_active_sessions_table",
    );
    if (sessionsError) throw sessionsError;
    console.log("Active sessions table created or already exists");

    // Create activity_logs table
    const { error: logsError } = await supabase.rpc(
      "create_activity_logs_table",
    );
    if (logsError) throw logsError;
    console.log("Activity logs table created or already exists");

    // Insert default subscription plans if they don't exist
    const { error: insertPlansError } = await supabase.rpc(
      "insert_default_plans",
    );
    if (insertPlansError) throw insertPlansError;
    console.log("Default subscription plans inserted or already exist");

    // Create admin user if it doesn't exist
    const { error: adminError } = await supabase.rpc("create_admin_user");
    if (adminError) throw adminError;
    console.log("Admin user created or already exists");

    console.log("Database migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Database migration failed:", error);
    return { success: false, error };
  }
}

export default migrateDatabase;
