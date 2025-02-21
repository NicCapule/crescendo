import React, { useState, useEffect } from "react";
import style from "../components/Dashboard/Dashboard.module.css";
import SummaryCard from "../components/Dashboard/SummaryCard ";

import { fetchStudentCount } from "../services/studentServices";
import { fetchTeacherCount } from "../services/teacherServices";

import { PiStudent, PiChalkboardTeacher } from "react-icons/pi";

function Dashboard() {
  const [totalStudents, setTotalStudents] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState([]);
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

  return (
    <div>
      <h1 className="pageTitle">Dashboard</h1>
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
      </div>
    </div>
  );
}

export default Dashboard;
