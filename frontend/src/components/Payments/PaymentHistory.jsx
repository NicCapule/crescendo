import React from "react";
import { DateTime } from "luxon";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "./Payments.module.css";
import StudentSelection from "../Students/StudentSelection";
import { fetchStudentPaymentHistory } from "../../services/studentPaymentServices";
//===================================================================================//

function PaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  //---------------------------------------------------------------//

  const handleStudentChange = async (selectedOption) => {
    if (!selectedOption) {
      setSelectedStudent(null);
      setPaymentHistory([]);
      return;
    }

    const studentId = selectedOption.value;
    setSelectedStudent(studentId);
    setLoading(true);

    try {
      const studentPayments = await fetchStudentPaymentHistory(studentId);
      setPaymentHistory(studentPayments);
    } catch (error) {
      console.error("Failed to fetch student payment history:", error);
    } finally {
      setLoading(false);
    }
  };
  //===================================================================================//
  return (
    <div className="compContainer">
      <div className={style.paymentHistoryHeader}>
        <div>
          <h2>Payment History</h2>
        </div>

        <StudentSelection onChange={handleStudentChange} isClearable={true} />
      </div>
      <div className={style.paymentHistoryBody}>
        {!selectedStudent ? ( // If no student is selected
          <p>Please select a student.</p>
        ) : loading ? ( // If a student is selected but data is loading
          <p>Loading...</p>
        ) : paymentHistory.length === 0 ? ( // If no payment history is found
          <p>No payments found for this student.</p>
        ) : (
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Payment Date</th>
                  <th>Student</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, key) => (
                  <tr key={key}>
                    <td>
                      {DateTime.fromISO(payment.student_payment_date).toFormat(
                        "MMMM d, yyyy "
                      )}
                    </td>
                    <td>{payment.student_name}</td>
                    <td>₱{payment.amount_paid}</td>
                    <td>{payment.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;
