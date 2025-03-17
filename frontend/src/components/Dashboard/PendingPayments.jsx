import React from "react";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import style from "./Dashboard.module.css";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchPendingPayments } from "../../services/studentPaymentServices";
import { forfeitProgram } from "../../services/programServices";
import ForfeitConfirm from "../Confirm/ForfeitProgramConfirm";
import { useNavigate } from "react-router-dom";

//===============================================================================================//
function PendingPayments() {
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState([]);
  //---------------------------------------------------------------------------//
  const forfeitCall = async (programId) => {
    try {
      await forfeitProgram(programId);
      toast.success("Program forfeited!", {
        autoClose: 2000,
        position: "top-center",
      });
      const newList = await fetchPendingPayments();
      setPendingPayments(newList);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handleForfeit = async (
    programId,
    studentName,
    teacherName,
    instrument,
    noOfSessions,
    remainingBalance,
    dueDate
  ) => {
    ForfeitConfirm({
      title: "Confirm Forfeit",
      onConfirm: () => forfeitCall(programId),
      details: {
        studentName: studentName,
        teacherName: teacherName,
        instrument: instrument,
        noOfSessions: noOfSessions,
        remainingBalance: remainingBalance,
        dueDate: dueDate,
      },
    });
    console.log(programId);
  };
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchPendingPayments()
      .then(setPendingPayments)
      .catch(() => console.error("Failed to fetch payment data"));
  }, []);
  return (
    <>
      <ToastContainer transition={Bounce} />
      <div className={style.pendingPaymentsContainer}>
        {pendingPayments.map((payment, key) => (
          <div className={style.pendingPaymentItem} key={key}>
            <div>
              <p>
                <b>
                  Balance:{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                  }).format(payment.remaining_balance)}
                </b>
              </p>
              <p>{`${payment.Student.student_first_name} ${payment.Student.student_last_name}`}</p>
              <p>{`${payment.Program.Instrument.instrument_name} - ${payment.Program.no_of_sessions} Sessions`}</p>
              <p>{`Total Fee: ${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "PHP",
              }).format(payment.total_fee)}`}</p>
            </div>
            <div>
              <div className={style.dueDateContainer}>
                <p>
                  {`Due: ${DateTime.fromISO(payment.due_date).toFormat(
                    "MMMM d, yyyy "
                  )}`}
                </p>
              </div>

              <div className={style.paymentItemButtons}>
                <button
                  onClick={() =>
                    navigate("/payment/add", {
                      state: { paymentDetails: payment },
                    })
                  }
                >
                  Add Payment
                </button>
                <button
                  onClick={() =>
                    handleForfeit(
                      payment.Program.program_id,
                      payment.student_name,
                      payment.teacher_name,
                      payment.instrument,
                      payment.Program.no_of_sessions,
                      payment.remaining_balance,
                      payment.due_date
                    )
                  }
                >
                  Forfeit Program
                </button>
                {/* <button>Notify Student</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PendingPayments;
