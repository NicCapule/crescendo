import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
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
import Payment from "./pages/Payment";
//----------------------------------//
import TeacherInfo from "./components/Teachers/TeacherInfo";
import StudentInfo from "./components/Students/StudentInfo";
import AddPaymentForm from "./components/Forms/AddPaymentForm";
import RescheduleForm from "./components/Forms/RescheduleForm";
import TeacherProfile from "./components/Profile/TeacherProfile";
//--------------------------------------------------------------//
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route ==========================================================*/}
          <Route path="login" element={<Login />} />
          {/* Protected Routes ==========================================================*/}
          <Route
            element={<ProtectedRoute allowedRoles={["Admin", "Teacher"]} />}
          >
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />}>
                <Route path=":id/:name" element={<StudentInfo />} />
              </Route>
              <Route path="schedule" element={<Schedule />} />
              <Route path="teachers" element={<Teachers />}>
                <Route path=":id/:name" element={<TeacherInfo />} />
              </Route>
              <Route path="profile" element={<TeacherProfile />} />
            </Route>
          </Route>
          {/* Teacher Only ==========================================================*/}
          <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<TeacherProfile />} />
            </Route>
          </Route>
          {/* Admin Only ==========================================================*/}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/" element={<Layout />}>
              <Route path="enrollment" element={<Enrollment />} />
              <Route path="users" element={<Users />} />
              <Route path="users/create/:role" element={<CreateUser />} />
              <Route path="payment" element={<Payment />} />
              <Route path="payment/add" element={<AddPaymentForm />} />
              <Route path="reschedule-session" element={<RescheduleForm />} />
              <Route />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
