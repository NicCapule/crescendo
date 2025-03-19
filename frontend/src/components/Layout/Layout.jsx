import React from "react";
import { Outlet } from "react-router-dom";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <>
      <div className="layout">
        <Sidebar />
        <Header />
        <div className="content">
          <ToastContainer transition={Bounce} />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
