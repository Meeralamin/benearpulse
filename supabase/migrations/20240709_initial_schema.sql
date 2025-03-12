-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to create users table
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Hashed password
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'parent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    reset_password_token TEXT,
    reset_password_expires TIMESTAMP WITH TIME ZONE
  );
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create function to create subscription_plans table
CREATE OR REPLACE FUNCTION create_subscription_plans_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    device_limit INTEGER NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create function to create subscriptions table
CREATE OR REPLACE FUNCTION create_subscriptions_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    canceled_at TIMESTAMP WITH TIME ZONE
  );
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create function to create devices table
CREATE OR REPLACE FUNCTION create_devices_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY, -- Custom device ID (min 10 chars)
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'privacy')),
    settings JSONB NOT NULL DEFAULT '{"allowPrivacyMode": true, "allowEndCall": true, "maxCallDuration": null, "autoAcceptCalls": true, "adminLocked": false}',
    last_connection TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create function to create active_sessions table
CREATE OR REPLACE FUNCTION create_active_sessions_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS active_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    parent_id UUID NOT NULL REFERENCES users(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER -- in seconds
  );
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create function to create activity_logs table
CREATE OR REPLACE FUNCTION create_activity_logs_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'interrupted', 'ongoing')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in seconds
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique device IDs
CREATE OR REPLACE FUNCTION generate_device_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'DEV-';
  i INTEGER := 0;
  random_index INTEGER;
BEGIN
  -- Generate a 10 character random string
  WHILE i < 10 LOOP
    random_index := floor(random() * length(chars) + 1);
    result := result || substr(chars, random_index, 1);
    i := i + 1;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to insert default subscription plans
CREATE OR REPLACE FUNCTION insert_default_plans()
RETURNS void AS $$
BEGIN
  -- Only insert if no plans exist
  IF NOT EXISTS (SELECT 1 FROM subscription_plans LIMIT 1) THEN
    INSERT INTO subscription_plans (name, description, price, billing_cycle, device_limit, features) VALUES
    ('Basic', 'Monitor 1 child device', 9.99, 'monthly', 1, '{"videoQuality": "HD", "cloudRecording": false, "historyRetention": "7 days"}'),
    ('Family', 'Monitor up to 3 child devices', 19.99, 'monthly', 3, '{"videoQuality": "HD", "cloudRecording": true, "historyRetention": "30 days"}'),
    ('Premium', 'Monitor up to 5 child devices', 29.99, 'monthly', 5, '{"videoQuality": "Full HD", "cloudRecording": true, "historyRetention": "90 days", "prioritySupport": true}'),
    ('Basic Annual', 'Monitor 1 child device', 99.99, 'yearly', 1, '{"videoQuality": "HD", "cloudRecording": false, "historyRetention": "7 days"}'),
    ('Family Annual', 'Monitor up to 3 child devices', 199.99, 'yearly', 3, '{"videoQuality": "HD", "cloudRecording": true, "historyRetention": "30 days"}'),
    ('Premium Annual', 'Monitor up to 5 child devices', 299.99, 'yearly', 5, '{"videoQuality": "Full HD", "cloudRecording": true, "historyRetention": "90 days", "prioritySupport": true}');
  END IF;
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
BEGIN
  -- Only insert if no admin exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin' LIMIT 1) THEN
    INSERT INTO users (email, password, full_name, role, is_verified) VALUES
    ('admin@parentmonitor.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', 'System Admin', 'admin', TRUE);
  END IF;
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create update_timestamp function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_timestamp trigger to all tables with updated_at
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_subscription_plans_timestamp BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_subscriptions_timestamp BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_devices_timestamp BEFORE UPDATE ON devices FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
