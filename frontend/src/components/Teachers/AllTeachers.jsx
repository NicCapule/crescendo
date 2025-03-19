import React from "react";
import axios from "axios";
import style from "./Teachers.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchTeacherTable } from "../../services/teacherServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { deleteUser } from "../../services/userServices";
import DeleteConfirm from "../Confirm/DeleteConfirm";
import useAuth from "../../hooks/useAuth";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

//==============================================================================//
function AllTeachers() {
  const { user } = useAuth();
  const [listOfTeachers, setlistOfTeachers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  //---------------------------------------------------------------------------//
  const toggleItemDropdown = (teacherId) => {
    setOpenDropdown((prev) => (prev === teacherId ? null : teacherId));
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
  const deleteCall = async (userId) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully!", {
        autoClose: 2000,
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handleDelete = async (userId, teacherName) => {
    DeleteConfirm({
      title: "Confirm Delete",
      onConfirm: () => deleteCall(userId),
      details: {
        name: teacherName,
        role: "Teacher",
      },
    });
  };
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
              {listOfTeachers.map((teacher) => (
                <tr key={teacher.teacher_id}>
                  <td>
                    {teacher.User.user_last_name},{" "}
                    {teacher.User.user_first_name}
                  </td>
                  <td>{teacher.User.email}</td>
                  <td>{teacher.teacher_phone}</td>
                  <td>{teacher.total_programs}</td>
                  <td>
                    {teacher.Instruments.map((instrument, key) => (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemDropdown(teacher.teacher_id);
                      }}
                    >
                      <PiDotsThreeOutlineVerticalFill />
                    </button>
                    {openDropdown === teacher.teacher_id && (
                      <div className={style.dropdownMenu}>
                        <button
                          onClick={() =>
                            navigate(
                              `/teachers/${teacher.teacher_id}/${teacher.User.user_first_name}`
                            )
                          }
                        >
                          View
                        </button>
                        {user?.role === "Admin" && (
                          <button
                            onClick={() =>
                              handleDelete(
                                teacher.user_id,
                                `${teacher.User.user_first_name} ${teacher.User.user_last_name}`
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

export default AllTeachers;
