import axios from "axios";
import API_BASE_URL from "../apiConfig";

export const fetchPendingPayments = async () => {
  try {
    const response = await axios.get(
      API_BASE_URL + "payments/pending-payments"
    );
    // console.log("Data fetched:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
};
