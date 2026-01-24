import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import SuspendedStudents from './pages/Suspendedstudents';
import TerminatedStudents from './pages/TerminatedStudents';
import StudentProfile from './components/StudentProfile';
import PendingTeacher from './pages/PendingTeacher';
import ApprovedTeacher from './pages/ApprovedTeacher';
import SuspendedTeacher from './pages/SuspendedTeachers';
import TerminatedTeacher from './pages/TerminatedTeacher';
import ApprovedParents from './pages/ApprovedParents';
import TerminatedParents from './pages/TerminatedParents';
import SuspendedParents from './pages/SuspendedParents';
import Class from './pages/Class';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex">
        <Sidebar collapsed={collapsed} />
        <div className="flex-1 overflow-hidden">
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/Suspended" element={<SuspendedStudents />} />
            <Route path="/students/terminated" element={<TerminatedStudents />} />
            <Route path="/students/profile/:id" element={<StudentProfile />} />
            <Route path="/teacher/pending" element={<PendingTeacher />} />
            <Route path="/teacher" element={<ApprovedTeacher />} />
            <Route path="/teacher/suspended" element={<SuspendedTeacher />} />
            <Route path="/teacher/terminated" element={<TerminatedTeacher />} />
            <Route path="/Class" element={<Class />} />
            <Route path="/parents" element={<ApprovedParents />} />
            <Route path="/parents/suspended" element={<SuspendedParents />} />
            <Route path="/parents/terminated" element={<TerminatedParents />} />
            <Route path="/" element={<Dashboard />} /> {/* Default to dashboard */}
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}
