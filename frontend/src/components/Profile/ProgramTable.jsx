import React, { useEffect, useState } from "react";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { DateTime } from "luxon";
import style from "./Profile.module.css";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import ProgramDetailsModal from "../Modal/ProgramDetailsModal";

function ProgramTable({ programs }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  //---------------------------------------------------------------------------//
  const toggleItemDropdown = (programId) => {
    setOpenDropdown((prev) => (prev === programId ? null : programId));
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
  return (
    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Student</th>
            <th>Sessions</th>
            <th>Date Enrolled </th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {programs && programs.length > 0 ? (
            programs.map((program, index) => (
              <tr key={index}>
                <td>
                  <div
                    className={`instContainer ${getInstrumentColor(
                      program.Enrollment.instrument
                    )}`}
                  >
                    {program.Enrollment.instrument}
                  </div>
                </td>
                <td>{program.Enrollment.student_name}</td>
                <td>{program.no_of_sessions}</td>
                <td>
                  {DateTime.fromISO(program.Enrollment.enroll_date).toFormat(
                    "MMMM d, yyyy "
                  )}
                </td>

                <td
                  className={` ${
                    program.program_status === "Active"
                      ? style.activeStatus
                      : ""
                  }${
                    program.program_status === "Completed"
                      ? style.completedStatus
                      : ""
                  }${
                    program.program_status === "Forfeited"
                      ? style.forfeitedStatus
                      : ""
                  }`}
                >
                  {program.program_status}
                </td>
                {program.program_status !== "Forfeited" && (
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemDropdown(program.program_id);
                      }}
                    >
                      <PiDotsThreeOutlineVerticalFill />
                    </button>
                    {openDropdown === program.program_id && (
                      <div className={style.dropdownMenu}>
                        <button
                          onClick={() => {
                            setSelectedProgramId(program.program_id);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr className={style.noRecord}>
              <td colSpan="6">No assigned programs.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ProgramDetailsModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedId={selectedProgramId}
        type="program"
      />
    </div>
  );
}

export default ProgramTable;
