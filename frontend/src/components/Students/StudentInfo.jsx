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
        <h1>
          Name: {student.student_first_name} {student.student_last_name}
        </h1>
        <p>Email: {student.student_email}</p>
        <p>Phone: {student.student_phone}</p>
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
                            enrollment.Program.Instrument.instrument_name
                          )}`}
                        >
                          {enrollment.Program.Instrument.instrument_name}
                        </div>
                      </td>
                      <td>
                        {enrollment.Program.Teacher.teacher_first_name
                          ? `${enrollment.Program.Teacher.teacher_first_name} ${enrollment.Program.Teacher.teacher_last_name}`
                          : `${enrollment.Program.Teacher.teacher_last_name}`}
                      </td>
                      <td>{enrollment.Program.no_of_sessions}</td>
                      <td>
                        {DateTime.fromISO(enrollment.enroll_date).toFormat(
                          "MMMM d, yyyy"
                        )}
                      </td>
                      <td>{enrollment.enrollment_status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No assigned Programs</td>
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
