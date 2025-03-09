import React from "react";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import style from "./Dashboard.module.css";
import { fetchPendingPayments } from "../../services/studentPaymentServices";

function PendingPayments() {
  const [pendingPayments, setPendingPayments] = useState([]);
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchPendingPayments()
      .then(setPendingPayments)
      .catch(() => console.error("Failed to fetch payment data"));
  }, []);
  return (
    <>
      <div className={style.pendingPaymentsContainer}>
        {pendingPayments.map((payment, key) => (
          <div className={style.pendingPaymentItem} key={key}>
            <div>
              <p>
                <b>Balance: ₱{payment.remaining_balance}</b>
              </p>
              <p>{`${payment.Student.student_first_name} ${payment.Student.student_last_name}`}</p>
              <p>{`${payment.Program.Instrument.instrument_name} - ${payment.Program.no_of_sessions} Sessions`}</p>
              <p>{`Total Fee: ₱${payment.total_fee}`}</p>
            </div>
            <div>
              <div className={style.dateContainer}>
                <p>
                  {`Due: ${DateTime.fromISO(payment.due_date).toFormat(
                    "MMMM d, yyyy "
                  )}`}
                </p>
              </div>

              <div className={style.paymentItemButtons}>
                <button>Add Payment</button>
                <button>Forfeit Program</button>
                <button>Notify Student</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PendingPayments;
