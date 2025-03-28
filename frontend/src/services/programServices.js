import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchProgramCount = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "programs/active/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching program count:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const fetchProgramDetailsByProgramId = async (selectedProgramId) => {
  try {
    const response = await axios.get(API_BASE_URL + "programs/details", {
      params: { program_id: selectedProgramId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions of program!:", error);
    throw error;
  }
};
//----------------------------------------------------------------------------------//
export const forfeitProgram = async (programId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}programs/forfeit/${programId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching program count:", error);
    throw error;
  }
};
