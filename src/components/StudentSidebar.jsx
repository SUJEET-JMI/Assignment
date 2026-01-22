import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  User,
  Users,
  ClipboardList,
  MessageSquare,
  UserCog,
  FileText,
  Settings,
  ChevronRight,
  Home
} from "lucide-react";
import { theme } from "../theme.js";

const studentMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Courses", icon: BookOpen, arrow: true },
  { label: "Profile", icon: User },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings }
];

export default function StudentSidebar({ collapsed }) {
  const location = useLocation();

  return (
    <aside
      className={`min-h-screen bg-white border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* Logo */}
      <div
        className={`flex items-center gap-2 px-6 py-5 text-xl font-bold text-indigo-600 transition-all duration-300 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-lg">
          S
        </div>
        {!collapsed && "Student Portal"}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {studentMenu.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          const Component = item.path ? Link : 'div';
          const props = item.path ? { to: item.path } : {};
          return (
            <Component
              key={item.label}
              {...props}
              className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </div>

              {!collapsed && item.arrow && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </Component>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t transition-all duration-300">
        {!collapsed && (
          <>
            <p className="text-xs text-gray-400 mb-2 tracking-widest">RETURN TO</p>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-indigo-600">
              <Home className="w-4 h-4" />
              Main Dashboard
            </div>
          </>
        )}
        {collapsed && (
          <div className="flex justify-center text-indigo-600 cursor-pointer">
            <Home className="w-5 h-5" />
          </div>
        )}
      </div>
    </aside>
  );
}
