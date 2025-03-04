import React from "react";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import DayView from "../components/Calendar/DayView";
import WeekView from "../components/Calendar/WeekView";
import { fetchTeacherSessions } from "../services/teacherServices";
//---------------------------------------------------------------------------//
function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role === "Teacher" && user.teacher_id) {
      setIsLoading(true);
      fetchTeacherSessions(user.teacher_id)
        .then((sessionData) => {
          setSessions(sessionData);
        })
        .catch((error) => console.error("Error fetching sessions:", error))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return <p>Loading user...</p>;
  }
  //===========================================================================================//
  return (
    <>
      <h1 className="pageTitle">Schedule</h1>
      {user.role === "Teacher" && (
        <div>
          <h2>Your Schedule</h2>
          {!isLoading ? (
            <WeekView sessions={sessions} hideTeacherFilters={true} />
          ) : (
            <p>Loading schedule...</p>
          )}
        </div>
      )}
      <h2>All Schedules</h2>
      <DayView />
    </>
  );
}

export default Schedule;
