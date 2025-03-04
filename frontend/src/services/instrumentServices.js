import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchInstruments = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "instruments");
    return response.data;
  } catch (error) {
    console.error("Error fetching instruments:", error);
    throw error;
  }
};
