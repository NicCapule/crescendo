import React from "react";
import { DateTime } from "luxon";
import style from "./Profile.module.css";
function SalaryTable({ salaries }) {
  return (
    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Sessions</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {salaries && salaries.length > 0 ? (
            salaries.map((salary, index) => (
              <tr key={index}>
                <td>
                  {DateTime.fromISO(salary.salary_date).toFormat(
                    "MMMM d, yyyy "
                  )}
                </td>
                <td>{salary.total_sessions}</td>
                <td>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                  }).format(salary.amount)}
                </td>
              </tr>
            ))
          ) : (
            <tr className={style.noRecord}>
              <td colSpan="3">No salary records.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalaryTable;
