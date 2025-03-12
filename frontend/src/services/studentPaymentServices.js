import axios from "axios";
import API_BASE_URL from "../apiConfig";
//---------------------------------------------------------------------------------//
export const fetchStudentPaymentHistory = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}payments/payment-history/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching payments of student with ID ${id}:`, error);
    throw error;
  }
};
//---------------------------------------------------------------------------------//
export const fetchPendingPayments = async () => {
  try {
    const response = await axios.get(
      API_BASE_URL + "payments/pending-payments"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------//
export const addPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}payments`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error adding payment record:", error);
    throw error;
  }
};
