import { supabase } from "./supabase-client";

async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("count(*)", { count: "exact" });

    if (error) {
      console.error("Connection test failed:", error);
      return { success: false, error };
    }

    console.log("Connection test successful!", data);
    return { success: true, data };
  } catch (error) {
    console.error("Connection test failed with exception:", error);
    return { success: false, error };
  }
}

export default testSupabaseConnection;
