import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <>
      <div className="layout">
        <Sidebar />
        <Header />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
