import React from "react";
import { useEffect, useState } from "react";
import style from "./Forms.module.css";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DateTime } from "luxon";
import { fetchInstruments } from "../../services/instrumentServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import StudentSelection from "../Students/StudentSelection";
import { PiTrashFill } from "react-icons/pi";

function EnrollmentForm() {
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
  //-----------------------------------------------//
  const [instruments, setInstruments] = useState([]);
  const [selectedStudentID, setSelectedStudentID] = useState(null);
  const [activeTab, setActiveTab] = useState("select");
  //-----------------------------------------------//
  const initialValues = {
    student_id: null,
    student_first_name: "",
    student_last_name: "",
    student_address: "",
    student_age: "",
    student_email: "",
    student_phone: "",
    instrument: null,
    availability: [],
  };

  //-----------------------------------------------//
  const onSubmit = async (data) => {
    console.log("selectedStudentID: ", selectedStudentID);
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
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        // validationSchema={validationSchema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={style.enrollFormContainer}>
            <div className={style.tabButtonsContainer}>
              <button
                className={`${style.tabButton} ${
                  activeTab === "select" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("select")}
              >
                Select Student
              </button>
              <button
                className={`${style.tabButton} ${
                  activeTab === "enroll" ? style.activeTab : ""
                }`}
                onClick={() => setActiveTab("enroll")}
              >
                Enroll New Student
              </button>
            </div>
            <div className={style.tabContent}>
              {activeTab === "select" && (
                <div
                  className={`${style.formSection} ${style.studentSelection}`}
                >
                  <h3>Select Student</h3>
                  <hr />
                  <StudentSelection
                    setSelectedStudentID={setSelectedStudentID}
                  />
                </div>
              )}
              {activeTab === "enroll" && (
                <div className={style.formSection}>
                  <h3>Add New Student</h3>
                  <hr />
                  <div className={style.newStudentForm}>
                    <div className={`${style.formItem} ${style.firstNameItem}`}>
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
                    <div className={`${style.formItem} ${style.lastNameItem}`}>
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
                      <Field name="student_address" />
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
                      <Field name="student_last_name" />
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
                              let value = e.target.value.replace(/[^0-9]/g, "");
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
                  <div className={style.formItem}>
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
                    <div className={style.availabilityTableContainer}>
                      <table>
                        <thead>
                          <tr>
                            <th>Day of the Week</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th />
                          </tr>
                        </thead>

                        {values.availability.map((_, index) => {
                          return (
                            <tbody>
                              <tr key={index}>
                                <td>
                                  <div className={style.selectContainer}>
                                    <Field
                                      as="select"
                                      name={`availability.${index}.day_of_week`}
                                    >
                                      <option value="" disabled>
                                        Select Day
                                      </option>
                                      <option value="Monday">Monday</option>
                                      <option value="Tuesday">Tuesday</option>
                                      <option value="Wednesday">
                                        Wednesday
                                      </option>
                                      <option value="Thursday">Thursday</option>
                                      <option value="Friday">Friday</option>
                                      <option value="Saturday">Saturday</option>
                                      <option value="Sunday">Sunday</option>
                                    </Field>
                                    <ErrorMessage
                                      name={`availability.${index}.day_of_week`}
                                      component="span"
                                      className={style.errorMessage}
                                    />
                                  </div>
                                </td>

                                <td>
                                  <div>
                                    <Field
                                      as="select"
                                      name={`availability.${index}.start_time`}
                                    >
                                      <option value="" disabled>
                                        Select Start Time
                                      </option>
                                      {times.map((time, key) => (
                                        <option
                                          key={key}
                                          value={DateTime.fromFormat(
                                            time,
                                            "ha"
                                          ).toFormat("HH:mm:ss")}
                                        >
                                          {time}
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`availability.${index}.start_time`}
                                      component="span"
                                      className={style.errorMessage}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <Field
                                      as="select"
                                      name={`availability.${index}.end_time`}
                                    >
                                      <option value="" disabled>
                                        Select Start Time
                                      </option>
                                      {times.map((time, key) => (
                                        <option
                                          key={key}
                                          value={DateTime.fromFormat(
                                            time,
                                            "ha"
                                          ).toFormat("HH:mm:ss")}
                                        >
                                          {time}
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`availability.${index}.end_time`}
                                      component="span"
                                      className={style.errorMessage}
                                    />
                                  </div>
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    className={style.removeButton}
                                    onClick={() => {
                                      const updatedAvailability =
                                        values.availability.filter(
                                          (_, i) => i !== index
                                        );
                                      setFieldValue(
                                        "availability",
                                        updatedAvailability
                                      );
                                    }}
                                  >
                                    <PiTrashFill />
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("availability", [
                            ...values.availability,
                            { day_of_week: "", start_time: "", end_time: "" },
                          ]);
                        }}
                        className={style.addAvailabilityButton}
                      >
                        Add Availability
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/*----------------------------------------------------------------------------*/}
            <div className={style.formSection}>
              <div className={style.formItem}>
                <div className={style.itemHeader}>
                  <label>Select Instrument:</label>
                  <ErrorMessage
                    name="instruments"
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
                      }}
                    >
                      {i.instrument_name}
                    </button>
                  ))}
                </div>
              </div>

              {/*----------------------------------------------------------------------------*/}
              <button type="submit">Enroll</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EnrollmentForm;
