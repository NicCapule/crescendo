import React from "react";
import { useState, useEffect } from "react";
import { fetchTeacherTable } from "../../services/teacherServices";
import Select from "react-select";
import { customStyles } from "../../utils/SelectCustomStyles";
//=========================================================================================//
function TeacherSelection({ setFieldValue, selectedInstrument, values }) {
  const [teachers, setTeachers] = useState([]);
  const options = teachers.map((teacher) => ({
    value: teacher.teacher_id,
    label: `${teacher.User.user_first_name} ${teacher.User.user_last_name}`,
  }));
  //-------------------------------------------------------------------//
  useEffect(() => {
    fetchTeacherTable().then((data) => {
      const filteredTeachers = data.filter((teacher) =>
        teacher.Instruments.some(
          (instrument) =>
            instrument.TeacherInstrument.instrument_id === selectedInstrument
        )
      );
      setTeachers(filteredTeachers);
    });
  }, [selectedInstrument]);
  //=========================================================================================//
  return (
    <div>
      <Select
        className="reactSelect"
        placeholder="Select a teacher"
        options={options}
        styles={customStyles}
        value={
          options.find((option) => option.value === values.teacher_id) || null
        }
        onChange={(selectedOption) =>
          setFieldValue("teacher_id", selectedOption.value)
        }
      />
    </div>
  );
}

export default TeacherSelection;
