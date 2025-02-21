import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchStudentCount = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "students/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching student count:", error);
    throw error;
  }
};
