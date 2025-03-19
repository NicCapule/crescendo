import React from "react";
import { useEffect, useState } from "react";
import style from "./Forms.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DateTime } from "luxon";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { createTeacher } from "../../services/teacherServices";
import { fetchInstruments } from "../../services/instrumentServices";
import { mergeAvailabilities } from "../../utils/TeacherCreationUtils";
import ScheduleAvailability from "./ScheduleAvailability";
import { teacherValidationSchema } from "../validations/teacherValidationSchema";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateUserConfirm from "../Confirm/CreateUserConfirm";
import { useNavigate } from "react-router-dom";
//===================================================================================//
function CreateTeacherForm() {
  const times = [
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
  ];
  const [instruments, setInstruments] = useState([]);
  const navigate = useNavigate();
  //-----------------------------------------------//
  const initialValues = {
    user_first_name: "",
    user_last_name: "",
    teacher_phone: "",
    email: "",
    password: "",
    instruments: [],
    availability: [],
  };
  //-----------------------------------------------//
  const createUser = async (data, resetForm) => {
    try {
      const mergedAvailability = mergeAvailabilities(data.availability);
      const processedData = { ...data, availability: mergedAvailability };
      await createTeacher(processedData);
      toast.success("Teacher registered successfully!", {
        autoClose: 2000,
        position: "top-center",
      });
      resetForm();
    } catch (error) {
      toast.error(
        "Failed to create teacher account. " +
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
      message: "Are you sure you want to register Teacher",
      onConfirm: () => createUser(data, resetForm),
      createDetails: data,
    });
  };
  //-----------------------------------------------//
  useEffect(() => {
    fetchInstruments()
      .then(setInstruments)
      .catch(() => console.error("Failed to fetch instruments"));
  }, []);
  //====================================================================================//
  return (
    <div className={style.formParentContainer}>
      <h1>Create a Teacher Account</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={teacherValidationSchema}
      >
        {({ values, setFieldValue, errors, touched, resetForm }) => (
          <Form className={style.teacherFormContainer}>
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
                  <label htmlFor="">Phone</label>
                  <ErrorMessage
                    name="teacher_phone"
                    component="span"
                    className={style.errorMessage}
                  />
                </div>

                <Field name="teacher_phone">
                  {({ field, form }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g., 09123456789"
                      value={field.value.replace(/^(\+63|63)/, "0")}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, "");
                        if (value.startsWith("9")) {
                          value = `0${value}`;
                        }
                        form.setFieldValue("teacher_phone", value);
                      }}
                    />
                  )}
                </Field>
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
              <hr />
              <div className={`${style.formItem} ${style.teacherInstruments}`}>
                <div className={style.itemHeader}>
                  <label>Select Instruments:</label>
                  <ErrorMessage
                    name="instruments"
                    component="span"
                    className={style.errorMessage}
                  />
                </div>

                <div className={style.instrumentButtons}>
                  {instruments.map((instrument) => (
                    <button
                      key={instrument.instrument_id}
                      type="button"
                      className={
                        values.instruments.includes(instrument.instrument_id)
                          ? getInstrumentColor(instrument.instrument_name)
                          : ""
                      }
                      onClick={() => {
                        const updatedInstruments = values.instruments.includes(
                          instrument.instrument_id
                        )
                          ? values.instruments.filter(
                              (id) => id !== instrument.instrument_id
                            )
                          : [...values.instruments, instrument.instrument_id];

                        setFieldValue("instruments", updatedInstruments);
                      }}
                    >
                      {instrument.instrument_name}
                    </button>
                  ))}
                </div>
              </div>
              <hr />
            </div>

            {/*----------------------------------------------------------------------------*/}
            <div className={style.formSection}>
              <div className={`${style.formItem}`}>
                <div className={style.itemHeader}>
                  <label>Select Schedule Availability:</label>
                  {errors.availability &&
                    typeof errors.availability === "string" &&
                    touched.availability && (
                      <span className={style.errorMessage}>
                        {errors.availability}
                      </span>
                    )}
                </div>
                <ScheduleAvailability
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                />
              </div>
              {/*----------------------------------------------------------------------------*/}
              <div className={style.createUserButtons}>
                <button type="submit">Add Teacher</button>
                <button
                  type="reset"
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

export default CreateTeacherForm;
