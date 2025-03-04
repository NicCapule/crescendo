import React from "react";
import { useState, useEffect } from "react";
import style from "./Login.module.css";
import logo from "../assets/logo.png";
import { loginUser } from "../services/userServices";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

//========================================================================================//
function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  //------------------------------------------------------------------------------//
  useEffect(() => {
    if (user) {
      alert("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
  }, [user, navigate]);

  //------------------------------------------------------------------------------//
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values);
    } catch (error) {
      alert("Login failed! " + error.response?.data?.message);
    }
    setSubmitting(false);
  };
  //========================================================================================//
  return (
    <>
      <div className={style.bgOverlay}></div>
      <div className={style.loginContainer}>
        <img src={logo} alt="" />
        <h2>Login</h2>
        <Formik initialValues={{ email: "", password: "" }} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className={style.formItem}>
                <Field name="email" type="email" placeholder="Email" />
                <ErrorMessage name="email" component="span" />
              </div>
              <div className={style.formItem}>
                <Field name="password" type="password" placeholder="Password" />
                <ErrorMessage name="password" component="span" />
              </div>
              <button
                type="submit"
                className={style.loginButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Login;
