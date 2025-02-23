import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchProgramCount = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "programs/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching program count:", error);
    throw error;
  }
};
