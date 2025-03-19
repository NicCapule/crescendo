import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import style from "./Forms.module.css";
import { createAdmin } from "../../services/userServices";
import { adminValidationSchema } from "../validations/adminValidationSchema";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateUserConfirm from "../Confirm/CreateUserConfirm";
import { useNavigate } from "react-router-dom";
//===================================================================================//
function CreateAdminForm() {
  const initialValues = {
    user_first_name: "",
    user_last_name: "",
    email: "",
    password: "",
  };
  const navigate = useNavigate();
  //-----------------------------------------------//
  const createUser = async (data, resetForm) => {
    try {
      await createAdmin(data);
      toast.success("Administrator registered successfully!", {
        autoClose: 2000,
        position: "top-center",
      });
      resetForm();
    } catch (error) {
      toast.error(
        "Failed to create administrator account. " +
          (error.response?.data?.message || ""),
        {
          autoClose: 2000,
          position: "top-center",
        }
      );
    }
  };
  //-----------------------------------------------//
  const onSubmit = async (data, { resetForm }) => {
    CreateUserConfirm({
      title: "Confirm Registration",
      message: "Are you sure you want to register Administrator",
      onConfirm: () => createUser(data, resetForm),
      createDetails: data,
    });
  };
  //===================================================================================//
  return (
    <div className={style.formParentContainer}>
      <ToastContainer transition={Bounce} />
      <h1>Create an Administrator Account</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={adminValidationSchema}
      >
        {({ resetForm }) => (
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
              <div className={style.createUserButtons}>
                <button type="submit">Add Teacher</button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    navigate(-1);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateAdminForm;
