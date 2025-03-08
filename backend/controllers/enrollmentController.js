const {
  Sequelize,
  Enrollment,
  Session,
  Student,
  Program,
  StudentAvailability,
  StudentPayment,
} = require("../models");

exports.enrollNewStudent = async (req, res) => {
  try {
    const {
      student_first_name,
      student_last_name,
      student_address,
      student_age,
      student_email,
      student_phone,
      availability,
      instrument,
      teacher_id,
      noOfSessions,
      sessionSchedules,
      payment_method,
      amount_paid,
    } = req.body;

    //--------------------------------------------------//
    const newStudent = await Student.create({
      student_first_name,
      student_last_name,
      student_address,
      student_age,
      student_email,
      student_phone,
    });
    //--------------------------------------------------//
    if (availability && availability.length > 0) {
      const availabilityRecords = availability.map(
        ({ day_of_week, start_time, end_time }) => ({
          student_id: newStudent.student_id,
          day_of_week,
          start_time,
          end_time,
        })
      );
      await StudentAvailability.bulkCreate(availabilityRecords);
    }
    //--------------------------------------------------//
    const newProgram = await Program.create({
      teacher_id,
      instrument_id: instrument,
      no_of_sessions: noOfSessions,
      program_status: "Active",
    });
    //--------------------------------------------------//
    const newEnrollment = await Enrollment.create({
      student_id: newStudent.student_id,
      program_id: newProgram.program_id,
      no_of_sessions: noOfSessions,
      total_fee: noOfSessions === 8 ? 7000 : 120000,
      payment_status: "Unsettled",
    });
    //--------------------------------------------------//
    if (amount_paid > 0) {
      const newPayment = await StudentPayment.create({
        enrollment_id: newEnrollment.enrollment_id,
        amount_paid,
        payment_method,
      });
    }
    //--------------------------------------------------//
    if (sessionSchedules && sessionSchedules.length > 0) {
      const sessionRecords = sessionSchedules.map(
        ({ session_date, session_start_time, session_end_time }, index) => ({
          student_id: newStudent.student_id,
          program_id: newProgram.program_id,
          room_id: 1,
          session_number: index + 1,
          session_date,
          session_start: session_start_time,
          session_end: session_end_time,
        })
      );
      await Session.bulkCreate(sessionRecords);
    }
    //--------------------------------------------------//
    return res.status(201).json({
      message: "New student enrolled successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error enrolling new student:", error);
    return res.status(500).json({ error: "Failed to enroll new student" });
  }
};
//======================================================================================================//
exports.enrollExistingStudent = async (req, res) => {
  try {
    const {
      student_id,
      instrument,
      teacher_id,
      noOfSessions,
      payment_method,
      amount_paid,
      sessionSchedules,
    } = req.body;

    // Ensure student exists
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    //--------------------------------------------------//
    const newProgram = await Program.create({
      teacher_id,
      instrument_id: instrument,
      no_of_sessions: noOfSessions,
      program_status: "Active",
    });
    //--------------------------------------------------//

    const newEnrollment = await Enrollment.create({
      student_id: student.student_id,
      program_id: newProgram.program_id,
      no_of_sessions: noOfSessions,
      total_fee: noOfSessions === 8 ? 7000 : 120000,
      payment_status: "Unsettled",
    });
    //--------------------------------------------------//
    if (amount_paid > 0) {
      const newPayment = await StudentPayment.create({
        enrollment_id: newEnrollment.enrollment_id,
        amount_paid,
        payment_method,
      });
    }
    //--------------------------------------------------//
    if (sessionSchedules && sessionSchedules.length > 0) {
      const sessionRecords = sessionSchedules.map(
        ({ session_date, session_start_time, session_end_time }, index) => ({
          student_id: student.student_id,
          program_id: newProgram.program_id,
          room_id: 1,
          session_number: index + 1,
          session_date,
          session_start: session_start_time,
          session_end: session_end_time,
        })
      );
      await Session.bulkCreate(sessionRecords);
    }
    const responseData = {
      message: "Existing student enrolled successfully",
      newEnrollment,
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error enrolling existing student:", error);
    return res.status(500).json({ error: "Failed to enroll existing student" });
  }
};
