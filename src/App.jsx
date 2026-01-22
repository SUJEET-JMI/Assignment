import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import SuspendedStudents from './pages/Suspendedstudents';
import TerminatedStudents from './pages/TerminatedStudents';
import StudentProfile from './components/StudentProfile';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex">
        <Sidebar collapsed={collapsed} />
        <div className="flex-1">
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/Suspended" element={<SuspendedStudents />} />
            <Route path="/students/terminated" element={<TerminatedStudents />} />
            <Route path="/students/profile/:id" element={<StudentProfile />} />
            <Route path="/" element={<Dashboard />} /> {/* Default to dashboard */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
