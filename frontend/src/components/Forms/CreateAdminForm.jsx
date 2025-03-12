import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import style from "./Forms.module.css";
import { createAdmin } from "../../services/userServices";
import { adminValidationSchema } from "../validations/adminValidationSchema";
//===================================================================================//
function CreateAdminForm() {
  const initialValues = {
    user_first_name: "",
    user_last_name: "",
    email: "",
    password: "",
  };
  //-----------------------------------------------//
  const onSubmit = async (data) => {
    // try {
    await createAdmin(data);
    alert("Admin created successfully!"); // Handle success feedback
    // } catch (error) {
    //   console.error("Error creating teacher:", error);
    //   alert("Failed to create teacher. Please try again.");
    // }
  };
  //===================================================================================//
  return (
    <div className={style.formParentContainer}>
      <h1>Create an Administrator Account</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={adminValidationSchema}
      >
        <Form className={style.adminFormContainer}>
          <div className={style.formSection}>
            <div className={style.formItem}>
              <div className={style.itemHeader}>
                <label htmlFor="">First Name</label>
                <ErrorMessage
                  name="user_first_name"
                  component="span"
                  className={style.errorMessage}
                />
              </div>
              <Field name="user_first_name" />
            </div>
            <div className={style.formItem}>
              <div className={style.itemHeader}>
                <label htmlFor="">Last Name</label>
                <ErrorMessage
                  name="user_last_name"
                  component="span"
                  className={style.errorMessage}
                />
              </div>

              <Field name="user_last_name" />
            </div>

            <div className={style.formItem}>
              <div className={style.itemHeader}>
                <label htmlFor="">Email</label>
                <ErrorMessage
                  name="email"
                  component="span"
                  className={style.errorMessage}
                />
              </div>

              <Field name="email" />
            </div>
            <div className={style.formItem}>
              <div className={style.itemHeader}>
                <label htmlFor="">Password</label>
                <ErrorMessage
                  name="password"
                  component="span"
                  className={style.errorMessage}
                />
              </div>

              <Field name="password" type="password" />
            </div>
            <button type="submit">Add Administrator</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default CreateAdminForm;
