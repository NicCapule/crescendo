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
export const fetchSchedulesForEnrollment = async (selectedTeacherID) => {
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
