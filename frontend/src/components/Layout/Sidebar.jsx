import React from "react";

import { NavLink, Link } from "react-router-dom";
import {
  PiSquaresFour,
  PiStudent,
  PiChalkboardTeacher,
  PiCalendarDots,
  PiUserCircle,
  PiSignOut,
} from "react-icons/pi";

import style from "./Layout.module.css";

function Sidebar() {
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

        <NavLink
          to={"/teachers"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiChalkboardTeacher size={24} />
          Teachers
        </NavLink>

        <NavLink
          to={"/schedule"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiCalendarDots size={24} />
          Schedule
        </NavLink>

        <NavLink
          to={"/users"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiUserCircle size={24} />
          Users
        </NavLink>

        <NavLink
          to={"/login"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          <PiSignOut size={24} />
          Logout
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
