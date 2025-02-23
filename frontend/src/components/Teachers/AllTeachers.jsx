import React from "react";
import axios from "axios";
import style from "../Teachers/Teachers.module.css";
import { useEffect, useState } from "react";
import { fetchTeachers } from "../../services/teacherServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

function AllTeachers() {
  const [listOfTeachers, setlistOfTeachers] = useState([]);
  useEffect(() => {
    fetchTeachers()
      .then(setlistOfTeachers)
      .catch(() => console.error("Failed to fetch teachers"));
  }, []);

  return (
    <>
      <div className="compContainer">
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Active Programs</th>
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
                  <td>2</td>
                  <td>
                    {value.Instruments.map((instrument, key) => (
                      <div
                        key={key}
                        className={`instContainer ${getInstrumentColor(
                          instrument.instrument_name
                        )}`}
                      >
                        {instrument.instrument_name}
                      </div>
                    ))}
                  </td>

                  <td>
                    <button>
                      <PiDotsThreeOutlineVerticalFill />
                    </button>
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

export default AllTeachers;
