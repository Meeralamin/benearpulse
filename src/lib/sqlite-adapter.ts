// This file provides a compatibility layer to use the same API as Supabase
// but with SQLite as the backend

import * as authFunctions from "./auth-sqlite";
import * as deviceFunctions from "./device-sqlite";
import * as subscriptionFunctions from "./subscription-sqlite";

// Create a mock Supabase client that uses SQLite
export const sqliteAdapter = {
  auth: {
    signUp: authFunctions.signUp,
    signInWithPassword: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return authFunctions.signIn(email, password);
    },
    signOut: authFunctions.signOut,
    getSession: async () => {
      // This is a mock function that would normally return the current session
      // In a real app, you would use cookies or localStorage to store the session
      return { data: { session: null } };
    },
  },
  from: (table: string) => ({
    select: (columns: string = "*") => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          // This is a simplified implementation
          if (table === "users" && column === "id") {
            const user = await sqliteAdapter.rpc("get_user_by_id", {
              id: value,
            });
            return { data: user, error: null };
          }
          return { data: null, error: null };
        },
        limit: (limit: number) => ({
          async then(resolve: (result: any) => void) {
            // This is a simplified implementation
            if (table === "users" && column === "role") {
              const users = await sqliteAdapter.rpc("get_users_by_role", {
                role: value,
                limit,
              });
              resolve({ data: users, error: null });
            } else {
              resolve({ data: [], error: null });
            }
          },
        }),
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        async then(resolve: (result: any) => void) {
          // This is a simplified implementation
          if (table === "users") {
            const users = await sqliteAdapter.rpc("get_users_ordered", {
              column,
              ascending,
            });
            resolve({ data: users, error: null });
          } else {
            resolve({ data: [], error: null });
          }
        },
      }),
    }),
    insert: (data: any) => ({
      async then(resolve: (result: any) => void) {
        try {
          if (table === "users") {
            const result = await sqliteAdapter.rpc("insert_user", data);
            resolve({ data: result, error: null });
          } else if (table === "subscription_plans") {
            const result = await sqliteAdapter.rpc(
              "insert_subscription_plan",
              data,
            );
            resolve({ data: result, error: null });
          } else {
            resolve({ data: null, error: "Table not implemented" });
          }
        } catch (error) {
          resolve({ data: null, error });
        }
      },
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        async then(resolve: (result: any) => void) {
          try {
            if (table === "users" && column === "id") {
              const result = await sqliteAdapter.rpc("update_user", {
                ...data,
                id: value,
              });
              resolve({ data: result, error: null });
            } else {
              resolve({ data: null, error: "Update not implemented" });
            }
          } catch (error) {
            resolve({ data: null, error });
          }
        },
      }),
    }),
  }),
  rpc: async (functionName: string, params: any = {}) => {
    // Map RPC function names to our SQLite functions
    switch (functionName) {
      case "get_user_by_id":
        // Implementation would go here
        return { data: null, error: null };
      case "get_users_by_role":
        // Implementation would go here
        return { data: [], error: null };
      case "get_users_ordered":
        // Implementation would go here
        return { data: [], error: null };
      case "insert_user":
        // Implementation would go here
        return { data: null, error: null };
      case "insert_subscription_plan":
        // Implementation would go here
        return { data: null, error: null };
      case "update_user":
        // Implementation would go here
        return { data: null, error: null };
      case "exec_sql":
        // This would execute raw SQL - be careful with this in production!
        return { data: null, error: null };
      default:
        return {
          data: null,
          error: `Function ${functionName} not implemented`,
        };
    }
  },
};

// Export all the functions from the other modules
export const { signUp, signIn, signOut, createAdmin } = authFunctions;

export const {
  generateDeviceId,
  createDevice,
  getDevices,
  getDeviceSettings,
  updateDeviceSettings,
  startSession,
  endSession,
  hasActiveSession,
} = deviceFunctions;

export const {
  getSubscriptionPlans,
  getUserSubscription,
  createSubscription,
  canAddDevice,
} = subscriptionFunctions;

export default sqliteAdapter;
