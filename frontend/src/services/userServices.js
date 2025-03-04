import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(API_BASE_URL + "login", userData);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users`, adminData);
    return response.data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};
