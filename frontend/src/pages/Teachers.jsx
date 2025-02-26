import React from "react";
import AllTeachers from "../components/Teachers/AllTeachers";
import { Outlet, useParams } from "react-router-dom";

function Teachers() {
  const { id } = useParams();
  return (
    <>
      <h1 className="pageTitle">Teachers</h1>
      {id ? <Outlet /> : <AllTeachers />}
    </>
  );
}

export default Teachers;
