import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { supabase } from "@/lib/supabase-client";
import {
  Users,
  CreditCard,
  Monitor,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalDevices: 0,
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users (parents only)
        const { count: userCount } = await supabase
          .from("users")
          .select("id", { count: "exact" })
          .eq("role", "parent");

        // Get active subscriptions
        const { count: subscriptionCount } = await supabase
          .from("subscriptions")
          .select("id", { count: "exact" })
          .eq("status", "active");

        // Get total devices
        const { count: deviceCount } = await supabase
          .from("devices")
          .select("id", { count: "exact" });

        // Get active sessions
        const { count: sessionCount } = await supabase
          .from("active_sessions")
          .select("id", { count: "exact" })
          .is("ended_at", null);

        setStats({
          totalUsers: userCount || 0,
          activeSubscriptions: subscriptionCount || 0,
          totalDevices: deviceCount || 0,
          activeSessions: sessionCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen p-4">
          <div className="flex items-center mb-8">
            <div className="bg-red-600 text-white p-2 rounded-full mr-2">
              <Settings className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center p-3 rounded-md ${activeTab === "overview" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
            >
              <Activity className="h-5 w-5 mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center p-3 rounded-md ${activeTab === "users" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
            >
              <Users className="h-5 w-5 mr-3" />
              Users
            </button>
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`w-full flex items-center p-3 rounded-md ${activeTab === "subscriptions" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("devices")}
              className={`w-full flex items-center p-3 rounded-md ${activeTab === "devices" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
            >
              <Monitor className="h-5 w-5 mr-3" />
              Devices
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center p-3 rounded-md ${activeTab === "settings" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </button>
          </nav>

          <div className="absolute bottom-4 w-52">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

              {loading ? (
                <div className="text-center py-12">Loading statistics...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {stats.totalUsers}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Parent accounts
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Active Subscriptions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {stats.activeSubscriptions}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Paying customers
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Total Devices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {stats.totalDevices}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Registered devices
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Active Sessions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {stats.activeSessions}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Current monitoring sessions
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">User</th>
                            <th className="text-left p-4">Action</th>
                            <th className="text-left p-4">Device</th>
                            <th className="text-left p-4">Time</th>
                            <th className="text-left p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* This would be populated from the database */}
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-4">john@example.com</td>
                            <td className="p-4">Started monitoring</td>
                            <td className="p-4">Sarah's iPhone</td>
                            <td className="p-4">2 minutes ago</td>
                            <td className="p-4">
                              <Badge className="bg-green-500">Active</Badge>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-4">mary@example.com</td>
                            <td className="p-4">Ended monitoring</td>
                            <td className="p-4">Tommy's iPad</td>
                            <td className="p-4">15 minutes ago</td>
                            <td className="p-4">
                              <Badge variant="outline">Completed</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-4">steve@example.com</td>
                            <td className="p-4">Added new device</td>
                            <td className="p-4">Alex's Android</td>
                            <td className="p-4">1 hour ago</td>
                            <td className="p-4">
                              <Badge variant="secondary">System</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">User Management</h2>
              {/* User management interface would go here */}
              <p>User management interface is under development.</p>
            </div>
          )}

          {activeTab === "subscriptions" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
              {/* Subscription management interface would go here */}
              <p>Subscription management interface is under development.</p>
            </div>
          )}

          {activeTab === "devices" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Device Management</h2>
              {/* Device management interface would go here */}
              <p>Device management interface is under development.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">System Settings</h2>
              {/* Settings interface would go here */}
              <p>Settings interface is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
