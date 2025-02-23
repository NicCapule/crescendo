import React from "react";
import style from "./Dashboard.module.css";

function PendingPayments() {
  return (
    <>
      <div className={style.pendingPaymentsContainer}>
        <p>Amount</p>
        <p>Student</p>
        <p>Program</p>
        <p>Due</p>
      </div>
    </>
  );
}

export default PendingPayments;
