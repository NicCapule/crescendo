import React from "react";
import axios from "axios";
import style from "./Students.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { fetchStudentTable } from "../../services/studentServices";

function AllStudents() {
  const [listOfStudents, setListOfStudents] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({});
  const navigate = useNavigate();
  //---------------------------------------------------------------------------//
  const toggleItemDropdown = (studentId) => {
    setDropdownStates((prevState) => {
      if (prevState[studentId]) {
        return {};
      }
      return { [studentId]: true };
    });
  };
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchStudentTable()
      .then(setListOfStudents)
      .catch(() => console.error("Failed to fetch students"));
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
                <th>Address</th>
                <th>Age</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Active Programs</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {listOfStudents.map((student, key) => (
                <tr key={key}>
                  <td>
                    {student.student_last_name}, {student.student_first_name}
                  </td>
                  <td>{student.student_address}</td>
                  <td>{student.student_age}</td>
                  <td>{student.student_email}</td>
                  <td>{student.student_phone}</td>
                  <td>{student.total_programs}</td>
                  <td>
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

export default AllStudents;
