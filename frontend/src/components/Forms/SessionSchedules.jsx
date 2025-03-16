import React from "react";
import { Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import "react-datepicker/dist/react-datepicker.css";
import { PiCalendarPlusFill } from "react-icons/pi";
import { PiTrashFill } from "react-icons/pi";
import style from "./Forms.module.css";
import { date } from "yup";
//======================================================================//
function SessionSchedules({
  values,
  setFieldValue,
  errors,
  touched,
  teacherAvailability,
  teacherSessions,
  allSessions,
  occupiedDrumSlots,
}) {
  //-------------------------------------------------------------------//
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const startTime = DateTime.fromFormat(`${8 + i}`, "H");
    const endTime = startTime.plus({ hours: 1 });

    return {
      label: `${startTime.toFormat("h:mm a")} - ${endTime.toFormat("h:mm a")}`,
      startTime: startTime.toFormat("HH:mm:ss"),
      endTime: endTime.toFormat("HH:mm:ss"),
    };
  });
  //======================================================================//
  return (
    <div className={style.sessionSchedulesTableContainer}>
      <table>
        <thead>
          <tr>
            <th />
            <th>Date</th>
            <th>Start Time - End Time</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: values.noOfSessions }, (_, index) => (
            <tr key={index}>
              <td>
                <p>Session {index + 1}</p>
              </td>
              <td>
                <div>
                  <DatePicker
                    selected={
                      values.sessionSchedules[index]?.session_date || null
                    }
                    onChange={(date) =>
                      setFieldValue(
                        `sessionSchedules.${index}.session_date`,
                        DateTime.fromJSDate(date).toISODate()
                      )
                    }
                    dateFormat="MMMM d, yyyy"
                    className={style.datePicker}
                    placeholderText="Select Date"
                    name={`sessionSchedules.${index}.session_date`}
                    minDate={new Date()}
                    filterDate={(date) => {
                      const luxonDate = DateTime.fromJSDate(date);
                      const dayOfWeek = luxonDate.weekday; // 1 = Monday, 7 = Sunday

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

                      const isAvailable = teacherAvailability.some(
                        (avail) => avail.day_of_week === dayName
                      );

                      const isEarlierThanPrevSessions = values.sessionSchedules
                        .slice(0, index) // Only consider previous sessions
                        .some((session) => {
                          const prevSessionDate = session?.session_date;
                          return (
                            prevSessionDate &&
                            luxonDate <= DateTime.fromISO(prevSessionDate)
                          );
                        });

                      if (isEarlierThanPrevSessions) return false;

                      return isAvailable;
                    }}
                  />

                  <ErrorMessage
                    name={`sessionSchedules.${index}.session_date`}
                    component="span"
                    className={style.errorMessage}
                  />
                </div>
              </td>
              <td>
                <div>
                  <Field
                    as="select"
                    name={`sessionSchedules.${index}.session_start_time`}
                    onChange={(e) => {
                      const selectedSlot = timeSlots.find(
                        (slot) => slot.startTime === e.target.value
                      );
                      setFieldValue(
                        `sessionSchedules.${index}.session_start_time`,
                        selectedSlot.startTime
                      );
                      setFieldValue(
                        `sessionSchedules.${index}.session_end_time`,
                        selectedSlot.endTime
                      );
                    }}
                  >
                    <option value="" disabled>
                      Select Time Slot
                    </option>
                    {/* {timeSlots.map((slot, key) => (
                      <option key={key} value={slot.startTime}>
                        {slot.label}
                      </option>
                    ))} */}

                    {timeSlots.map((slot, key) => {
                      const selectedDate =
                        values.sessionSchedules[index]?.session_date;
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

                        // Check if teacher is available
                        const isAvailable = teacherAvailability.some(
                          (avail) =>
                            avail.day_of_week === dayName &&
                            slot.startTime >= avail.start_time &&
                            slot.endTime <= avail.end_time
                        );

                        // Check if teacher has a session at this time
                        const hasTeacherSession = teacherSessions.some(
                          (session) =>
                            session.session_date === selectedDate &&
                            session.session_start === slot.startTime
                        );

                        // Check max 4 concurrent sessions per slot
                        const sessionCount = allSessions.filter(
                          (session) =>
                            session.session_date === selectedDate &&
                            session.session_start === slot.startTime
                        ).length;
                        const hasSlotAvailability = sessionCount < 4;

                        const hasDrumSession = occupiedDrumSlots.some(
                          (session) =>
                            session.session_date === selectedDate &&
                            session.session_start === slot.startTime
                        );

                        // Allow only if available, no session conflict, and within max sessions
                        // isDisabled =
                        //   !isAvailable ||
                        //   hasTeacherSession ||
                        //   !hasSlotAvailability ||
                        //   hasDrumSession;

                        isDisabled =
                          !isAvailable ||
                          hasTeacherSession ||
                          !hasSlotAvailability ||
                          (values.instrument_name === "Drums" &&
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
                    name={`sessionSchedules.${index}.session_start_time`}
                    component="span"
                    className={style.errorMessage}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionSchedules;
