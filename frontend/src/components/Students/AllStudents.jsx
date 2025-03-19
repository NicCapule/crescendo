import React from "react";
import style from "./Students.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchStudentTable,
  deleteStudent,
} from "../../services/studentServices";
import DeleteConfirm from "../Confirm/DeleteConfirm";
import useAuth from "../../hooks/useAuth";
//===============================================================================================//
function AllStudents() {
  const { user } = useAuth();
  const [listOfStudents, setListOfStudents] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  //---------------------------------------------------------------------------//
  const toggleItemDropdown = (studentId) => {
    setOpenDropdown((prev) => (prev === studentId ? null : studentId));
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
  const deleteCall = async (studentId) => {
    try {
      await deleteStudent(studentId);
      toast.success("Student deleted successfully!", {
        autoClose: 2000,
        position: "top-center",
      });
      const newList = await fetchStudentTable();
      setListOfStudents(newList);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handleDelete = async (studentId, studentName) => {
    DeleteConfirm({
      title: "Confirm Delete",
      onConfirm: () => deleteCall(studentId),
      details: {
        name: studentName,
      },
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
              {listOfStudents.map((student) => (
                <tr key={student.student_id}>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemDropdown(student.student_id);
                      }}
                    >
                      <PiDotsThreeOutlineVerticalFill />
                    </button>
                    {openDropdown === student.student_id && (
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
                        {user?.role === "Admin" && (
                          <button
                            onClick={() =>
                              handleDelete(
                                student.student_id,
                                `${student.student_first_name} ${student.student_last_name}`
                              )
                            }
                          >
                            Delete
                          </button>
                        )}
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
