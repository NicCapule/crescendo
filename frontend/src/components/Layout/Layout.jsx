import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import style from "./Layout.module.css";

function Layout() {
  return (
    <>
      <div className={style.layout}>
        <Sidebar />
        <Header />
        <div className={style.content}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
