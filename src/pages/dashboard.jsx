import React from "react";
import StatCard from "../components/Statcard";
// import { LineChart, Line, XAxis, YAxis,  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Clock, PieChart as PieChartIcon } from 'lucide-react';
import { theme } from '../theme';
import { LineChart, CartesianGrid,Line,ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function Dashboard() {
  // Static data for graphs
  const enrollmentData = [
    { day: '1', students: 120 },
    { day: '5', students: 150 },
    { day: '10', students: 180 },
    { day: '15', students: 200 },
    { day: '20', students: 250 },
    { day: '25', students: 300 },
    { day: '30', students: 320 },
  ];
  

  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  const weeklyData = [
    { day: 'Mon', hours: 8 },
    { day: 'Tue', hours: 6 },
    { day: 'Wed', hours: 9 },
    { day: 'Thu', hours: 7 },
    { day: 'Fri', hours: 10 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 4 },
  ];

  return (
    <main className="p-4 md:p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="mb-6 p-6 bg-white rounded-xl flex flex-col md:flex-row md:items-center md:justify-between">
  <div>
    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
    <p className="text-sm text-gray-500 mt-1">
      Welcome to Learning Management Dashboard.
    </p>
  </div>

  {/* Right Controls */}
  <div className="flex items-center gap-3 mt-4 md:mt-0">

    <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90">
      Reports
    </button>
  </div>
</div>

      {/* New Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="Total Students" value="5490" change="+12%" positive={true} />
        <StatCard title="Total Teachers" value="150" change="+8%" positive={true} />
        <StatCard title="Total Parents" value="1200" change="+5%" positive={true} />
        <StatCard title="Total Course" value="10" change="+8%" positive={true} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 mt-2">

        {/* LEFT SECTION */}
        <div className="space-y-6">
          
          {/* Students Enrolment */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Students Enrolment</h3>
                <p className="text-xs text-gray-500">
                  In last 30 days enrolment of students
                </p>
              </div>
            </div>

            <div className="flex gap-10 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">5490</p>
                <p className="text-xs text-gray-400">This Month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">1480</p>
                <p className="text-xs text-gray-400">This Week</p>
              </div>
            </div>

            {/* Enrollment Graph */}
            <ResponsiveContainer width="100%" height={128}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Total Sales</h3>
              <p className="text-xs text-gray-500 mb-4">
                vs. last month
              </p>
              <ResponsiveContainer width="100%" height={128}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-2">This Week So Far</h3>
              <p className="text-xs text-gray-500 mb-4">
                vs. last week
              </p>
              <ResponsiveContainer width="100%" height={128}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

      

      </div>

      
    </main>
  );
}
