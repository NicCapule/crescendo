import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchTeacherTable = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "teachers/table");
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const fetchTeacherById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}teachers/info/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const fetchTeacherSessions = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}teachers/sessions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sessions of teacher with ID ${id}:`, error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}teachers`, teacherData);
    return response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------//
export const fetchTeacherCount = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "teachers/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher count:", error);
    throw error;
  }
};
