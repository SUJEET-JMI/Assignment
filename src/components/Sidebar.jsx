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

  { label: "Courses", icon: BookOpen },

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
  { label: "Enrolment", icon: ClipboardList },
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

            return (
              <div key={item.label}>
                {/* Parent */}
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors
                    ${
                      location.pathname.startsWith("/students")
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
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
                        className={`block px-3 py-2 text-sm rounded-md transition
                          ${
                            location.pathname === sub.path
                              ? "bg-indigo-100 text-indigo-700 font-medium"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
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
              className={`flex items-center px-4 py-2 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
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
