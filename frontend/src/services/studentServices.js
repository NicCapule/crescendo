import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchStudentTable = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "students/table");
    // console.log("Data fetched:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const fetchStudentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}students/info/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const fetchStudentSessions = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}students/sessions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sessions of student with ID ${id}:`, error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}students/${studentId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.details ||
      error.response?.data?.error ||
      "Failed to delete student.";
    console.log(`Cannot delete student:`, errorMessage);
    throw new Error(errorMessage);
  }
};
//---------------------------------------------------------------------------------//
export const fetchStudentCount = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "students/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching student count:", error);
    throw error;
  }
};
