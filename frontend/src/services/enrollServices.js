import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const enrollNewStudent = async (enrollmentData) => {
  try {
    const response = await axios.post(
      API_BASE_URL + "enroll/new-student",
      enrollmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling new student:", error);
    throw error;
  }
};

export const enrollExistingStudent = async (enrollmentData) => {
  try {
    const response = await axios.post(
      API_BASE_URL + "enroll/existing-student",
      enrollmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling existing student:", error);
    throw error;
  }
};
