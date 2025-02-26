import React from "react";
import { useState, useEffect } from "react";
import { fetchSessions } from "../../services/sessionServices";
import style from "./Calendar.module.css";
//---------------------------------------------------------------------------//
import { DateTime } from "luxon";
import ordinal from "ordinal-js";
//---------------------------------------------------------------------------//
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import { PiStudent, PiChalkboardTeacher, PiMusicNotes } from "react-icons/pi";
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
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchSessions()
      .then(setlistOfSessions)
      .catch(() => console.error("Failed to fetch sessions"));
  }, []);
  //---------------------------------------------------------------------------//
  // Extract unique teachers & students
  const uniqueTeachers = [
    ...new Set(
      listOfSessions.map(
        (s) =>
          `${s.Program.Teacher.teacher_last_name}, ${s.Program.Teacher.teacher_first_name}`
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
          `${session.Program.Teacher.teacher_last_name}, ${session.Program.Teacher.teacher_first_name}`
        )) &&
      (selectedStudents.length === 0 ||
        selectedStudents.includes(
          `${session.Student.student_last_name}, ${session.Student.student_first_name}`
        ))
  );
  //---------------------------------------------------------------------------//
  const mergedSessions = mergeConsecutiveSessions(filteredSessions);
  //---------------------------------------------------------------------------//
  const toggleTeacherDropdown = () => setTeacherDropdown(!teacherDropdown);
  const toggleStudentDropdown = () => setStudentDropdown(!studentDropdown);
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
    <div className="compContainer">
      <div className={style.calendarHeader}>
        <div className={style.dateNav}>
          <button
            className={style.calendarArrow}
            onClick={() =>
              setSelectedDate(
                DateTime.fromISO(selectedDate).minus({ days: 1 }).toISODate()
              )
            }
          >
            <BsChevronDoubleLeft />
          </button>
          <span>
            {DateTime.fromISO(selectedDate).toFormat("EEEE, MMMM d, yyyy")}
          </span>
          <button
            className={style.calendarArrow}
            onClick={() =>
              setSelectedDate(
                DateTime.fromISO(selectedDate).plus({ days: 1 }).toISODate()
              )
            }
          >
            <BsChevronDoubleRight />
          </button>
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
                  {`${session.Program.Teacher.teacher_last_name}, ${session.Program.Teacher.teacher_first_name}`}
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
    </div>
  );
}
export default DayView;
