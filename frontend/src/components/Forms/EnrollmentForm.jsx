import React from "react";
import { useEffect, useState } from "react";
import style from "./Forms.module.css";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DateTime } from "luxon";
import { fetchInstruments } from "../../services/instrumentServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import StudentSelection from "../Students/StudentSelection";
import TeacherSelection from "../Teachers/TeacherSelection";
import ScheduleAvailability from "./ScheduleAvailability";
import SessionSchedules from "./SessionSchedules";
import Select from "react-select";
import EnrollConfirm from "../Confirm/EnrollConfirm";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { customStyles } from "../../utils/SelectCustomStyles";
import { enrollValidationSchema } from "../validations/enrollValidationSchema";
import {
  enrollNewStudent,
  enrollExistingStudent,
} from "../../services/enrollServices";
import { fetchSchedulesForEnrollment } from "../../services/sessionServices";
function EnrollmentForm() {
  //-----------------------------------------------//
  const [instruments, setInstruments] = useState([]);
  const [selectedStudentID, setSelectedStudentID] = useState(null);
  const [selectedTeacherID, setSelectedTeacherID] = useState(null);
  const [activeTab, setActiveTab] = useState("select");
  const [scheduleData, setScheduleData] = useState(null);
  //-----------------------------------------------//
  const initialValues = {
    isNewStudent: false,
    student_id: null,
    student_first_name: "",
    student_last_name: "",
    student_address: "",
    student_age: "",
    student_email: "",
    student_phone: "",
    instrument: null,
    teacher_id: null,
    availability: [],
    noOfSessions: null,
    sessionSchedules: Array.from({ length: 8 }, () => ({
      session_date: "",
      session_start_time: "",
      session_end_time: "",
    })),
    payment_method: "",
    amount_paid: null,
  };

  const enrollStudent = async (data, resetForm) => {
    let requestData = { ...data };

    try {
      if (data.isNewStudent) {
        console.log("New Student Data: ", requestData);
        await enrollNewStudent(requestData);
      } else {
        const {
          student_first_name,
          student_last_name,
          student_address,
          student_age,
          student_email,
          student_phone,
          availability,
          ...filteredData
        } = requestData;

        console.log("Select Data: ", filteredData);
        await enrollExistingStudent(filteredData);
      }

      toast.success("Enrollment successful!", {
        autoClose: 2000,
        position: "top-center",
      });

      resetForm();
    } catch (error) {
      toast.error(
        "Failed to enroll student! " + (error.response?.data?.message || ""),
        {
          autoClose: 2000,
          position: "top-center",
        }
      );
    }
  };

  //-----------------------------------------------//
  const onSubmit = async (data, { resetForm }) => {
    EnrollConfirm({
      title: "Confirm Enrollment",
      message: "Are you sure you want to enroll",
      onConfirm: () => enrollStudent(data, resetForm),
      enrollmentDetails: data,
    });
  };
  //-----------------------------------------------//
  useEffect(() => {
    fetchInstruments()
      .then(setInstruments)
      .catch((error) => console.error("Failed to fetch instruments", error));
  }, []);

  useEffect(() => {
    if (!selectedTeacherID) return;

    fetchSchedulesForEnrollment(selectedTeacherID)
      .then((scheduleData) => setScheduleData(scheduleData))
      .catch((error) => console.error("Failed to fetch schedules:", error));
  }, [selectedTeacherID]);

  //====================================================================================//
  return (
    <div className={style.formParentContainer}>
      <ToastContainer transition={Bounce} />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={enrollValidationSchema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={style.enrollFormContainer}>
            <div className={style.tabButtonsContainer}>
              <button
                type="button"
                className={`${style.tabButton} ${
                  activeTab === "select" ? style.activeTab : ""
                }`}
                onClick={() => {
                  setActiveTab("select");
                  setFieldValue("isNewStudent", false);
                  setFieldValue("student_first_name", "");
                  setFieldValue("student_last_name", "");
                  setFieldValue("student_address", "");
                  setFieldValue("student_age", "");
                  setFieldValue("student_email", "");
                  setFieldValue("student_phone", "");
                  setFieldValue("availability", []);
                }}
              >
                Select Student
              </button>
              <button
                type="button"
                className={`${style.tabButton} ${
                  activeTab === "enroll" ? style.activeTab : ""
                }`}
                onClick={() => {
                  setActiveTab("enroll");
                  setFieldValue("isNewStudent", true);
                  setFieldValue("student_id", null);
                }}
              >
                Enroll New Student
              </button>
            </div>
            <div className={style.tabContent}>
              {activeTab === "select" && (
                <>
                  <hr />
                  <div
                    className={`${style.formSection} ${style.studentSelection}`}
                  >
                    <div>
                      <h3>Select Student</h3>
                      <ErrorMessage
                        name="student_id"
                        component="span"
                        className={style.errorMessage}
                      />
                    </div>
                    <StudentSelection
                      setFieldValue={setFieldValue}
                      isClearable={true}
                      value={values.student_id}
                    />
                  </div>
                </>
              )}
              {/* ========================================================================================================= */}
              {activeTab === "enroll" && (
                <>
                  <hr />
                  <div className={style.formSection}>
                    <h3>Enroll New Student</h3>
                    <hr />
                    <div className={style.newStudentForm}>
                      <div
                        className={`${style.formItem} ${style.firstNameItem}`}
                      >
                        <div className={style.itemHeader}>
                          <label htmlFor="">First Name</label>
                          <ErrorMessage
                            name="student_first_name"
                            component="span"
                            className={style.errorMessage}
                          />
                        </div>
                        <Field name="student_first_name" />
                      </div>
                      {/* --------------------------------------- */}
                      <div
                        className={`${style.formItem} ${style.lastNameItem}`}
                      >
                        <div className={style.itemHeader}>
                          <label htmlFor="">Last Name</label>
                          <ErrorMessage
                            name="student_last_name"
                            component="span"
                            className={style.errorMessage}
                          />
                        </div>
                        <Field name="student_last_name" />
                      </div>
                      {/* --------------------------------------- */}
                      <div className={`${style.formItem} ${style.ageItem}`}>
                        <div className={style.itemHeader}>
                          <label htmlFor="">Age</label>
                          <ErrorMessage
                            name="student_age"
                            component="span"
                            className={style.errorMessage}
                          />
                        </div>
                        <Field name="student_age" />
                      </div>
                      {/* --------------------------------------- */}
                      <div className={`${style.formItem} ${style.addressItem}`}>
                        <div className={style.itemHeader}>
                          <label htmlFor="">Address</label>
                          <ErrorMessage
                            name="student_address"
                            component="span"
                            className={style.errorMessage}
                          />
                        </div>
                        <Field name="student_address" />
                      </div>
                      {/* --------------------------------------- */}
                      <div className={`${style.formItem} ${style.phoneItem}`}>
                        <div className={style.itemHeader}>
                          <label htmlFor="">Phone</label>
                          <ErrorMessage
                            name="student_phone"
                            component="span"
                            className={style.errorMessage}
                          />
                        </div>
                        <Field name="student_phone">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="e.g., 09123456789"
                              value={field.value}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                if (value.startsWith("9")) {
                                  value = `0${value}`;
                                }
                                form.setFieldValue("student_phone", value);
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      {/* --------------------------------------- */}
                      <div className={`${style.formItem} ${style.emailItem}`}>
                        <div className={style.itemHeader}>
                          <label htmlFor="">Email</label>
                          <ErrorMessage
                            name="student_email"
                            component="span"
                            className={style.errorMessage}
                          />
                        </div>
                        <Field name="student_email" />
                      </div>
                    </div>

                    <hr />
                  </div>
                  <div className={style.formSection}>
                    <div
                      className={`${style.formItem} ${style.availabilityItem}`}
                    >
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
                  </div>
                </>
              )}
            </div>
            <hr />
            {/*----------------------------------------------------------------------------*/}
            <div className={`${style.formSection} ${style.programSection}`}>
              <div>
                <h3>Program</h3>
                {/* <hr /> */}
              </div>

              <div className={`${style.formItem} ${style.instrumentItem}`}>
                <div className={style.itemHeader}>
                  <label>Select Instrument:</label>
                  <ErrorMessage
                    name="instrument"
                    component="span"
                    className={style.errorMessage}
                  />
                </div>
                <div className={style.instrumentButtons}>
                  {instruments.map((i) => (
                    <button
                      key={i.instrument_id}
                      type="button"
                      className={
                        values.instrument === i.instrument_id
                          ? getInstrumentColor(i.instrument_name)
                          : ""
                      }
                      onClick={() => {
                        const selectedInstrument =
                          values.instrument === i.instrument_id
                            ? null
                            : i.instrument_id;
                        setFieldValue("instrument", selectedInstrument);
                        setFieldValue("instrument_name", i.instrument_name);
                        setFieldValue("teacher_id", null);
                      }}
                    >
                      {i.instrument_name}
                    </button>
                  ))}
                </div>
              </div>
              {/*----------------------------------------------------------------------------*/}
              {values.teacher_id && (
                <div className={`${style.formItem} ${style.noOfSessionsItem}`}>
                  <div className={style.itemHeader}>
                    <label>Number of Sessions</label>
                    <ErrorMessage
                      name="noOfSessions"
                      component="span"
                      className={style.errorMessage}
                    />
                  </div>
                  <Select
                    isSearchable={false}
                    styles={customStyles}
                    placeholder="8 or 16"
                    options={[
                      { value: 8, label: "8" },
                      { value: 16, label: "16" },
                    ]}
                    value={
                      values.noOfSessions
                        ? {
                            value: values.noOfSessions,
                            label: values.noOfSessions.toString(),
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setFieldValue("noOfSessions", selectedOption.value)
                    }
                  />
                </div>
              )}

              {values.instrument && (
                <div className={`${style.formItem} ${style.teacherItem}`}>
                  <div className={style.itemHeader}>
                    <label>Select Teacher</label>
                    <ErrorMessage
                      name="teacher_id"
                      component="span"
                      className={style.errorMessage}
                    />
                  </div>
                  <TeacherSelection
                    setSelectedTeacherID={setSelectedTeacherID}
                    setFieldValue={setFieldValue}
                    selectedInstrument={values.instrument}
                    values={values}
                    name="teacher_id"
                  />
                </div>
              )}
            </div>
            {/*----------------------------------------------------------------------------*/}
            {values.noOfSessions && (
              <div className={style.formSection}>
                <div
                  className={`${style.formItem} ${style.sessionScheduleItem}`}
                >
                  <div className={style.itemHeader}>
                    <label>Session Schedules</label>
                    {errors.sessionSchedules &&
                      typeof errors.sessionSchedules === "string" &&
                      touched.sessionSchedules && (
                        <span className={style.errorMessage}>
                          {errors.sessionSchedules}
                        </span>
                      )}
                  </div>
                  <SessionSchedules
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    teacherAvailability={scheduleData.teacherAvailability}
                    teacherSessions={scheduleData.teacherSessions}
                    allSessions={scheduleData.allSessions}
                    occupiedDrumSlots={scheduleData.occupiedDrumSlots}
                  />
                </div>
              </div>
            )}
            <hr />
            <div className={`${style.formSection} ${style.paymentSection}`}>
              <div>
                <h3>Payment</h3>
                {values.noOfSessions && (
                  <p>
                    Total:
                    <b>
                      {values.noOfSessions === 8
                        ? " PHP 7,000.00"
                        : " PHP 12,000.00"}
                    </b>
                  </p>
                )}
              </div>
              <div className={style.paymentRow}>
                <div className={`${style.formItem} ${style.paymentMethodItem}`}>
                  <div className={style.itemHeader}>
                    <label>Select Payment Method:</label>
                    <ErrorMessage
                      name="payment_method"
                      component="span"
                      className={style.errorMessage}
                    />
                  </div>
                  <div className={style.paymentMethodButtons}>
                    {["Cash", "GCash", "Bank Transfer"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        className={
                          values.payment_method === method
                            ? style.activePaymentMethodButton
                            : ""
                        }
                        onClick={() => {
                          setFieldValue("payment_method", method);
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`${style.formItem} ${style.amountPaidItem}`}>
                  <div className={style.itemHeader}>
                    <label htmlFor="">Amount Paid</label>
                    <ErrorMessage
                      name="amount_paid"
                      component="span"
                      className={style.errorMessage}
                    />
                  </div>
                  <Field name="amount_paid">
                    {({ field, form }) => (
                      <input
                        {...field}
                        placeholder="PHP"
                        value={field.value ? `PHP ${field.value}` : ""}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /[^\d]/g,
                            ""
                          );
                          form.setFieldValue("amount_paid", numericValue || "");
                        }}
                        onFocus={(e) => {
                          if (field.value === "0") {
                            form.setFieldValue("amount_paid", "");
                          }
                        }}
                        onBlur={() => {
                          if (!field.value) {
                            form.setFieldValue("amount_paid", "0");
                            form.setFieldValue("payment_method", "");
                          }
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </div>
            <hr />
            <div className={style.submissionButtons}>
              <button type="submit">Enroll</button>
              <button type="Reset">Reset</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EnrollmentForm;
