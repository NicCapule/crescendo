import React from "react";
import { NavLink, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  PiSquaresFour,
  PiStudent,
  PiChalkboardTeacher,
  PiCalendarDots,
  PiUserCircle,
  PiSignOut,
  PiNotebook,
  PiMoney,
} from "react-icons/pi";
import LogoutConfirm from "../Confirm/LogoutConfirm";

function Sidebar() {
  const { user, logout } = useAuth();
  //------------------------------------//
  const handleLogout = () => {
    LogoutConfirm({
      title: "Confirm Logout?",
      message: "Are you sure you want to log out?",
      onConfirm: logout,
    });
  };
  //================================================================================//
  return (
    <div className="sideContainer">
      <nav className="sideNav">
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? "active" : "text")}
        >
          <PiSquaresFour size={24} />
          Dashboard
        </NavLink>

        <NavLink
          to={"/students"}
          className={({ isActive }) => (isActive ? "active" : "text")}
        >
          <PiStudent size={24} />
          Students
        </NavLink>

        {user?.role === "Admin" && (
          <NavLink
            to={"/teachers"}
            className={({ isActive }) => (isActive ? "active" : "text")}
          >
            <PiChalkboardTeacher size={24} />
            Teachers
          </NavLink>
        )}

        <NavLink
          to={"/schedule"}
          className={({ isActive }) => (isActive ? "active" : "text")}
        >
          <PiCalendarDots size={24} />
          Schedule
        </NavLink>

        {user?.role === "Admin" && (
          <>
            <NavLink
              to={"/enrollment"}
              className={({ isActive }) => (isActive ? "active" : "text")}
            >
              <PiNotebook size={24} />
              Enrollment
            </NavLink>

            <NavLink
              to={"/users"}
              className={({ isActive }) => (isActive ? "active" : "text")}
            >
              <PiUserCircle size={24} />
              Users
            </NavLink>

            <NavLink
              to={"/payment"}
              className={({ isActive }) => (isActive ? "active" : "text")}
            >
              <PiMoney size={24} />
              Payment
            </NavLink>
          </>
        )}

        <button onClick={handleLogout} className={"text"}>
          <PiSignOut size={24} />
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
