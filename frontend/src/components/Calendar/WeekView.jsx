import React from "react";
import { useState, useEffect } from "react";
import ProgramDetailsModal from "../Modal/ProgramDetailsModal";
import style from "./Calendar.module.css";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";
import { PiStudent, PiChalkboardTeacher, PiMusicNotes } from "react-icons/pi";
//---------------------------------------------------------------------------//
import { DateTime } from "luxon";
import ordinal from "ordinal-js";
//---------------------------------------------------------------------------//
import {
  mergeConsecutiveSessions,
  getSessionPosition,
} from "../../utils/CalendarLayout";
import { getInstrumentColor } from "../../utils/InstrumentColors";
//========================================================================================//
const timeSlots = [
  "8AM - 9AM",
  "9AM - 10AM",
  "10AM - 11AM",
  "11AM - 12PM",
  "12PM - 1PM",
  "1PM - 2PM",
  "2PM - 3PM",
  "3PM - 4PM",
  "4PM - 5PM",
  "5PM - 6PM",
  "6PM - 7PM",
  "7PM - 8PM",
];
//---------------------------------------------------------------------------//
const instrumentOptions = [
  { name: "Piano", colorClass: "pianoColor" },
  { name: "Guitar", colorClass: "guitarColor" },
  { name: "Violin", colorClass: "violinColor" },
  { name: "Drums", colorClass: "drumsColor" },
  { name: "Ukulele", colorClass: "ukuleleColor" },
  { name: "Voice", colorClass: "voiceColor" },
];
//========================================================================================//
function WeekView({ sessions, hideTeacherFilters, hideInstrumentFilters }) {
  const [listOfSessions, setListOfSessions] = useState(sessions || []);
  const [selectedDate, setSelectedDate] = useState(DateTime.now());
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teacherDropdown, setTeacherDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  //---------------------------------------------------------------------------//
  const handleSessionClick = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };
  //---------------------------------------------------------------------------//
  const startOfWeek = selectedDate.startOf("week");
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.plus({ days: i }).toFormat("EEE, MMM d")
  );
  //---------------------------------------------------------------------------//
  const uniqueTeachers = [
    ...new Set(
      listOfSessions.map(
        (s) =>
          `${s.Program.Teacher.User.user_last_name}, ${s.Program.Teacher.User.user_first_name}`
      )
    ),
  ];
  //---------------------------------------------------------------------------//
  const filteredSessions = listOfSessions.filter(
    (session) =>
      DateTime.fromISO(session.session_date) >= startOfWeek &&
      DateTime.fromISO(session.session_date) < startOfWeek.plus({ days: 7 }) &&
      (selectedInstruments.length === 0 ||
        selectedInstruments.includes(
          session.Program.Instrument.instrument_name
        )) &&
      (selectedTeachers.length === 0 ||
        selectedTeachers.includes(
          `${session.Program.Teacher.User.user_last_name}, ${session.Program.Teacher.User.user_first_name}`
        ))
  );
  //---------------------------------------------------------------------------//
  const mergedSessions = mergeConsecutiveSessions(filteredSessions);
  //---------------------------------------------------------------------------//
  const toggleTeacherDropdown = () => setTeacherDropdown(!teacherDropdown);
  //---------------------------------------------------------------------------//
  const handleTeacherSelection = (teacher) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacher)
        ? prev.filter((t) => t !== teacher)
        : [...prev, teacher]
    );
  };
  //---------------------------------------------------------------------------//
  const handleInstrumentSelection = (instrument) => {
    setSelectedInstruments(
      (prev) =>
        prev.includes(instrument)
          ? prev.filter((i) => i !== instrument) // Remove if already selected
          : [...prev, instrument] // Add if not selected
    );
  };
  //========================================================================================//
  return (
    <div>
      <div className={`${style.calendarHeader} ${style.weekViewHeader}`}>
        <div className={style.dateRow}>
          <div className={style.dateNav}>
            <button
              className={style.calendarArrow}
              onClick={() => setSelectedDate(selectedDate.minus({ weeks: 1 }))}
            >
              <MdOutlineArrowBackIos />
            </button>
            <span>
              {startOfWeek.toFormat("MMMM d")} -{" "}
              {startOfWeek.plus({ days: 6 }).toFormat("MMMM d, yyyy")}
            </span>
            <button
              className={style.calendarArrow}
              onClick={() => setSelectedDate(selectedDate.plus({ weeks: 1 }))}
            >
              <MdOutlineArrowForwardIos />
            </button>
          </div>
        </div>

        <div className={style.filterContainer}>
          {!hideInstrumentFilters && (
            <div className={style.instFilters}>
              {instrumentOptions.map((instrument) => (
                <button
                  key={instrument.name}
                  className={`${style.instfilterButton} ${
                    selectedInstruments.includes(instrument.name)
                      ? `${instrument.colorClass} ${style.selected}`
                      : ""
                  }`}
                  onClick={() => handleInstrumentSelection(instrument.name)}
                >
                  {instrument.name}
                </button>
              ))}
            </div>
          )}
          {!hideTeacherFilters && (
            <div className={style.dropdownFilters}>
              <div className={style.filterDropdown}>
                <button
                  onClick={toggleTeacherDropdown}
                  className={style.dropdownButton}
                >
                  Filter Teachers ⬇
                </button>
                {teacherDropdown && (
                  <div className={style.dropdownMenu}>
                    {uniqueTeachers.map((teacher) => (
                      <label key={teacher} className={style.dropdownItem}>
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(teacher)}
                          onChange={() => handleTeacherSelection(teacher)}
                        />
                        <span className={style.checkbox}></span>
                        {teacher}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={style.weekGrid}>
        <div className={style.timeColumn}>
          {timeSlots.map((slot, index) => (
            <div key={index} className={style.timeSlot}>
              {slot}
            </div>
          ))}
        </div>
        <div className={style.weekDays}>
          {weekDays.map((day, index) => (
            <div key={index} className={style.dayHeader}>
              {day}
            </div>
          ))}
        </div>
        <div className={style.weekSchedule}>
          {mergedSessions.map((session, index) => {
            const position = getSessionPosition(
              session,
              mergedSessions,
              "week"
            );
            return (
              <div
                key={index}
                className={`${style.weekSessionBlock} ${getInstrumentColor(
                  session.Program.Instrument.instrument_name
                )}`}
                onClick={() => handleSessionClick(session.session_id)}
                style={{
                  gridRowStart: position.gridRowStart,
                  gridColumnStart: position.gridColumnStart,
                  gridRowEnd: position.gridRowStart + position.gridRowSpan,
                }}
              >
                <p>
                  <b>
                    {session.session_numbers.length === 1
                      ? `${ordinal.toOrdinal(
                          session.session_numbers[0]
                        )} Session`
                      : `${ordinal.toOrdinal(
                          session.session_numbers[0]
                        )} to ${ordinal.toOrdinal(
                          session.session_numbers[
                            session.session_numbers.length - 1
                          ]
                        )} Session`}
                  </b>
                </p>
                <p>
                  <PiStudent />
                  {`${session.Student.student_last_name}, ${session.Student.student_first_name}`}
                </p>
                <p>
                  <PiChalkboardTeacher />
                  {`${session.Program.Teacher.User.user_last_name}, ${session.Program.Teacher.User.user_first_name}`}
                </p>
                <p>
                  <PiMusicNotes />
                  {session.Program.Instrument.instrument_name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <ProgramDetailsModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedId={selectedSessionId}
        type="session"
      />
    </div>
  );
}

export default WeekView;
