import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

function AllStudents() {
  const [listOfStudents, setlistOfStudents] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/students").then((response) => {
      setlistOfStudents(response.data);
    });
  }, []);
  return (
    <>
      <div className="compContainer">
        <table className="userTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {listOfStudents.map((value, key) => (
              <tr key={key}>
                <td>
                  {value.student_last_name}, {value.student_first_name}
                </td>
                <td>{value.student_address}</td>
                <td>{value.student_age}</td>
                <td>{value.student_email}</td>
                <td>{value.student_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllStudents;
