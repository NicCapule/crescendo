import React, { useState, useEffect } from "react";
import style from "../components/Dashboard/Dashboard.module.css";
import SummaryCard from "../components/Dashboard/SummaryCard";
import SessionsTable from "../components/Dashboard/SessionsTable";
import PendingPayments from "../components/Dashboard/PendingPayments";

import { fetchStudentCount } from "../services/studentServices";
import { fetchTeacherCount } from "../services/teacherServices";
import { fetchProgramCount } from "../services/programServices";

import { PiStudent, PiChalkboardTeacher, PiMusicNotes } from "react-icons/pi";

function TeacherDashboard() {
  const [totalStudents, setTotalStudents] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState([]);
  const [totalPrograms, setTotalPrograms] = useState([]);

  useEffect(() => {
    fetchStudentCount()
      .then(setTotalStudents)
      .catch(() => console.error("Failed to fetch total students."));
  }, []);

  useEffect(() => {
    fetchTeacherCount()
      .then(setTotalTeachers)
      .catch(() => console.error("Failed to fetch total teachers."));
  }, []);

  useEffect(() => {
    fetchProgramCount()
      .then(setTotalPrograms)
      .catch(() => console.error("Failed to fetch total programs."));
  }, []);

  return (
    <div>
      <h1 className="pageTitle">Dashboard</h1>
      <div className={`${style.rowContainer} compContainer`}>
        <div className={style.summaryCards}>
          <SummaryCard
            icon={PiStudent}
            title="Total Students"
            count={totalStudents}
          />

          <SummaryCard
            icon={PiChalkboardTeacher}
            title="Total Teachers"
            count={totalTeachers}
          />

          <SummaryCard
            icon={PiMusicNotes}
            title="Total Programs"
            count={totalPrograms}
          />
        </div>

        <div className={style.quickActions}>
          <h2>Quick actions</h2>
          <div className={style.quickActionsButtons}>
            <button>Enroll Student</button>
            <button>Add Teacher</button>
            <button>Notify Student</button>
            <button>Notify Student</button>
          </div>
        </div>
        <div className={style.upcomingSessions}>
          <h2>Upcoming Sessions</h2>
          <SessionsTable />
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
