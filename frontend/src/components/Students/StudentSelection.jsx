import React from "react";
import { useState, useEffect } from "react";
import { fetchStudentTable } from "../../services/studentServices";
import Select from "react-select";
import { customStyles } from "../../utils/SelectCustomStyles";
//===========================================================================================//
function StudentSelection({ setFieldValue }) {
  const [students, setStudents] = useState([]);
  const options = students.map((student) => ({
    value: student.student_id,
    label: `${student.student_first_name} ${student.student_last_name}`,
  }));
  //-------------------------------------------------------------------//
  useEffect(() => {
    fetchStudentTable()
      .then(setStudents)
      .catch(() => console.error("Failed to fetch students"));
  }, []);
  //===========================================================================================//
  return (
    <div>
      <Select
        className="reactSelect"
        placeholder="Select a student"
        options={options}
        styles={customStyles}
        onChange={(selectedOption) =>
          setFieldValue("student_id", selectedOption.value)
        }
      />
    </div>
  );
}

export default StudentSelection;
