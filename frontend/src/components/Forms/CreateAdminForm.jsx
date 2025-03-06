import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import style from "./Forms.module.css";
import { createAdmin } from "../../services/userServices";
//===================================================================================//
function CreateAdminForm() {
  const initialValues = {
    user_first_name: "",
    user_last_name: "",
    email: "",
    password: "",
  };
  //-----------------------------------------------//
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is a required field."),
    user_first_name: Yup.string(),
    user_last_name: Yup.string().required("Last name is a required field."),
    password: Yup.string().required("Password is a required field."),
  });
  //-----------------------------------------------//
  const onSubmit = async (data) => {
    // try {
    console.log("Data: ", data);
    await createAdmin(data);
    alert("Teacher created successfully!"); // Handle success feedback
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
        validationSchema={validationSchema}
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
