import React from "react";

import { NavLink, Link } from "react-router-dom";
import style from "./Layout.module.css";

function Sidebar() {
  return (
    <div className={style.sideContainer}>
      <nav className={style.sideNav}>
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          Home
        </NavLink>

        <NavLink
          to={"/login"}
          className={({ isActive }) => (isActive ? style.active : style.text)}
        >
          Logout
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
