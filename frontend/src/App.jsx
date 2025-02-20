import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Schedule from "./pages/Schedule";
import Enrollment from "./pages/Enrollment";
import Users from "./pages/Users";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="Schedule" element={<Schedule />} />
              <Route path="enrollment" element={<Enrollment />} />
              <Route path="users" element={<Users />} />
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
