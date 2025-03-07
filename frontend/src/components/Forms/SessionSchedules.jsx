import React from "react";
import { Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import "react-datepicker/dist/react-datepicker.css";
import { PiCalendarPlusFill } from "react-icons/pi";
import { PiTrashFill } from "react-icons/pi";
import style from "./Forms.module.css";
//======================================================================//
function SessionSchedules({ values, setFieldValue, errors, touched }) {
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
                    {timeSlots.map((slot, key) => (
                      <option key={key} value={slot.startTime}>
                        {slot.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name={`sessionSchedules.${index}.session_start_time`}
                    component="span"
                    className={style.errorMessage}
                  />
                </div>
              </td>
              {/* <td>
                <div>
                  <Field
                    as="select"
                    name={`sessionSchedules.${index}.session_end_time`}
                  >
                    <option value="" disabled>
                      Select End Time
                    </option>
                    {times.map((time, key) => (
                      <option
                        key={key}
                        value={DateTime.fromFormat(time, "ha")
                          .toFormat("HH:mm:ss")
                          .toString()}
                      >
                        {time}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name={`sessionSchedules.${index}.session_end_time`}
                    component="span"
                    className={style.errorMessage}
                  />
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionSchedules;
