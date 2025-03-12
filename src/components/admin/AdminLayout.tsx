import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  Monitor,
  Activity,
  Settings,
  LogOut,
  BarChart3,
  FileText,
  MessageSquare,
  Globe,
  Shield,
} from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase-client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm py-4 px-4 md:hidden flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-red-600 text-white p-2 rounded-full mr-2">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${isMobileMenuOpen ? "block" : "hidden"} md:block w-64 bg-white shadow-md min-h-screen p-4 fixed md:relative z-10 h-full`}
        >
          <div className="flex items-center mb-8 mt-2">
            <div className="bg-red-600 text-white p-2 rounded-full mr-2">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-1">
            <NavItem
              to="/admin/dashboard"
              icon={<BarChart3 className="h-5 w-5 mr-3" />}
              label="Dashboard"
              isActive={isActive("/admin/dashboard")}
            />
            <NavItem
              to="/admin/users"
              icon={<Users className="h-5 w-5 mr-3" />}
              label="Users"
              isActive={isActive("/admin/users")}
            />
            <NavItem
              to="/admin/subscriptions"
              icon={<CreditCard className="h-5 w-5 mr-3" />}
              label="Subscriptions"
              isActive={isActive("/admin/subscriptions")}
            />
            <NavItem
              to="/admin/devices"
              icon={<Monitor className="h-5 w-5 mr-3" />}
              label="Devices"
              isActive={isActive("/admin/devices")}
            />
            <NavItem
              to="/admin/activity"
              icon={<Activity className="h-5 w-5 mr-3" />}
              label="Activity Logs"
              isActive={isActive("/admin/activity")}
            />
            <NavItem
              to="/admin/content"
              icon={<FileText className="h-5 w-5 mr-3" />}
              label="Content"
              isActive={isActive("/admin/content")}
            />
            <NavItem
              to="/admin/messages"
              icon={<MessageSquare className="h-5 w-5 mr-3" />}
              label="Messages"
              isActive={isActive("/admin/messages")}
            />
            <NavItem
              to="/admin/website"
              icon={<Globe className="h-5 w-5 mr-3" />}
              label="Website"
              isActive={isActive("/admin/website")}
            />
            <NavItem
              to="/admin/settings"
              icon={<Settings className="h-5 w-5 mr-3" />}
              label="Settings"
              isActive={isActive("/admin/settings")}
            />
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
        </aside>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`w-full flex items-center p-3 rounded-md ${isActive ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
    >
      {icon}
      {label}
    </Link>
  );
};

export default AdminLayout;
