import style from "./Users.module.css";
import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { PiTrashFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserTable } from "../../services/userServices";
import { deleteUser } from "../../services/userServices";
import DeleteConfirm from "../Confirm/DeleteConfirm";
import useAuth from "../../hooks/useAuth";
//===============================================================================================//
function AllUsers() {
  const { user } = useAuth();
  const [listOfUsers, setListOfUsers] = useState([]);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  //---------------------------------------------------------------------------//
  const toggleItemDropdown = (studentId) => {
    setOpenDropdown((prev) => (prev === studentId ? null : studentId));
  };
  //---------------------------------------------------------------------------//

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
      console.log(userId);
      toast.success("User deleted successfully!", {
        autoClose: 2000,
        position: "top-center",
      });
      const newList = await fetchUserTable();
      setListOfUsers(newList);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handleDelete = async (userId, name, role) => {
    DeleteConfirm({
      title: "Confirm Delete",
      onConfirm: () => deleteCall(userId),
      details: {
        name: name,
        role: role,
      },
    });
  };
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchUserTable()
      .then(setListOfUsers)
      .catch(() => console.error("Failed to fetch users"));
  }, []);
  //---------------------------------------------------------------------------//

  return (
    <>
      <ToastContainer transition={Bounce} />
      <div className="compContainer">
        <div className={style.userButtons}>
          <button onClick={() => navigate("/users/create/teacher")}>
            Add Teacher
          </button>
          <button onClick={() => navigate("/users/create/admin")}>
            Add Administrator
          </button>
        </div>

        <div className="tableContainer">
          <table className="userTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {listOfUsers
                .filter((value) => value.user_id !== user?.user_id)
                .map((value, key) => (
                  <tr key={key}>
                    <td>{`${value.user_first_name} ${value.user_last_name}`}</td>
                    <td>{value.email}</td>
                    <td>{value.role}</td>
                    <td>
                      {DateTime.fromISO(value.createdAt).toFormat(
                        "MMMM d, yyyy"
                      )}
                    </td>
                    <td>
                      {user?.role === "Admin" && (
                        <button
                          className={style.deleteUserButton}
                          onClick={() =>
                            handleDelete(
                              value.user_id,
                              `${value.user_first_name} ${value.user_last_name}`,
                              value.role
                            )
                          }
                        >
                          <PiTrashFill />
                        </button>
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

export default AllUsers;
