import React, { useState } from "react";
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
  ChevronDown,
  Home
} from "lucide-react";
import { theme } from "../theme.js";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },

  { label: "Courses", icon: BookOpen ,
    submenu: [
      { label: "Class", path: "/Class" },
      { label: "Subject", path: "/Subject" },
      { label: "Courses", path: "/Course" }
    ]
  },

  {
    label: "Students",
    icon: Users,
    submenu: [
      { label: "Approved Students", path: "/students" },
      { label: "Suspended Students", path: "/students/Suspended" },
      { label: "Terminated Students", path: "/students/terminated" }
    ]
  },

  { label: "Teachers", icon: Users ,submenu: [
      { label: "Approved Teachers", path: "/teacher" },
      { label: "Pending Teachers", path: "/teacher/pending" },
      { label: "Suspended Teachers", path: "/teacher/suspended" },
      { label: "Terminated Teachers", path: "/teacher/terminated" }
    ]},
  { label: "Parents", icon: Users ,submenu: [
      { label: "Approved Parents", path: "/parents" },
      { label: "Suspended Parents", path: "/parents/suspended" },
      { label: "Terminated Parents", path: "/parents/terminated" }
    ] },
  { label: "Enrolment", icon: ClipboardList ,path: "/enrollment" },
  { label: "Messages", icon: MessageSquare },
  { label: "Admin profile", icon: UserCog },
  { label: "Invoice", icon: FileText },
  { label: "Settings", icon: Settings }
];


export default function Sidebar({ collapsed }) {
   const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };
  return (
    <aside
      className={`fixed left-0 top-0 h-screen border-r flex flex-col transition-all duration-300 overflow-y-auto ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{ backgroundColor: theme.colors.sidebar }}
    >
    

      {/* Logo */}
      <div
        className={`flex items-center gap-2 px-6 py-5 text-xl font-bold transition-all duration-300 ${
          collapsed ? "justify-center" : ""
        }`}
        style={{ color: theme.colors.success }}
      >
        <div
          className="w-8 h-8 text-white flex items-center justify-center rounded-lg"
          style={{ backgroundColor: theme.colors.success }}
        >
          C
        </div>
        {!collapsed && theme.logo.text}
      </div>

       {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path && location.pathname === item.path;

          if (item.submenu) {
            const isOpen = openMenu === item.label;
            const isParentActive = item.submenu.some(sub => location.pathname === sub.path);

            return (
              <div key={item.label}>
                {/* Parent */}
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors
                    ${
                      isParentActive
                        ? "bg-green-50 text-green-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      collapsed ? "justify-center w-full" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed && (
                    isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </button>

                {/* Submenu */}
                {!collapsed && isOpen && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        className={`block px-3 py-2 text-sm rounded-md transition ${
                          location.pathname === sub.path
                            ? "font-medium"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                        style={
                          location.pathname === sub.path
                            ? {
                                backgroundColor: theme.colors.secondary,
                                color: theme.colors.success,
                              }
                            : {}
                        }
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          /* Normal menu item */
          return (
            <Link
              key={item.label}
              to={item.path || "#"}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.success,
                    }
                  : {}
              }
            >
              <Icon className="w-5 h-5" />
              {!collapsed && (
                <span className="ml-3 text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t">
        {!collapsed ? (
          <>
            <p className="text-xs text-gray-400 mb-2 tracking-widest">
              RETURN TO
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 cursor-pointer">
              <Home className="w-4 h-4" />
              Main Dashboard
            </div>
          </>
        ) : (
          <div className="flex justify-center text-indigo-600">
            <Home className="w-5 h-5" />
          </div>
        )}
      </div>
    </aside>
  );
}
