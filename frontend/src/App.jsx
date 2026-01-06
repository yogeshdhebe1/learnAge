import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ViewProfile from './pages/shared/ViewProfile';
import EditProfile from './pages/shared/EditProfile';

// Landing & Auth
import Landing from './pages/landing';
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentHomework from './pages/student/StudentHomework';
import AITutor from './pages/student/AITutor';
import ClassChatStudent from './pages/student/ClassChat';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MarkAttendance from './pages/teacher/MarkAttendance';
import AssignHomework from './pages/teacher/AssignHomework';
import AddStudent from './pages/teacher/AddStudent';
import ClassChatTeacher from './pages/teacher/ClassChat';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentAttendance from './pages/parent/ParentAttendance';
import ParentHomework from './pages/parent/ParentHomework';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/homework"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHomework />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/ai-tutor"
          element={
            <ProtectedRoute allowedRole="student">
              <AITutor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/class-chat"
          element={
            <ProtectedRoute allowedRole="student">
              <ClassChatStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="student">
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/edit-profile"
          element={
            <ProtectedRoute allowedRole="student">
              <EditProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/mark-attendance"
          element={
            <ProtectedRoute allowedRole="teacher">
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assign-homework"
          element={
            <ProtectedRoute allowedRole="teacher">
              <AssignHomework />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/add-student"
          element={
            <ProtectedRoute allowedRole="teacher">
              <AddStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/class-chat"
          element={
            <ProtectedRoute allowedRole="teacher">
              <ClassChatTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRole="teacher">
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-profile"
          element={
            <ProtectedRoute allowedRole="teacher">
              <EditProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Parent Routes */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/attendance"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/homework"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentHomework />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/profile"
          element={
            <ProtectedRoute allowedRole="parent">
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/edit-profile"
          element={
            <ProtectedRoute allowedRole="parent">
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;