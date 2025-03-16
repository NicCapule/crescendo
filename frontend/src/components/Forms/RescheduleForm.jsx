import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { Formik, Form, Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchSchedulesForValidation,
  rescheduleSession,
} from "../../services/sessionServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import {
  PiMusicNotesBold,
  PiChalkboardTeacherBold,
  PiStudentBold,
  PiCalendarCheckBold,
  PiListChecksBold,
} from "react-icons/pi";
import RescheduleConfirm from "../Confirm/RescheduleConfirm";
import { rescheduleValidationSchema } from "../validations/rescheduleValidationSchema";
import style from "./Forms.module.css";

//===================================================================================//

//===================================================================================//
function RescheduleForm() {
  const location = useLocation();
  const selectedProgram = location.state?.selectedProgram;
  const programSessions = location.state?.programSessions;
  const selectedSession = location.state?.selectedSession;
  const [scheduleData, setScheduleData] = useState(null);
  //-----------------------------------------------//
  const selectedSessionDetails = programSessions?.find(
    (session) => session.session_id === selectedSession
  );
  //-----------------------------------------------//
  const navigate = useNavigate();
  //-----------------------------------------------//
  const initialValues = {
    new_date: "",
    new_start_time: "",
    new_end_time: "",
  };
  //-----------------------------------------------//
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const startTime = DateTime.fromFormat(`${8 + i}`, "H");
    const endTime = startTime.plus({ hours: 1 });

    return {
      label: `${startTime.toFormat("h:mm a")} - ${endTime.toFormat("h:mm a")}`,
      startTime: startTime.toFormat("HH:mm:ss"),
      endTime: endTime.toFormat("HH:mm:ss"),
    };
  });
  //-----------------------------------------------//
  const reschedule = async (data, resetForm) => {
    try {
      const requestData = { session_id: selectedSession, ...data };
      await rescheduleSession(requestData);
      //   console.log(requestData);
      toast.success("Session rescheduled successfully!", {
        autoClose: 2000,
        position: "top-center",
      });
      resetForm();
    } catch (error) {
      toast.error(
        "Failed to reschedule session. " +
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
    RescheduleConfirm({
      title: "Confirm Reschedule",
      onConfirm: () => reschedule(data, resetForm),
      oldSchedule: {
        session_number: selectedSessionDetails.session_number,
        old_date: selectedSessionDetails.session_date,
        old_start_time: selectedSessionDetails.session_start,
        old_end_time: selectedSessionDetails.session_end,
      },
      newSchedule: data,
    });
  };
  //-----------------------------------------------//
  useEffect(() => {
    if (!selectedProgram.teacher_id) return;

    fetchSchedulesForValidation(selectedProgram.teacher_id)
      .then((scheduleData) => setScheduleData(scheduleData))
      .catch((error) => console.error("Failed to fetch schedules:", error));
  }, [selectedProgram.teacher_id]);
  //===================================================================================//
  return (
    <div
      className={`${style.formParentContainer} ${style.rescheduleParentSection}`}
    >
      <ToastContainer transition={Bounce} />
      <h1 className="pageTitle">Reschedule</h1>
      <div className={style.formHeader}>
        <div>
          <h3>Program Details</h3>
          <div className={style.programDetails}>
            <div>
              <p>
                <span>
                  <PiStudentBold />
                  Student:
                </span>
                {`${selectedProgram.Enrollment.Student.student_first_name} ${selectedProgram.Enrollment.Student.student_last_name}`}
              </p>
              <p>
                <span>
                  <PiChalkboardTeacherBold />
                  Teacher:
                </span>
                {`${selectedProgram.Teacher.User.user_first_name} ${selectedProgram.Teacher.User.user_last_name}`}
              </p>
              <div className={style.instrumentDetail}>
                <span>
                  <PiMusicNotesBold />
                  Instrument:
                </span>
                <div
                  className={`instContainer ${getInstrumentColor(
                    selectedProgram.Instrument.instrument_name
                  )}`}
                >{`${selectedProgram.Instrument.instrument_name}`}</div>
              </div>
            </div>
            <div>
              <p>
                <span>
                  <PiListChecksBold />
                  Number of Sessions:
                </span>
                {`${selectedProgram.no_of_sessions}`}
              </p>
              <p>
                <span>
                  <PiCalendarCheckBold />
                  Date Enrolled:
                </span>
                {`${DateTime.fromISO(
                  selectedProgram.Enrollment.enroll_date
                ).toFormat("MMMM d, yyyy")}`}
              </p>
            </div>
          </div>
        </div>

        <div className={style.sessionDetails}>
          <h3>Rescheduling Session: </h3>
          <p>
            Session Number: <b>{selectedSessionDetails.session_number}</b>
          </p>
          <p>
            Date:{" "}
            <b>
              {DateTime.fromISO(selectedSessionDetails.session_date).toFormat(
                "MMMM d, yyyy"
              )}
            </b>
          </p>
          <p>
            Time:{" "}
            <b>{`${DateTime.fromFormat(
              selectedSessionDetails.session_start,
              "HH:mm:ss"
            ).toFormat("h:mma")} - 
                                ${DateTime.fromFormat(
                                  selectedSessionDetails.session_end,
                                  "HH:mm:ss"
                                ).toFormat("h:mma")}`}</b>
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={rescheduleValidationSchema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={style.rescheduleFormContainer}>
            <div
              className={`${style.formSection} ${style.rescheduleFormSection}`}
            >
              <div className={`${style.formItem} ${style.newDateItem}`}>
                <div className={style.itemHeader}>
                  <label htmlFor="">New Date</label>
                </div>
                <div>
                  <DatePicker
                    selected={values.new_date}
                    onChange={(date) =>
                      setFieldValue(
                        "new_date",
                        DateTime.fromJSDate(date).toISODate()
                      )
                    }
                    dateFormat="MMMM d, yyyy"
                    className={style.datePicker}
                    placeholderText="Select Date"
                    name="new_date"
                    minDate={new Date()}
                    filterDate={(date) => {
                      const luxonDate = DateTime.fromJSDate(date);
                      const dayOfWeek = luxonDate.weekday;

                      const weekdayNames = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ];
                      const dayName = weekdayNames[dayOfWeek % 7];

                      const isAvailable = scheduleData.teacherAvailability.some(
                        (avail) => avail.day_of_week === dayName
                      );

                      return isAvailable;
                    }}
                  />

                  <ErrorMessage
                    name="new_date"
                    component="span"
                    className={style.errorMessage}
                  />
                </div>
              </div>
              <div className={style.formItem}>
                <div className={style.itemHeader}>
                  <label htmlFor="">New Time</label>
                </div>

                <div>
                  <Field
                    as="select"
                    name="new_start_time"
                    onChange={(e) => {
                      const selectedSlot = timeSlots.find(
                        (slot) => slot.startTime === e.target.value
                      );
                      setFieldValue("new_start_time", selectedSlot.startTime);
                      setFieldValue("new_end_time", selectedSlot.endTime);
                    }}
                  >
                    <option value="" disabled>
                      Select Time Slot
                    </option>

                    {timeSlots.map((slot, key) => {
                      const selectedDate = values.new_date;
                      let isDisabled = true;

                      if (selectedDate) {
                        const selectedDayOfWeek =
                          DateTime.fromISO(selectedDate).weekday;
                        const weekdayNames = [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ];
                        const dayName = weekdayNames[selectedDayOfWeek % 7];
                        const isAvailable =
                          scheduleData.teacherAvailability.some(
                            (avail) =>
                              avail.day_of_week === dayName &&
                              slot.startTime >= avail.start_time &&
                              slot.endTime <= avail.end_time
                          );

                        const hasTeacherSession =
                          scheduleData.teacherSessions.some(
                            (session) =>
                              session.session_date === selectedDate &&
                              session.session_start === slot.startTime
                          );

                        const sessionCount = scheduleData.allSessions.filter(
                          (session) =>
                            session.session_date === selectedDate &&
                            session.session_start === slot.startTime
                        ).length;
                        const hasSlotAvailability = sessionCount < 4;

                        const hasDrumSession =
                          scheduleData.occupiedDrumSlots.some(
                            (session) =>
                              session.session_date === selectedDate &&
                              session.session_start === slot.startTime
                          );

                        isDisabled =
                          !isAvailable ||
                          hasTeacherSession ||
                          !hasSlotAvailability ||
                          (selectedProgram.Instrument.instrument_name ===
                            "Drums" &&
                            hasDrumSession);
                      }

                      return (
                        <option
                          key={key}
                          value={slot.startTime}
                          disabled={isDisabled}
                        >
                          {slot.label}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="new_start_time"
                    component="span"
                    className={style.errorMessage}
                  />
                </div>
              </div>
              <div className={style.rescheduleButtons}>
                <button type="submit">Reschedule Session</button>
                <button type="reset" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <h3>Program Sessions</h3>
      <div className={style.sessionTable}>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Attendance</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {programSessions.map((session, index) => (
                <tr key={index}>
                  <td>{session.session_number}</td>
                  <td>
                    {DateTime.fromISO(session.session_date).toFormat(
                      "MMMM d, yyyy"
                    )}
                  </td>
                  <td>{`${DateTime.fromFormat(
                    session.session_start,
                    "HH:mm:ss"
                  ).toFormat("h:mma")} - 
                                  ${DateTime.fromFormat(
                                    session.session_end,
                                    "HH:mm:ss"
                                  ).toFormat("h:mma")}`}</td>
                  <td>{session.session_status}</td>
                  <td>{session.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RescheduleForm;
