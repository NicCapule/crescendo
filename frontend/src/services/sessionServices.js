import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchSessions = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "sessions/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const fetchUpcomingSessions = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "sessions/upcoming");
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const fetchSchedulesForValidation = async (selectedTeacherID) => {
  try {
    const response = await axios.get(API_BASE_URL + "sessions/schedules", {
      params: { teacherId: selectedTeacherID },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const fetchProgramDetailsBySessionId = async (selectedSessionId) => {
  try {
    const response = await axios.get(API_BASE_URL + "sessions/program", {
      params: { session_id: selectedSessionId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions of program!:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const rescheduleSession = async (rescheduleData) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}sessions/reschedule`,
      rescheduleData
    );
    return response.data;
  } catch (error) {
    console.error("Error rescheduling session!:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const forfeitSession = async (sessionId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}sessions/forfeit/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching program count:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const markAttendance = async (sessionId, attendance) => {
  const response = await axios.patch(
    `${API_BASE_URL}sessions/${sessionId}/attendance`,
    { attendance }
  );
  return response.data;
};
