import React from "react";
import style from "./Teachers.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//------------------------------------------//
import {
  fetchTeacherById,
  fetchTeacherSessions,
} from "../../services/teacherServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
//------------------------------------------//
import WeekView from "../Calendar/WeekView";
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
        <h1>
          {teacher.User.user_first_name} {teacher.User.user_last_name}
        </h1>
        <p>Email: {teacher.User.email}</p>
        <p>Phone: {teacher.teacher_phone}</p>
        <div className={style.infoSection}>
          <h2>Schedule</h2>
          <WeekView sessions={sessions} hideTeacherFilters={true} />
        </div>
        <div className={style.infoSection}>
          <h2>Active Programs</h2>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Student</th>
                  <th>Sessions</th>
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
                            program.Instrument.instrument_name
                          )}`}
                        >
                          {program.Instrument.instrument_name}
                        </div>
                      </td>
                      <td>
                        {program.Enrollments[0]?.Student?.student_first_name
                          ? `${program.Enrollments[0].Student.student_first_name} ${program.Enrollments[0].Student.student_last_name}`
                          : program.Enrollments[0].Student.student_last_name}
                      </td>
                      <td>{program.no_of_sessions}</td>
                      <td>{program.status || "Ongoing"}</td>
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

export default TeacherInfo;
