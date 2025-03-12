import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "../components/Dashboard/Dashboard.module.css";
import SummaryCard from "../components/Dashboard/SummaryCard";
import SessionsTable from "../components/Dashboard/SessionsTable";
import PendingPayments from "../components/Dashboard/PendingPayments";
import useAuth from "../hooks/useAuth";
import { fetchStudentCount } from "../services/studentServices";
import { fetchTeacherCount } from "../services/teacherServices";
import { fetchProgramCount } from "../services/programServices";

import { PiStudent, PiChalkboardTeacher, PiMusicNotes } from "react-icons/pi";

function Dashboard() {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState([]);
  const [totalPrograms, setTotalPrograms] = useState([]);
  const navigate = useNavigate();

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
            title="Active Programs"
            count={totalPrograms}
          />
        </div>

        {user?.role === "Admin" ? (
          <div className={style.pendingPayments}>
            <h2>Pending Payments</h2>
            <PendingPayments />
          </div>
        ) : null}

        <div className={style.quickActions}>
          <h2>Quick actions</h2>
          <div className={style.quickActionsButtons}>
            <button onClick={() => navigate("/enrollment")}>
              Enroll Student
            </button>
            <button onClick={() => navigate("/users/create/teacher")}>
              Add Teacher
            </button>
            {/* <button>Notify Student</button> */}
          </div>
        </div>
        {user?.role === "Admin" ? (
          <div className={style.upcomingSessions}>
            <h2>Upcoming Sessions</h2>
            <SessionsTable />
          </div>
        ) : (
          <div className={style.upcomingSessions}>
            <h2>Your Sessions for Today</h2>
            <SessionsTable />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
