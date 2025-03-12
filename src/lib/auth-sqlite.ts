import sqlite from "./sqlite-client";
// Use a simple function to generate IDs instead of crypto
const generateId = () => Math.random().toString(36).substring(2, 15);

// Simple password hashing function for browser environment
function hashPassword(password: string): string {
  // This is not secure, just for demo purposes
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// User authentication functions
export const signUp = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    // Check if user already exists
    const existingUser = sqlite.queryOne(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Generate a unique ID for the user
    const userId = generateId();
    const hashedPassword = hashPassword(password);

    // Insert the new user
    sqlite.insert("users", {
      id: userId,
      email,
      password: hashedPassword,
      full_name: fullName,
      role: "parent", // Default role for new users
      is_verified: 0,
      status: "active",
    });

    return { user: { id: userId, email, full_name: fullName } };
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Find user by email
    const user = sqlite.queryOne("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new Error("Invalid email or password");
    }

    // Update last login time
    sqlite.update(
      "users",
      { last_login: new Date().toISOString() },
      "id = :id",
      { id: user.id },
    );

    return { user: { id: user.id, email: user.email, role: user.role } };
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  // In a local SQLite implementation, there's no session to invalidate
  // This would typically clear cookies or tokens in a real auth system
  return { success: true };
};

export const createAdmin = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    // Check if user already exists
    const existingUser = sqlite.queryOne(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Generate a unique ID for the admin user
    const adminId = generateId();
    const hashedPassword = hashPassword(password);

    // Insert the new admin user
    sqlite.insert("users", {
      id: adminId,
      email,
      password: hashedPassword,
      full_name: fullName,
      role: "admin",
      is_verified: 1,
      status: "active",
    });

    return { user: { id: adminId, email, full_name: fullName, role: "admin" } };
  } catch (error) {
    throw error;
  }
};
