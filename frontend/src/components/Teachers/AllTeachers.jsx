import React from "react";
import axios from "axios";
import style from "./Teachers.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTeacherTable } from "../../services/teacherServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";

import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

//==============================================================================//
function AllTeachers() {
  const [listOfTeachers, setlistOfTeachers] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({});
  const navigate = useNavigate();
  //---------------------------------------------------------------------------//
  const toggleItemDropdown = (teacherId) => {
    setDropdownStates((prevState) => {
      if (prevState[teacherId]) {
        return {};
      }
      return { [teacherId]: true };
    });
    console.log(dropdownStates);
  };
  //---------------------------------------------------------------------------//
  // const handleTeacherSelection = (teacher) => {
  //   setSelectedTeachers((prev) =>
  //     prev.includes(teacher)
  //       ? prev.filter((t) => t !== teacher)
  //       : [...prev, teacher]
  //   );
  // };
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchTeacherTable()
      .then(setlistOfTeachers)
      .catch(() => console.error("Failed to fetch teachers"));
  }, []);
  //---------------------------------------------------------------------------//
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
                <th>Programs</th>
                <th>Instruments</th>
                <th />
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
                  <td>{value.total_programs}</td>
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
                    <button
                      onClick={() => toggleItemDropdown(value.teacher_id)}
                    >
                      <PiDotsThreeOutlineVerticalFill />
                    </button>
                    {dropdownStates[value.teacher_id] && (
                      <div className={style.dropdownMenu}>
                        {/* <div className={style.dropdownItem}></div> */}
                        <button
                          onClick={() =>
                            navigate(
                              `/teachers/${value.teacher_id}/${value.teacher_first_name}`
                            )
                          }
                        >
                          View
                        </button>
                        <button>Delete</button>
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

export default AllTeachers;
