import React from "react";
import axios from "axios";
import style from "../Teachers/Teachers.module.css";
import { useEffect, useState } from "react";

import { getInstrumentColor } from "../../utils/InstrumentColors";

function AllTeachers() {
  const [listOfTeachers, setlistOfTeachers] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/teachers").then((response) => {
      // console.log("Data fetched:", JSON.stringify(response.data, null, 2));
      setlistOfTeachers(response.data);
    });
  }, []);

  return (
    <>
      <div className="compContainer">
        <table className="userTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Instruments</th>
            </tr>
          </thead>
          <tbody>
            {listOfTeachers.map((value, key) => (
              <tr key={key}>
                <td>
                  {value.teacher_last_name}, {value.teacher_first_name}
                </td>
                <td>{value.User.email}</td>
                <td>{value.teacher_phone}</td>
                <td>
                  {value.Instruments.map((instrument, key) => (
                    <div
                      key={key}
                      className={`${style.instContainer} ${getInstrumentColor(
                        instrument.instrument_name
                      )}`}
                    >
                      {instrument.instrument_name}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllTeachers;
