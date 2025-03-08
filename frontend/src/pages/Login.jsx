import React from "react";
import { useState, useEffect } from "react";
import style from "./Login.module.css";
import logo from "../assets/logo.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//========================================================================================//
function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  //------------------------------------------------------------------------------//
  useEffect(() => {
    if (user) {
      toast.success("Login successful! Redirecting...", {
        autoClose: 2000,
        position: "top-center",
        onClose: () => navigate("/", { replace: true }),
      });
    }
  }, [user, navigate]);

  //------------------------------------------------------------------------------//
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values);
    } catch (error) {
      // alert("Login failed! " + error.response?.data?.message);
      toast.error("Login failed! " + error.response?.data?.message, {
        autoClose: 2000,
        position: "top-center",
        onClose: () => navigate("/", { replace: true }),
      });
    }
    setSubmitting(false);
  };
  //========================================================================================//
  return (
    <>
      <ToastContainer transition={Bounce} />
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
