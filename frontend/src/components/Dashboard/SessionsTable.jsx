import React from "react";
import { useState, useEffect } from "react";
import { fetchUpcomingSessions } from "../../services/sessionServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import {
  mergeConsecutiveSessions,
  groupSessionsByDate,
} from "../../utils/CalendarLayout";
import { DateTime } from "luxon";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";

import style from "./Dashboard.module.css";

function SessionsTable() {
  const [listOfSessions, setListOfSessions] = useState([]);
  // const [mergedSessions, setMergedSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate());

  useEffect(() => {
    fetchUpcomingSessions()
      .then((sessions) => {
        setListOfSessions(sessions);
      })
      .catch(() => console.error("Failed to fetch sessions"));
  }, []);
  //---------------------------------------------------------------------------//
  const filteredSessions = listOfSessions.filter(
    (session) =>
      DateTime.fromISO(session.session_date).toISODate() === selectedDate
  );

  //---------------------------------------------------------------------------//
  const mergedSessions = mergeConsecutiveSessions(filteredSessions);

  // console.log("Merged Sessions:", mergedSessions);
  //=============================================================================================//
  return (
    <>
      <div className="tableContainer">
        <div className={style.dateNav}>
          <button
            className={
              selectedDate === DateTime.now().toISODate()
                ? style.disabled
                : style.calendarArrow
            }
            onClick={() =>
              setSelectedDate(
                DateTime.fromISO(selectedDate).minus({ days: 1 }).toISODate()
              )
            }
            disabled={selectedDate === DateTime.now().toISODate()}
          >
            <MdOutlineArrowBackIos />
          </button>
          <div className={style.dateContainer}>
            <span>
              {DateTime.fromISO(selectedDate).toFormat("EEEE, MMMM d, yyyy")}
            </span>
          </div>

          <button
            className={style.calendarArrow}
            onClick={() =>
              setSelectedDate(
                DateTime.fromISO(selectedDate).plus({ days: 1 }).toISODate()
              )
            }
          >
            <MdOutlineArrowForwardIos />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Session</th>
              <th>Student</th>
              <th>Teacher</th>
              <th>Period</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {mergedSessions.map((session, index) => (
              <tr key={index}>
                <td>
                  <div
                    className={`instContainer ${getInstrumentColor(
                      session.Program.Instrument.instrument_name
                    )}`}
                  >
                    {session.Program.Instrument.instrument_name}
                  </div>
                </td>
                <td>
                  {session.session_numbers.length === 1
                    ? `${session.session_numbers[0]} of ${session.Program.no_of_sessions}`
                    : `${session.session_numbers[0]} - ${
                        session.session_numbers[
                          session.session_numbers.length - 1
                        ]
                      } of ${session.Program.no_of_sessions}`}
                </td>
                <td>{`${session.Student.student_first_name} ${session.Student.student_last_name}`}</td>
                <td>
                  {`${session.Program.Teacher.User.user_first_name} ${session.Program.Teacher.User.user_last_name}`}
                </td>
                <td>
                  {DateTime.fromFormat(
                    session.session_start,
                    "HH:mm:ss"
                  ).toFormat("h:mma")}{" "}
                  -{" "}
                  {DateTime.fromFormat(
                    session.session_end,
                    "HH:mm:ss"
                  ).toFormat("h:mma")}
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
