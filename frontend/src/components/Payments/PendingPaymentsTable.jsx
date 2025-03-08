import React from "react";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { fetchPendingPayments } from "../../services/studentPaymentServices";

function PendingPaymentsTable() {
  const [pendingPayments, setPendingPayments] = useState([]);
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
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Due</th>
                <th>Program</th>
                <th>Student</th>
                <th>Total Paid</th>
                <th>Remaining Balance</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment, key) => (
                <tr key={key}>
                  <td>
                    {DateTime.fromISO(payment.due_date).toFormat(
                      "MMM d, yyyy "
                    )}
                  </td>
                  <td>{payment.Program.Instrument.instrument_name}</td>
                  <td>
                    {`${payment.Student.student_first_name} ${payment.Student.student_last_name}`}
                  </td>
                  <td>₱{payment.total_paid}</td>
                  <td>₱{payment.remaining_balance}</td>
                  {/* <td>
                    <button
                      onClick={() => toggleItemDropdown(student.student_id)}
                    >
                      <PiDotsThreeOutlineVerticalFill />
                    </button>
                    {dropdownStates[student.student_id] && (
                      <div className={style.dropdownMenu}>
                        <button
                          onClick={() =>
                            navigate(
                              `/students/${student.student_id}/${student.student_first_name}`
                            )
                          }
                        >
                          View
                        </button>
                        <button>Delete</button>
                      </div>
                    )}
                  </td> */}
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
