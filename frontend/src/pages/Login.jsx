import React from "react";
import style from "./Login.module.css";
import logo from "../assets/logo.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
function Login() {
  return (
    <>
      <div className={style.bgOverlay}></div>
      <div className={style.loginContainer}>
        <img src={logo} alt="" />
        <h2>Login</h2>
        <Formik>
          <Form>
            <div className={style.formItem}>
              <Field name="username" placeholder="Email" />
              <ErrorMessage name="username" component="span"></ErrorMessage>
            </div>
            <div className={style.formItem}>
              <Field name="password" placeholder="Password" />
              <ErrorMessage name="password" component="span"></ErrorMessage>
            </div>

            <button type="submit">Login</button>
          </Form>
        </Formik>
      </div>
    </>
  );
}

export default Login;
