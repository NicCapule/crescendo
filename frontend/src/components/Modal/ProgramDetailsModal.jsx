import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import {
  fetchProgramDetailsBySessionId,
  forfeitSession,
  markAttendance,
} from "../../services/sessionServices";
import {
  PiMusicNotesBold,
  PiChalkboardTeacherBold,
  PiStudentBold,
  PiCalendarCheckBold,
  PiListChecksBold,
} from "react-icons/pi";
import style from "./Modal.module.css";
import { DateTime } from "luxon";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { fetchProgramDetailsByProgramId } from "../../services/programServices";
import ForfeitConfirm from "../Confirm/ForfeitConfirm";
import { toast } from "react-toastify";
import {
  customStyles,
  customAttendanceStyles,
} from "../../utils/SelectCustomStyles";

//===============================================================================================//
function ProgramDetailsModal({
  showModal,
  setShowModal,
  selectedId,
  type = "session",
}) {
  const { user } = useAuth();
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const options = [
    { value: "Present", label: "Present", color: "#28a745" },
    { value: "Absent", label: "Absent", color: "#dc3545" },
    { value: "Late", label: "Late", color: "#ffa600" },
  ];
  const [loadingSession, setLoadingSession] = useState(null);
  //---------------------------------------------------------------------------//
  const fetchFunction =
    type === "session"
      ? fetchProgramDetailsBySessionId
      : fetchProgramDetailsByProgramId;
  //---------------------------------------------------------------------------//
  const forfeitCall = async (sessionId) => {
    try {
      await forfeitSession(sessionId);
      toast.success("Session forfeited!", {
        autoClose: 2000,
        position: "top-center",
      });
      setShowModal(false);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handleForfeitSession = async (
    sessionId,
    sessionDate,
    sessionStart,
    sessionEnd,
    sessionNumber
  ) => {
    ForfeitConfirm({
      title: "Confirm Forfeit",
      onConfirm: () => forfeitCall(sessionId),
      details: {
        sessionId: sessionId,
        sessionDate: sessionDate,
        sessionStart: sessionStart,
        sessionEnd: sessionEnd,
        sessionNumber: sessionNumber,
      },
      type: "session",
    });
  };
  //---------------------------------------------------------------------------//
  const handleChange = async (selectedOption, sessionId) => {
    setLoadingSession(sessionId);

    const attendance = selectedOption ? selectedOption.value : null;

    try {
      const response = await markAttendance(sessionId, attendance);
      toast.success(response.message, {
        autoClose: 2000,
        position: "top-center",
      });

      const updatedSessions = programSessions.map((session) =>
        session.session_id === sessionId ? { ...session, attendance } : session
      );
      setProgramData({
        ...programData,
        ProgramSessions: updatedSessions,
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance.", {
        autoClose: 2000,
        position: "top-center",
      });
    } finally {
      setLoadingSession(null); // Stop loading
    }
  };
  //---------------------------------------------------------------------------//
  const closeModal = () => {
    setShowModal(false);
  };
  //---------------------------------------------------------------------------//
  // useEffect(() => {
  //   if (!selectedSessionId) {
  //     setLoading(true);
  //     return;
  //   }

  //   setLoading(true);
  //   fetchProgramDetailsBySessionId(selectedSessionId)
  //     .then((data) => {
  //       setProgramData(data);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       console.error(
  //         "Failed to fetch sessions of session id:",
  //         selectedSessionId
  //       );
  //       setLoading(false);
  //     });
  // }, [selectedSessionId]);

  //---------------------------------------------------------------------------//
  useEffect(() => {
    if (!selectedId) {
      setLoading(true);
      return;
    }

    setLoading(true);
    fetchFunction(selectedId)
      .then((data) => {
        setProgramData(data);
        setLoading(false);
      })
      .catch(() => {
        console.error(`Failed to fetch details for ID: ${selectedId}`);
        setLoading(false);
      });
  }, [selectedId, fetchFunction]);
  //--------------------------------------//
  const programSessions = programData?.ProgramSessions || [];
  const selectedProgram = programData?.SelectedProgram || null;

  Modal.setAppElement("#root");
  return (
    <>
      {showModal && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <div className={style.modalHeader}>
              <h2>Program Details</h2>
              <button className={style.closeButton} onClick={closeModal}>
                &times;
              </button>
            </div>
            {!selectedProgram || !programSessions ? (
              <p>Loading program details...</p>
            ) : (
              <div className={style.modalContent}>
                <div className={style.programDetails}>
                  <div>
                    <p>
                      <span>
                        <PiStudentBold />
                        Student:
                      </span>
                      {`${selectedProgram.Enrollment.Student.student_first_name} ${selectedProgram.Enrollment.Student.student_last_name}`}
                    </p>
                    <p>
                      <span>
                        <PiChalkboardTeacherBold />
                        Teacher:
                      </span>
                      {`${selectedProgram.Teacher.User.user_first_name} ${selectedProgram.Teacher.User.user_last_name}`}
                    </p>
                    <div className={style.instrumentDetail}>
                      <span>
                        <PiMusicNotesBold />
                        Instrument:
                      </span>
                      <div
                        className={`instContainer ${getInstrumentColor(
                          selectedProgram.Instrument.instrument_name
                        )}`}
                      >{`${selectedProgram.Instrument.instrument_name}`}</div>
                    </div>
                  </div>
                  <div>
                    <p>
                      <span>
                        <PiListChecksBold />
                        Number of Sessions:
                      </span>
                      {`${selectedProgram.no_of_sessions}`}
                    </p>
                    <p>
                      <span>
                        <PiCalendarCheckBold />
                        Date Enrolled:
                      </span>
                      {`${DateTime.fromISO(
                        selectedProgram.Enrollment.enroll_date
                      ).toFormat("MMMM d, yyyy")}`}
                    </p>
                  </div>
                </div>

                <div className={style.programSessions}>
                  <table>
                    <thead>
                      <tr>
                        <th>Session</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Attendance</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {programSessions.map((session, index) => (
                        <tr
                          key={index}
                          className={
                            session.session_status === "Completed"
                              ? style.completedRow
                              : session.session_status !== "Scheduled"
                              ? style.disabledRow
                              : ""
                          }
                        >
                          <td>{session.session_number}</td>
                          <td>
                            {DateTime.fromISO(session.session_date).toFormat(
                              "MMMM d, yyyy"
                            )}
                          </td>
                          <td>{`${DateTime.fromFormat(
                            session.session_start,
                            "HH:mm:ss"
                          ).toFormat("h:mma")} - 
                        ${DateTime.fromFormat(
                          session.session_end,
                          "HH:mm:ss"
                        ).toFormat("h:mma")}`}</td>
                          <td
                            className={` ${
                              session.session_status === "Scheduled"
                                ? style.scheduledStatus
                                : ""
                            }${
                              session.session_status === "Completed"
                                ? style.completedStatus
                                : ""
                            }${
                              session.session_status === "Rescheduled"
                                ? style.recheduledStatus
                                : ""
                            }${
                              session.session_status === "Forfeited"
                                ? style.forfeitedStatus
                                : ""
                            }`}
                          >
                            {session.session_status}
                          </td>
                          <td
                            className={`${
                              session.attendance === "Present"
                                ? style.presentText
                                : ""
                            }${
                              session.attendance === "Absent"
                                ? style.absentText
                                : ""
                            }${
                              session.attendance === "Late"
                                ? style.lateText
                                : ""
                            }`}
                          >
                            {session.session_status === "Completed" ||
                            session.session_status === "Scheduled" ? (
                              <Select
                                className="reactSelect"
                                placeholder="Mark Attendance"
                                options={options}
                                styles={customAttendanceStyles}
                                isClearable={
                                  session.session_status === "Scheduled"
                                }
                                onChange={(selectedOption) =>
                                  handleChange(
                                    selectedOption,
                                    session.session_id
                                  )
                                }
                                isDisabled={
                                  loadingSession === session.session_id
                                }
                                value={
                                  options.find(
                                    (option) =>
                                      option.value === session.attendance
                                  ) || null
                                }
                              />
                            ) : session.session_status === "Forfeited" ? (
                              <span>{session.attendance || "N/A"}</span>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {user?.role === "Admin" &&
                              session.session_status !== "Forfeited" &&
                              session.session_status !== "Rescheduled" && (
                                <div className={style.sessionActions}>
                                  {session.session_status !== "Completed" && (
                                    <button
                                      onClick={() =>
                                        navigate("/reschedule-session", {
                                          state: {
                                            programSessions: programSessions,
                                            selectedProgram: selectedProgram,
                                            selectedSession: session.session_id,
                                          },
                                        })
                                      }
                                    >
                                      Reschedule
                                    </button>
                                  )}
                                  {session.session_status === "Completed" &&
                                    session.attendance === "Absent" && (
                                      <button
                                        onClick={() =>
                                          handleForfeitSession(
                                            session.session_id,
                                            session.session_date,
                                            session.session_start,
                                            session.session_end,
                                            session.session_number
                                          )
                                        }
                                      >
                                        Forfeit
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
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProgramDetailsModal;
