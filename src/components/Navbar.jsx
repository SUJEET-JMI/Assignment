import React from "react";
import { Search, MessageSquare, Bell, ChevronDown, Menu } from "lucide-react";
import { theme } from "../theme.js";

export default function Navbar({ collapsed, setCollapsed }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Icon */}
        <Menu
          className="w-5 h-5 text-gray-500 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        />

        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-lg">
            C
          </div>
          {theme.logo.text}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        
        

       

        {/* Notifications */}
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            J
          </div>

          <div className="leading-tight">
            <p className="text-xs text-gray-500">classplus Administrator</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">John</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
