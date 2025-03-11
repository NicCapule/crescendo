import style from "./Users.module.css";
import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AllUsers() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => {
      setListOfUsers(response.data);
    });
  }, []);

  return (
    <>
      <div className="compContainer">
        <button onClick={() => navigate("/users/create/teacher")}>
          Add Teacher
        </button>
        <button onClick={() => navigate("/users/create/admin")}>
          Add Administrator
        </button>

        <div className="tableContainer">
          <table className="userTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {listOfUsers.map((value, key) => (
                <tr key={key}>
                  <td>{`${value.user_first_name} ${value.user_last_name}`}</td>
                  <td>{value.email}</td>
                  <td>{value.role}</td>
                  <td>
                    {DateTime.fromISO(value.createdAt).toFormat("MMMM d, yyyy")}
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
