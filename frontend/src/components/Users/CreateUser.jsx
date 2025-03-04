import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateTeacherForm from "../Forms/CreateTeacherForm";
import CreateAdminForm from "../Forms/CreateAdminForm";
import style from "./Users.module.css";
//===================================================================================//
function CreateUser() {
  const { role } = useParams();

  //====================================================================================//
  return (
    <>
      {role === "teacher" && <CreateTeacherForm />}
      {role === "admin" && <CreateAdminForm />}
    </>
  );
}

export default CreateUser;
