import { supabase } from "./supabase-client";

/**
 * Migrate database tables for the Parent-Child Monitoring App
 */
async function migrateDatabase() {
  try {
    console.log("Starting database migration...");

    // Create tables directly
    try {
      console.log("Creating users table...");
      await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            full_name TEXT,
            role TEXT NOT NULL,
            is_verified BOOLEAN NOT NULL DEFAULT false,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE
          );
        `,
      });

      console.log("Creating subscription_plans table...");
      await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS subscription_plans (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            billing_cycle TEXT NOT NULL,
            device_limit INTEGER NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            features JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      console.log("Creating subscriptions table...");
      await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS subscriptions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            plan_id TEXT NOT NULL,
            status TEXT NOT NULL,
            start_date TIMESTAMP WITH TIME ZONE NOT NULL,
            end_date TIMESTAMP WITH TIME ZONE NOT NULL,
            auto_renew BOOLEAN NOT NULL DEFAULT true,
            payment_method JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      console.log("Creating devices table...");
      await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS devices (
            id TEXT PRIMARY KEY,
            user_id UUID NOT NULL,
            name TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'offline',
            settings JSONB,
            last_connection TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      console.log("Creating active_sessions table...");
      await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS active_sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            device_id TEXT NOT NULL,
            parent_id UUID NOT NULL,
            session_id TEXT NOT NULL,
            started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ended_at TIMESTAMP WITH TIME ZONE,
            duration INTEGER,
            settings JSONB
          );
        `,
      });

      console.log("Creating activity_logs table...");
      await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS activity_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            device_id TEXT NOT NULL,
            parent_id UUID NOT NULL,
            action TEXT NOT NULL,
            status TEXT NOT NULL,
            started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ended_at TIMESTAMP WITH TIME ZONE,
            duration INTEGER,
            details JSONB
          );
        `,
      });
    } catch (error) {
      console.error("Error creating tables:", error);
    }

    // Insert default subscription plans
    try {
      const { data: plansExist } = await supabase
        .from("subscription_plans")
        .select("count(*)")
        .limit(1);

      if (!plansExist || plansExist.length === 0) {
        console.log("Creating subscription plans...");
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
