import React from "react";
import { useState, useEffect } from "react";
import { fetchSessions } from "../../services/sessionServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { mergeConsecutiveSessions } from "../../utils/CalendarLayout";
import { DateTime } from "luxon";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

import style from "./Dashboard.module.css";

function SessionsTable() {
  const [listOfSessions, setListOfSessions] = useState([]);
  const mergedSessions = mergeConsecutiveSessions(listOfSessions);

  useEffect(() => {
    fetchSessions()
      .then(setListOfSessions)
      .catch(() => console.error("Failed to fetch sessions"));
  }, []);

  return (
    <>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Session</th>
              <th>Student</th>
              <th>Teacher</th>
              <th>Period</th>
            </tr>
          </thead>
          <tbody>
            {mergedSessions.map((value, key) => (
              <tr key={key}>
                <td>
                  <div
                    className={`instContainer ${getInstrumentColor(
                      value.Program.Instrument.instrument_name
                    )}`}
                  >
                    {value.Program.Instrument.instrument_name}
                  </div>
                </td>
                <td>
                  {value.session_numbers.length === 1
                    ? `${value.session_numbers[0]} of ${value.Program.no_of_sessions}`
                    : `${value.session_numbers[0]} - ${
                        value.session_numbers[value.session_numbers.length - 1]
                      } of ${value.Program.no_of_sessions}`}
                </td>
                <td>{value.Student.student_last_name}</td>
                <td>
                  {value.Program.Teacher.teacher_first_name}{" "}
                  {value.Program.Teacher.teacher_last_name}
                </td>
                <td>
                  {DateTime.fromFormat(
                    value.session_start,
                    "HH:mm:ss"
                  ).toFormat("h:mma")}{" "}
                  -{" "}
                  {DateTime.fromFormat(value.session_end, "HH:mm:ss").toFormat(
                    "h:mma"
                  )}
                </td>

                <td>
                  <button>
                    <PiDotsThreeOutlineVerticalFill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SessionsTable;
