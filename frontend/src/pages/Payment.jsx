import React from "react";
import PendingPaymentsTable from "../components/Payments/PendingPaymentsTable";
import PaymentHistory from "../components/Payments/PaymentHistory";

function Payment() {
  return (
    <>
      <h1 className="pageTitle">Payment</h1>
      <PendingPaymentsTable />
      <PaymentHistory />
    </>
  );
}

export default Payment;
