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
import Course from './pages/Course';
import CourseProfile from './pages/CourseProfile';
import Class from './pages/Class';
import Subject from './pages/Subject';
import Enrollment from './pages/Enrollment';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Sidebar collapsed={collapsed} />
      <div className={`${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="mt-16">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/Suspended" element={<SuspendedStudents />} />
            <Route path="/students/terminated" element={<TerminatedStudents />} />
            <Route path="/students/profile/:studentId" element={<StudentProfile />} />
            <Route path="/teacher/pending" element={<PendingTeacher />} />
            <Route path="/teacher" element={<ApprovedTeacher />} />
            <Route path="/teacher/suspended" element={<SuspendedTeacher />} />
            <Route path="/teacher/terminated" element={<TerminatedTeacher />} />
            <Route path="/Class" element={<Class />} />
            <Route path="/parents" element={<ApprovedParents />} />
            <Route path="/parents/suspended" element={<SuspendedParents />} />
            <Route path="/parents/terminated" element={<TerminatedParents />} />
            <Route path="/subject" element={<Subject/>}/>
            <Route path="/course" element={<Course/>}/>
            <Route path="/course/profile/:courseCode" element={<CourseProfile/>}/>
            <Route path="/enrollment" element={<Enrollment/>}/>
            <Route path="/" element={<Dashboard />} /> {/* Default to dashboard */}
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}
