import React from "react";
import style from "./Users.module.css";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

function CreateUser() {
  //===============================================//
  const initialValues = {
    username: "",
    password: "",
  };
  //===============================================//
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is a required field."),
    password: Yup.string().required("Password is a required field."),
    role: Yup.string().required("Please select a role."),
  });
  //===============================================//
  const onSubmit = (data) => {
    axios.post("http://localhost:3001/users", data).then((response) => {});
  };

  return (
    <>
      <h1>Create User</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <div className="compContainer">
            <div className={style.formItem}>
              <label htmlFor="">Email</label>
              <Field name="email" />
              <ErrorMessage name="email" component="span"></ErrorMessage>
            </div>
            <div className={style.formItem}>
              <label htmlFor="">Password</label>
              <Field name="password" />
              <ErrorMessage name="password" component="span"></ErrorMessage>
            </div>
            <div role="radio-group" className={style.formItem}>
              Role
              <label htmlFor="">
                <Field type="radio" name="role" value="Admin" />
                Admin
              </label>
              <label htmlFor="">
                <Field type="radio" name="role" value="Teacher" />
                Teacher
              </label>
              <ErrorMessage name="role" component="span"></ErrorMessage>
            </div>

            <button type="submit">Create User</button>
          </div>
        </Form>
      </Formik>
    </>
  );
}

export default CreateUser;
