import React from "react";
import style from "./Teachers.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
//------------------------------------------//
import {
  fetchTeacherById,
  fetchTeacherSessions,
} from "../../services/teacherServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
//------------------------------------------//
import WeekView from "../Calendar/WeekView";
import { PiEnvelopeSimpleBold, PiPhoneBold } from "react-icons/pi";
//===================================================================================//
function TeacherInfo() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  //-------------------------------------------------------//
  useEffect(() => {
    setLoading(true);

    Promise.all([fetchTeacherById(id), fetchTeacherSessions(id)])
      .then(([teacherData, sessionData]) => {
        setTeacher(teacherData);
        setSessions(sessionData);
      })
      .catch((error) => {
        console.error("Failed to fetch teacher data:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);
  //-------------------------------------------------------//
  if (loading) return <p>Loading...</p>;
  if (!teacher) return <p>Teacher not found</p>;
  //-------------------------------------------------------//
  return (
    <>
      <div className="compContainer">
        <div className={style.infoSection}>
          <h1>
            {teacher.User.user_first_name} {teacher.User.user_last_name}
          </h1>
          <div className={style.teacherDetails}>
            <div>
              <div className={style.contactInfo}>
                <PiEnvelopeSimpleBold />
                {teacher.User.email}
              </div>
              <div className={style.contactInfo}>
                <PiPhoneBold />
                {teacher.teacher_phone}
              </div>
            </div>
            <div>
              <p>Instruments:</p>
              <div className={style.teacherInstruments}>
                {teacher.Instruments.map((instrument, index) => (
                  <div
                    key={index}
                    className={`${style.instContainer} ${getInstrumentColor(
                      instrument.instrument_name
                    )}`}
                  >
                    {instrument.instrument_name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={style.infoSection}>
          <h2>Schedule</h2>
          <WeekView sessions={sessions} hideTeacherFilters={true} />
        </div>
        <div className={style.infoSection}>
          <h2>Assigned Programs</h2>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Student</th>
                  <th>Sessions</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {teacher.Programs && teacher.Programs.length > 0 ? (
                  teacher.Programs.map((program, index) => (
                    <tr key={index}>
                      <td>
                        <div
                          className={`instContainer ${getInstrumentColor(
                            program.Enrollment.instrument
                          )}`}
                        >
                          {program.Enrollment.instrument}
                        </div>
                      </td>
                      <td>{program.Enrollment.student_name}</td>
                      <td>{program.no_of_sessions}</td>
                      <td>
                        {DateTime.fromISO(
                          program.Enrollment.enroll_date
                        ).toFormat("MMMM d, yyyy ")}
                      </td>

                      <td
                        className={` ${
                          program.program_status === "Active"
                            ? style.activeStatus
                            : ""
                        }${
                          program.program_status === "Completed"
                            ? style.completedStatus
                            : ""
                        }${
                          program.program_status === "Forfeited"
                            ? style.forfeitedStatus
                            : ""
                        }`}
                      >
                        {program.program_status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={style.noRecord}>
                    <td colSpan="5">No assigned Programs</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ============================================================================================================= */}

          <h2>Salary History</h2>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Sessions</th>
                  <th>Salary</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {teacher.TeacherSalaries &&
                teacher.TeacherSalaries.length > 0 ? (
                  teacher.TeacherSalaries.map((salary, index) => (
                    <tr key={index}>
                      <td>
                        {DateTime.fromISO(salary.salary_date).toFormat(
                          "MMMM d, yyyy "
                        )}
                      </td>
                      <td>{salary.total_sessions}</td>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "PHP",
                        }).format(salary.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={style.noRecord}>
                    <td colSpan="3">No salary records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherInfo;
