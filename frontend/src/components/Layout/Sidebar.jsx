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

import style from "./Layout.module.css";

function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <div className={style.sideContainer}>
      <nav className={style.sideNav}>
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiSquaresFour size={24} />
          Dashboard
        </NavLink>

        <NavLink
          to={"/students"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiStudent size={24} />
          Students
        </NavLink>

        {user?.role === "Admin" && (
          <NavLink
            to={"/teachers"}
            className={({ isActive }) => (isActive ? style.active : style.text)}
          >
            <PiChalkboardTeacher size={24} />
            Teachers
          </NavLink>
        )}

        <NavLink
          to={"/schedule"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiCalendarDots size={24} />
          Schedule
        </NavLink>

        {/* {user?.role === "Admin" && (
          <>
            <NavLink
              to={"/enrollment"}
              className={({ isActive }) =>
                isActive ? style.active : style.text
              }
            >
              <PiNotebook size={24} />
              Enrollment
            </NavLink>

            <NavLink
              to={"/users"}
              className={({ isActive }) =>
                isActive ? style.active : style.text
              }
            >
              <PiUserCircle size={24} />
              Users
            </NavLink>
          </>
        )} */}
        <NavLink
          to={"/enrollment"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiNotebook size={24} />
          Enrollment
        </NavLink>

        <NavLink
          to={"/users"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiUserCircle size={24} />
          Users
        </NavLink>

        <NavLink
          to={"/payment"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiMoney size={24} />
          Payment
        </NavLink>

        <button onClick={logout} className={style.text}>
          <PiSignOut size={24} />
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
