import React from "react";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { fetchPendingPayments } from "../../services/studentPaymentServices";
import style from "./Payments.module.css";
import ForfeitConfirm from "../Confirm/ForfeitConfirm";
import { forfeitProgram } from "../../services/programServices";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//===============================================================================================//
function PendingPaymentsTable() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const today = DateTime.now().startOf("day");
  //---------------------------------------------------------------------------//
  const toggleItemDropdown = (enrollmentId) => {
    setOpenDropdown((prev) => (prev === enrollmentId ? null : enrollmentId));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(`.${style.dropdownMenu}`) &&
        !event.target.closest("button")
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
  //---------------------------------------------------------------------------//
  return (
    <>
      <div className="compContainer">
        <div className={style.pendingPaymentsHeader}>
          <h2>Pending Payments</h2>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Due</th>
                <th>Student</th>
                <th>Program</th>
                <th>Total Paid</th>
                <th>Remaining Balance</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment) => (
                <tr key={payment.enrollment_id}>
                  <td>
                    <div
                      className={`${style.dueDateContainer} ${
                        DateTime.fromISO(payment.due_date) < today
                          ? style.overdue
                          : ""
                      }`}
                    >
                      {DateTime.fromISO(payment.due_date).toFormat(
                        "MMMM d, yyyy "
                      )}
                    </div>
                  </td>
                  <td>
                    {`${payment.Student.student_first_name} ${payment.Student.student_last_name}`}
                  </td>
                  <td>
                    {`${payment.Program.Instrument.instrument_name} - ${payment.Program.no_of_sessions} Sessions`}
                  </td>
                  <td>
                    {" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "PHP",
                    }).format(payment.total_paid)}
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "PHP",
                    }).format(payment.remaining_balance)}
                  </td>

                  <td>
                    <button
                      onClick={() => toggleItemDropdown(payment.enrollment_id)}
                    >
                      <PiDotsThreeOutlineVerticalFill />
                    </button>
                    {openDropdown === payment.enrollment_id && (
                      <div className={style.dropdownMenu}>
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
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PendingPaymentsTable;
