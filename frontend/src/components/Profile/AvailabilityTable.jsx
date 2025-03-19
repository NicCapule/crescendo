import React from "react";
import { DateTime } from "luxon";
import style from "./Profile.module.css";
//===================================================================================//
function AvailabilityTable({ currentAvailabilities }) {
  const groupedAvailabilities = currentAvailabilities.reduce(
    (acc, availability) => {
      const { day_of_week, start_time, end_time } = availability;
      const formattedTime = `${DateTime.fromFormat(
        start_time,
        "HH:mm:ss"
      ).toFormat("h:mma")} - ${DateTime.fromFormat(
        end_time,
        "HH:mm:ss"
      ).toFormat("h:mma")}`;

      if (!acc[day_of_week]) {
        acc[day_of_week] = [];
      }
      acc[day_of_week].push(formattedTime);
      return acc;
    },
    {}
  );
  //-------------------------------------------------------//
  //===================================================================================//
  return (
    <div className={style.availabilityTable}>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Available Time</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedAvailabilities).map(([day, timeSlots]) => (
            <tr key={day}>
              <td>
                <strong>
                  <i>{day}</i>
                </strong>
              </td>
              <td>{timeSlots.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailabilityTable;
