import React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchSessions } from "../../services/sessionServices";
import ProgramDetailsModal from "../Modal/ProgramDetailsModal";
import style from "./Calendar.module.css";
import DatePicker from "react-datepicker";

//---------------------------------------------------------------------------//
import { DateTime } from "luxon";
import ordinal from "ordinal-js";
//---------------------------------------------------------------------------//
import { PiStudent, PiChalkboardTeacher, PiMusicNotes } from "react-icons/pi";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";
import { getInstrumentColor } from "../../utils/InstrumentColors";
//---------------------------------------------------------------------------//
import {
  mergeConsecutiveSessions,
  getSessionPosition,
} from "../../utils/CalendarLayout";
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
function DayView() {
  const [listOfSessions, setlistOfSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate());
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [teacherDropdown, setTeacherDropdown] = useState(false);
  const [studentDropdown, setStudentDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const teacherDropdownRef = useRef(null);
  const studentDropdownRef = useRef(null);
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchSessions()
      .then(setlistOfSessions)
      .catch(() => console.error("Failed to fetch sessions"));
  }, []);
  //---------------------------------------------------------------------------//
  const handleSessionClick = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };
  //---------------------------------------------------------------------------//
  // Extract unique teachers & students
  const uniqueTeachers = [
    ...new Set(
      listOfSessions.map(
        (s) =>
          `${s.Program.Teacher.User.user_last_name}, ${s.Program.Teacher.User.user_first_name}`
      )
    ),
  ];
  const uniqueStudents = [
    ...new Set(
      listOfSessions.map(
        (s) => `${s.Student.student_last_name}, ${s.Student.student_first_name}`
      )
    ),
  ];
  //---------------------------------------------------------------------------//
  const filteredSessions = listOfSessions.filter(
    (session) =>
      DateTime.fromISO(session.session_date).toISODate() === selectedDate &&
      (selectedInstruments.length === 0 ||
        selectedInstruments.includes(
          session.Program.Instrument.instrument_name
        )) &&
      (selectedTeachers.length === 0 ||
        selectedTeachers.includes(
          `${session.Program.Teacher.User.user_last_name}, ${session.Program.Teacher.User.user_first_name}`
        )) &&
      (selectedStudents.length === 0 ||
        selectedStudents.includes(
          `${session.Student.student_last_name}, ${session.Student.student_first_name}`
        ))
  );
  //---------------------------------------------------------------------------//
  const mergedSessions = mergeConsecutiveSessions(filteredSessions);
  //---------------------------------------------------------------------------//
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        teacherDropdownRef.current &&
        !teacherDropdownRef.current.contains(event.target) &&
        !event.target.closest(`.${style.dropdownMenu}`)
      ) {
        setTeacherDropdown(false);
      }
      if (
        studentDropdownRef.current &&
        !studentDropdownRef.current.contains(event.target) &&
        !event.target.closest(`.${style.dropdownMenu}`)
      ) {
        setStudentDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //---------------------------------------------------------------------------//
  // const toggleTeacherDropdown = () => setTeacherDropdown(!teacherDropdown);
  // const toggleStudentDropdown = () => setStudentDropdown(!studentDropdown);

  // Toggle teacher dropdown and close the student dropdown
  const toggleTeacherDropdown = () => {
    setTeacherDropdown((prev) => !prev);
    setStudentDropdown(false);
  };

  // Toggle student dropdown and close the teacher dropdown
  const toggleStudentDropdown = () => {
    setStudentDropdown((prev) => !prev);
    setTeacherDropdown(false);
  };
  //---------------------------------------------------------------------------//
  const handleTeacherSelection = (teacher) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacher)
        ? prev.filter((t) => t !== teacher)
        : [...prev, teacher]
    );
  };
  //---------------------------------------------------------------------------//
  const handleStudentSelection = (student) => {
    setSelectedStudents((prev) =>
      prev.includes(student)
        ? prev.filter((s) => s !== student)
        : [...prev, student]
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
  //=============================================================================================//
  return (
    <div>
      <div className={`${style.calendarHeader} ${style.dayViewHeader}`}>
        <div className={style.dateRow}>
          <div className={style.dateNav}>
            <button
              className={style.calendarArrow}
              onClick={() =>
                setSelectedDate(
                  DateTime.fromISO(selectedDate).minus({ days: 1 }).toISODate()
                )
              }
            >
              <MdOutlineArrowBackIos />
            </button>
            <div className={style.dateContainer}>
              <span>
                {DateTime.fromISO(selectedDate).toFormat("EEEE, MMMM d, yyyy")}
              </span>
            </div>

            <button
              className={style.calendarArrow}
              onClick={() =>
                setSelectedDate(
                  DateTime.fromISO(selectedDate).plus({ days: 1 }).toISODate()
                )
              }
            >
              <MdOutlineArrowForwardIos />
            </button>
          </div>
          <div className={style.datePickerContainer}>
            <DatePicker
              selected={DateTime.fromISO(selectedDate).toJSDate()}
              onChange={(date) =>
                setSelectedDate(DateTime.fromJSDate(date).toISODate())
              }
              dateFormat="MMMM d, yyyy"
              className={style.datePicker}
              placeholderText="Select Date"
            />
          </div>
        </div>

        <div className={style.filterContainer}>
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

          <div className={style.dropdownFilters}>
            <div className={style.filterDropdown}>
              <button
                onClick={toggleTeacherDropdown}
                className={style.dropdownButton}
                ref={teacherDropdownRef}
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

            <div className={style.filterDropdown}>
              <button
                onClick={toggleStudentDropdown}
                className={style.dropdownButton}
                ref={studentDropdownRef}
              >
                Filter Students ⬇
              </button>
              {studentDropdown && (
                <div className={style.dropdownMenu}>
                  {uniqueStudents.map((student) => (
                    <label key={student} className={style.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student)}
                        onChange={() => handleStudentSelection(student)}
                      />
                      {student}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={style.dayGrid}>
        <div className={style.timeColumn}>
          {timeSlots.map((slot, index) => (
            <div key={index} className={style.timeSlot}>
              {slot}
            </div>
          ))}
        </div>

        <div className={style.daySchedule}>
          {mergedSessions.map((session, index) => {
            const position = getSessionPosition(session, mergedSessions, "day");
            return (
              <div
                key={index}
                className={`${style.daySessionBlock} ${getInstrumentColor(
                  session.Program.Instrument.instrument_name
                )}`}
                style={{
                  gridRowStart: position.gridRowStart,
                  gridRowEnd: position.gridRowStart + position.gridRowSpan,
                  gridColumnStart: position.gridColumnStart,
                }}
                onClick={() => handleSessionClick(session.session_id)}
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
export default DayView;
