import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchUserTable = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "users/table");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(API_BASE_URL + "login", userData);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const createAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users`, adminData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}users/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.details ||
      error.response?.data?.error ||
      "Failed to delete user.";
    console.log(`Cannot delete user:`, errorMessage);
    throw new Error(errorMessage);
  }
};
//---------------------------------------------------------------------------------//
export const updateName = async (userId, user_first_name, user_last_name) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}users/${userId}/update/name`,
      { user_first_name, user_last_name }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating name of user with ID ${userId}:`, error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const updateEmail = async (userId, email) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}users/${userId}/update/email`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating email of user with ID ${userId}:`, error);
    throw error;
  }
};

//---------------------------------------------------------------------------------//
export const updatePassword = async (userId, oldPassword, newPassword) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}users/${userId}/update/password`,
      { oldPassword, newPassword }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.details ||
      error.response?.data?.error ||
      "Failed to update password.";
    console.log(`Cannot update password:`, errorMessage);
    throw new Error(errorMessage);
  }
};
