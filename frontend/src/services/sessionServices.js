import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchSessions = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "sessions");
    console.log("Data fetched:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
};
