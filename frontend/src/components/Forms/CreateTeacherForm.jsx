import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./Forms.module.css";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DateTime } from "luxon";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { createTeacher } from "../../services/teacherServices";
import { fetchInstruments } from "../../services/instrumentServices";
import { mergeAvailabilities } from "../../utils/TeacherCreationUtils";
import { PiTrashFill } from "react-icons/pi";
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
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is a required field."),
    user_first_name: Yup.string(),
    user_last_name: Yup.string().required("Last name is a required field."),
    teacher_phone: Yup.string()
      .matches(/^09\d{9}$/, "Invalid phone number.")
      .required("Phone number is required."),
    password: Yup.string().required("Password is a required field."),
    instruments: Yup.array().min(
      1,
      "At least one instrument must be selected."
    ), //-----------------------------------------------//
    availability: Yup.array()
      .of(
        Yup.object().shape({
          day_of_week: Yup.string().required("Day is required."),
          start_time: Yup.string().required("Start time is required."),
          end_time: Yup.string()
            .required("End time is required.")
            .test(
              "is-after-start",
              "End time must be after start time.",
              function (end_time) {
                const { start_time } = this.parent;
                if (!start_time || !end_time) return false;

                const start = DateTime.fromFormat(start_time, "HH:mm:ss");
                const end = DateTime.fromFormat(end_time, "HH:mm:ss");

                return end > start;
              }
            ),
        })
      )
      .min(1, "At least one availability slot must be selected.")
      .test(
        "no-duplicate-entries",
        "Duplicate availability entries are not allowed.",
        (availability) => {
          const seen = new Set();
          return availability.every(({ day_of_week, start_time, end_time }) => {
            const key = `${day_of_week}-${start_time}-${end_time}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
      )
      .test(
        "no-overlapping-times",
        "Availability slots cannot overlap.",
        (availability) => {
          const dayOrder = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
          };
          const sortedAvailability = [...availability].sort((a, b) => {
            return (
              dayOrder[a.day_of_week] - dayOrder[b.day_of_week] ||
              a.start_time - b.start_time
            );
          });
          for (let i = 0; i < sortedAvailability.length - 1; i++) {
            const {
              day_of_week: day1,
              start_time: start1,
              end_time: end1,
            } = sortedAvailability[i];

            const { day_of_week: day2, start_time: start2 } =
              sortedAvailability[i + 1];

            if (day1 === day2) {
              if (end1 > start2) {
                return false;
              }
            }
          }
          return true;
        }
      ),
  });
  //-----------------------------------------------//
  const onSubmit = async (data) => {
    // try {
    const mergedAvailability = mergeAvailabilities(data.availability);
    const processedData = { ...data, availability: mergedAvailability };
    // console.log("Data: ", data.availability);
    // console.log("Merged: ", processedData);
    await createTeacher(processedData); // Ensure API call is awaited
    alert("Teacher created successfully!"); // Handle success feedback
    // } catch (error) {
    //   console.error("Error creating teacher:", error);
    //   alert("Failed to create teacher. Please try again.");
    // }
  };
  //-----------------------------------------------//
  useEffect(() => {
    fetchInstruments()
      .then(setInstruments)
      .catch(() => console.error("Failed to fetch instruments"));
  }, []);
  //====================================================================================//
  return (
    <div className={style.createContainer}>
      <h1>Create a Teacher Account</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={style.formContainer}>
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
            </div>
            <hr />

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
                                  <option value="Wednesday">Wednesday</option>
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
              {/*----------------------------------------------------------------------------*/}
              <button type="submit">Add Teacher</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateTeacherForm;
