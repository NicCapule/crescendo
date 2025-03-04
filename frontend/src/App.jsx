import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Schedule from "./pages/Schedule";
import Enrollment from "./pages/Enrollment";
import Users from "./pages/Users";
import CreateUser from "./components/Users/CreateUser";
//----------------------------------//
import TeacherInfo from "./components/Teachers/TeacherInfo";
import StudentInfo from "./components/Students/StudentInfo";
//--------------------------------------------------------------//
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["Admin", "Teacher"]} />}
          >
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />}>
                <Route path=":id/:name" element={<StudentInfo />} />
              </Route>
              <Route path="schedule" element={<Schedule />} />
            </Route>
          </Route>

          {/* <Route
            element={<ProtectedRoute allowedRoles={["Admin", "Teacher"]} />}
          >
            <Route path="teachers/:id/:name" element={<TeacherInfo />} />
          </Route> */}

          <Route
            element={<ProtectedRoute allowedRoles={["Admin", "Teacher"]} />}
          >
            <Route path="/" element={<Layout />}>
              <Route path="teachers" element={<Teachers />}>
                <Route path=":id/:name" element={<TeacherInfo />} />
              </Route>

              <Route path="enrollment" element={<Enrollment />} />
              <Route path="users" element={<Users />} />
              <Route path="users/create/:role" element={<CreateUser />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
