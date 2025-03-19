import React from "react";
import style from "./Students.module.css";
import { DateTime } from "luxon";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//------------------------------------------//
import {
  fetchStudentById,
  fetchStudentSessions,
} from "../../services/studentServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
//------------------------------------------//
import WeekView from "../Calendar/WeekView";
import { PiEnvelopeSimpleBold, PiPhoneBold } from "react-icons/pi";
//===================================================================================//
function StudentInfo() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  //-------------------------------------------------------//
  useEffect(() => {
    setLoading(true);

    Promise.all([fetchStudentById(id), fetchStudentSessions(id)])
      .then(([studentData, sessionData]) => {
        setStudent(studentData);
        setSessions(sessionData);
      })
      .catch((error) => {
        console.error("Failed to fetch student data:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);
  //-------------------------------------------------------//
  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Student not found</p>;
  //===================================================================================//
  return (
    <>
      <div className="compContainer">
        <div className={style.infoSection}>
          <h1>
            {student.student_first_name} {student.student_last_name}
          </h1>
          <div className={style.studentDetails}>
            <div className={style.contactInfo}>
              <PiEnvelopeSimpleBold />
              {student.student_email}
            </div>
            <div className={style.contactInfo}>
              <PiPhoneBold />
              {student.student_phone}
            </div>
          </div>
        </div>

        <div className={style.infoSection}>
          <h2>Schedule</h2>
          <WeekView sessions={sessions} />
        </div>
        <div className={style.infoSection}>
          <h2>Enrolled Programs</h2>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Teacher</th>
                  <th>Sessions</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {student.Enrollments && student.Enrollments.length > 0 ? (
                  student.Enrollments.map((enrollment, index) => (
                    <tr key={index}>
                      <td>
                        <div
                          key={index}
                          className={`instContainer ${getInstrumentColor(
                            enrollment.instrument
                          )}`}
                        >
                          {enrollment.instrument}
                        </div>
                      </td>
                      <td>{enrollment.teacher_name}</td>
                      <td>{enrollment.Program.no_of_sessions}</td>
                      <td>
                        {DateTime.fromISO(enrollment.enroll_date).toFormat(
                          "MMMM d, yyyy"
                        )}
                      </td>
                      <td
                        className={` ${
                          enrollment.Program.program_status === "Active"
                            ? style.activeStatus
                            : ""
                        }${
                          enrollment.Program.program_status === "Completed"
                            ? style.completedStatus
                            : ""
                        }${
                          enrollment.Program.program_status === "Forfeited"
                            ? style.forfeitedStatus
                            : ""
                        }`}
                      >
                        {enrollment.Program.program_status}
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
        </div>
      </div>
    </>
  );
}

export default StudentInfo;
