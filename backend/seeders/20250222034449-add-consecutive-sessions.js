"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("User", [
      {
        email: "michael@gmail.com",
        password: "password",
        role: "Teacher",
      },
      {
        email: "amy@gmail.com",
        password: "password",
        role: "Teacher",
      },
    ]);

    await queryInterface.bulkInsert("Teacher", [
      {
        user_id: 3,
        teacher_first_name: "Michael",
        teacher_last_name: "Scott",
        teacher_phone: "123",
      },
      {
        user_id: 4,
        teacher_first_name: "Amy",
        teacher_last_name: "Santiago",
        teacher_phone: "123",
      },
    ]);

    await queryInterface.bulkInsert("TeacherInstrument", [
      {
        teacher_id: 2,
        instrument_id: 2,
      },
      {
        teacher_id: 3,
        instrument_id: 3,
      },
    ]);

    await queryInterface.bulkInsert("Student", [
      {
        student_first_name: "Angelica",
        student_last_name: "Babon",
        student_address: "Marikina",
        student_age: 22,
        student_email: "angelica@gmail.com",
        student_phone: "123",
      },
    ]);

    await queryInterface.bulkInsert("Program", [
      {
        teacher_id: 2,
        instrument_id: 2,
        no_of_sessions: 8,
      },
    ]);

    await queryInterface.bulkInsert("Enrollment", [
      {
        student_id: 2,
        program_id: 2,
        enroll_date: "2025-02-21",
        total_fee: 7000.0,
        enrollment_status: "Active",
      },
    ]);

    await queryInterface.bulkInsert("Session", [
      {
        student_id: 1,
        program_id: 1,
        room_id: 1,
        session_number: 2,
        session_date: "2025-02-21",
        session_start: "09:00:00",
        session_end: "10:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 1,
        program_id: 1,
        room_id: 1,
        session_number: 3,
        session_date: "2025-02-21",
        session_start: "10:00:00",
        session_end: "11:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 2,
        program_id: 2,
        room_id: 2,
        session_number: 1,
        session_date: "2025-02-21",
        session_start: "10:00:00",
        session_end: "11:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 1,
        program_id: 1,
        room_id: 1,
        session_number: 4,
        session_date: "2025-02-21",
        session_start: "12:00:00",
        session_end: "13:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 2,
        program_id: 2,
        room_id: 2,
        session_number: 2,
        session_date: "2025-02-21",
        session_start: "12:00:00",
        session_end: "13:00:00",
        session_status: "Scheduled",
      },
    ]);

    await queryInterface.bulkInsert("StudentAvailability", [
      {
        student_id: 2,
        day_of_week: "Monday",
        start_time: "08:00:00",
        end_time: "20:00:00",
      },
    ]);

    await queryInterface.bulkInsert("TeacherAvailability", [
      {
        teacher_id: 2,
        day_of_week: "Monday",
        start_time: "08:00:00",
        end_time: "20:00:00",
      },
      {
        teacher_id: 3,
        day_of_week: "Monday",
        start_time: "08:00:00",
        end_time: "20:00:00",
      },
    ]);

    await queryInterface.bulkInsert("StudentPayment", [
      {
        enrollment_id: 2,
        amount_paid: 4000.0,
        payment_method: "Cash",
        student_payment_date: new Date("2025-02-21"),
      },
    ]);

    await queryInterface.bulkInsert("TeacherSalary", [
      {
        teacher_id: 2,
        total_sessions: 2,
        payment_date: new Date("2025-02-21"),
        amount_paid: 1000.0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TeacherSalary", { teacher_id: 2 }, {});
    await queryInterface.bulkDelete("StudentPayment", { enrollment_id: 2 }, {});
    await queryInterface.bulkDelete(
      "TeacherAvailability",
      {
        teacher_id: { [Sequelize.Op.in]: [2, 3] },
      },
      {}
    );
    await queryInterface.bulkDelete(
      "StudentAvailability",
      { student_id: 2 },
      {}
    );
    await queryInterface.bulkDelete(
      "Session",
      {
        session_id: { [Sequelize.Op.in]: [2, 3] },
      },
      {}
    );
    await queryInterface.bulkDelete("Enrollment", { student_id: 2 }, {});
    await queryInterface.bulkDelete("Program", { teacher_id: 2 }, {});
    await queryInterface.bulkDelete(
      "Student",
      { student_email: "angelica@gmail.com" },
      {}
    );
    await queryInterface.bulkDelete(
      "TeacherInstrument",
      {
        teacher_id: { [Sequelize.Op.in]: [2, 3] },
      },
      {}
    );
    await queryInterface.bulkDelete(
      "Teacher",
      { user_id: { [Sequelize.Op.in]: [3, 4] } },
      {}
    );
    await queryInterface.bulkDelete(
      "User",
      {
        email: { [Sequelize.Op.in]: ["michael@gmail.com", "amy@gmail.com"] },
      },
      {}
    );
  },
};
