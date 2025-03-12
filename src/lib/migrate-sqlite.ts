import sqlite from "./sqlite-client";

/**
 * Migrate database tables for the Parent-Child Monitoring App using SQLite
 */
async function migrateSqliteDatabase() {
  try {
    console.log("Starting SQLite database migration...");

    // Create tables
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT,
        role TEXT NOT NULL,
        is_verified BOOLEAN NOT NULL DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscription_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        billing_cycle TEXT NOT NULL,
        device_limit INTEGER NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        features TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        status TEXT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        auto_renew BOOLEAN NOT NULL DEFAULT 1,
        payment_method TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'offline',
        settings TEXT,
        last_connection TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS active_sessions (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        parent_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        duration INTEGER,
        settings TEXT
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        parent_id TEXT NOT NULL,
        action TEXT NOT NULL,
        status TEXT NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        duration INTEGER,
        details TEXT
      );
    `);

    // Insert default subscription plans if they don't exist
    const existingPlans = sqlite.query(
      "SELECT COUNT(*) as count FROM subscription_plans",
    );
    if (existingPlans[0].count === 0) {
      console.log("Creating subscription plans...");

      // Insert basic plan
      sqlite.insert("subscription_plans", {
        id: "basic-monthly",
        name: "Basic Plan",
        description: "Perfect for monitoring a single child's device",
        price: 9.99,
        currency: "USD",
        billing_cycle: "monthly",
        device_limit: 1,
        is_active: 1,
        features: JSON.stringify({
          videoQuality: "Standard",
          cloudRecording: false,
          historyRetention: "7 days",
          prioritySupport: false,
        }),
      });

      // Insert family plan
      sqlite.insert("subscription_plans", {
        id: "family-monthly",
        name: "Family Plan",
        description: "Monitor multiple devices with enhanced features",
        price: 19.99,
        currency: "USD",
        billing_cycle: "monthly",
        device_limit: 3,
        is_active: 1,
        features: JSON.stringify({
          videoQuality: "HD",
          cloudRecording: true,
          historyRetention: "14 days",
          prioritySupport: false,
        }),
      });

      // Insert premium plan
      sqlite.insert("subscription_plans", {
        id: "premium-monthly",
        name: "Premium Plan",
        description: "Unlimited devices with all premium features",
        price: 29.99,
        currency: "USD",
        billing_cycle: "monthly",
        device_limit: 5,
        is_active: 1,
        features: JSON.stringify({
          videoQuality: "4K",
          cloudRecording: true,
          historyRetention: "30 days",
          prioritySupport: true,
        }),
      });
    }

    // Create admin user if it doesn't exist
    const adminExists = sqlite.query(
      "SELECT COUNT(*) as count FROM users WHERE role = ?",
      ["admin"],
    );
    if (adminExists[0].count === 0) {
      console.log("Creating admin user...");

      // Generate a random ID for the admin user
      const adminId = Math.random().toString(36).substring(2, 15);

      // Insert admin user
      sqlite.insert("users", {
        id: adminId,
        email: "admin@parentconnect.com",
        password: "Admin123!", // In a real app, this would be hashed
        full_name: "System Administrator",
        role: "admin",
        is_verified: 1,
        status: "active",
      });
    }

    console.log("SQLite database migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("SQLite database migration failed:", error);
    return { success: false, error };
  }
}

export default migrateSqliteDatabase;
