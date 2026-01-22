import React, { useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { theme } from "../theme";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";
import Badge from "../components/Badge";

const students = [
  {
    name: "Abu Bin Ishtiyak",
    email: "abu@gmail.com",
    course: "Front-end Development",
    phone: "+811 847-4958",
    country: "United State",
    payment: "Due",
    status: "Active",
    avatar: "AB"
  },
  {
    name: "Ashley Lawson",
    email: "ashley@gmail.com",
    course: "Responsive Design",
    phone: "+124 394-1787",
    country: "United Kingdom",
    payment: "Paid",
    status: "Inactive",
    avatar: "AL"
  },
  {
    name: "Joe Larson",
    email: "joe@gmail.com",
    course: "Mobile Application",
    phone: "+168 603-2320",
    country: "India",
    payment: "Paid",
    status: "Active",
    avatar: "JL"
  }
];

export default function Students() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      
      <div className="flex-1">
       
        <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Students</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              placeholder="Search by name"
              className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none"
            />
          </div>

          <select className="border rounded-md px-3 py-2 text-sm">
            <option>Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-4">User</th>
              <th>Enrolled Courses</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Payment</th>
              <th>Status</th>
              <th className="w-10">...</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr
                key={i}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* User */}
                <td className="p-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {s.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </div>
                </td>

                {/* Course */}
                <td>
                  <p className="text-gray-800">{s.course}</p>
                  <button className="text-xs text-indigo-500">
                    View More
                  </button>
                </td>

                <td className="text-gray-500">{s.phone}</td>
                <td className="text-gray-500">{s.country}</td>

                {/* Payment */}
                <td>
                  <Badge
                    text={s.payment}
                    type={s.payment === "Paid" ? "success" : "danger"}
                  />
                </td>

                {/* Status */}
                <td>
                  <Badge
                    text={s.status}
                    type={s.status === "Active" ? "success" : "warning"}
                  />
                </td>

                <td className="text-right pr-4">
                  <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 text-xs text-gray-500">
          <div className="flex gap-2">
            <button className="border px-2 py-1 rounded">&lt;</button>
            <button className="border px-2 py-1 rounded">1</button>
            <button className="border px-2 py-1 rounded">2</button>
            <button className="border px-2 py-1 rounded">&gt;</button>
          </div>
          <span>Page 1 of 102</span>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
}
