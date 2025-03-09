import React from "react";
import { useState, useEffect } from "react";
import { fetchSessions } from "../../services/sessionServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import {
  mergeConsecutiveSessions,
  groupSessionsByDate,
} from "../../utils/CalendarLayout";
import { DateTime } from "luxon";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";

import style from "./Dashboard.module.css";

function SessionsTable() {
  const [listOfSessions, setListOfSessions] = useState([]);
  const [groupedSessions, setGroupedSessions] = useState([]);

  useEffect(() => {
    fetchSessions()
      .then((sessions) => {
        setListOfSessions(sessions);
      })
      .catch(() => console.error("Failed to fetch sessions"));
  }, []);

  //---------------------------------------------------------------------------//
  useEffect(() => {
    if (!listOfSessions.length) return;

    const merged = mergeConsecutiveSessions(listOfSessions);
    const grouped = groupSessionsByDate(merged);

    setGroupedSessions(grouped);
    // console.log("Merged Sessions:", merged);
  }, [listOfSessions]);

  // console.log("Grouped Sessions:", groupedSessions);

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
              <th />
            </tr>
          </thead>
          <tbody>
            {groupedSessions.map(({ date, sessions }) => (
              <React.Fragment key={date}>
                {/* Row for session date */}
                <tr className={style.dateRow}>
                  <td colSpan="6">
                    <div className={style.dateContainer}>
                      {DateTime.fromISO(date).toFormat("MMMM d, yyyy")}
                    </div>
                  </td>
                </tr>

                {/* Rows for each session */}
                {sessions.map((session) => (
                  <tr key={session.session_id}>
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
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SessionsTable;
