import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { fetchProgramDetailsBySessionId } from "../../services/sessionServices";
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

function SessionDetailsModal({ showModal, setShowModal, selectedSessionId }) {
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //--------------------------------------//
  const closeModal = () => {
    setShowModal(false);
  };
  //--------------------------------------//
  useEffect(() => {
    if (!selectedSessionId) {
      setLoading(true);
      return;
    }

    setLoading(true);
    fetchProgramDetailsBySessionId(selectedSessionId)
      .then((data) => {
        setProgramData(data);
        setLoading(false);
      })
      .catch(() => {
        console.error(
          "Failed to fetch sessions of program id:",
          selectedSessionId
        );
        setLoading(false);
      });
  }, [selectedSessionId]);
  //--------------------------------------//
  const programSessions = programData?.ProgramSessions || [];
  const selectedProgram = programData?.SelectedProgram || null;
  // console.log(selectedProgram);

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
                        <tr key={index}>
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
                          <td>{session.session_status}</td>
                          <td>{session.attendance}</td>
                          <td>
                            <div className={style.sessionActions}>
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
                              <button>Forfeit</button>
                            </div>
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

export default SessionDetailsModal;
