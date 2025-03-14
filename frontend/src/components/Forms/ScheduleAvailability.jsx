import React from "react";
import { Field, ErrorMessage } from "formik";
import { DateTime } from "luxon";
import { PiCalendarPlusFill } from "react-icons/pi";
import { PiTrashFill } from "react-icons/pi";
import style from "./Forms.module.css";

function ScheduleAvailability({ values, setFieldValue, errors, touched }) {
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

  return (
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
        <tbody>
          {values.availability.map((_, index) => {
            return (
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
                          value={DateTime.fromFormat(time, "ha").toFormat(
                            "HH:mm:ss"
                          )}
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
                    <Field as="select" name={`availability.${index}.end_time`}>
                      <option value="" disabled>
                        Select End Time
                      </option>
                      {times.map((time, key) => (
                        <option
                          key={key}
                          value={DateTime.fromFormat(time, "ha").toFormat(
                            "HH:mm:ss"
                          )}
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
                      const updatedAvailability = values.availability.filter(
                        (_, i) => i !== index
                      );
                      setFieldValue("availability", updatedAvailability);
                    }}
                  >
                    <PiTrashFill />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={style.buttonRow}>
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
          <PiCalendarPlusFill />
          Add Availability
        </button>
      </div>
    </div>
  );
}

export default ScheduleAvailability;
