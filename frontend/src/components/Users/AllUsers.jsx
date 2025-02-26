import style from "./Users.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateUserModal from "../Modals/CreateUserModal";

function AllUsers() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => {
      setListOfUsers(response.data);
    });
  }, []);

  return (
    <>
      <div className="compContainer">
        <button onClick={() => setModalOpen(true)}>Add User</button>
        <CreateUserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        <table className="userTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {listOfUsers.map((value, key) => (
              <tr key={key}>
                <td>{value.username}</td>
                <td>{value.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllUsers;
