"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("User", [
      {
        email: "admin@example.com",
        password: "password",
        role: "Admin",
      },
      {
        email: "jake@gmail.com",
        password: "password",
        role: "Teacher",
      },
    ]);

    await queryInterface.bulkInsert("Instrument", [
      {
        instrument_name: "Piano",
      },
      {
        instrument_name: "Guitar",
      },
      {
        instrument_name: "Violin",
      },
      {
        instrument_name: "Drums",
      },
      {
        instrument_name: "Ukelele",
      },
      {
        instrument_name: "Voice",
      },
    ]);

    await queryInterface.bulkInsert("Teacher", [
      {
        user_id: 2,
        teacher_first_name: "Jake",
        teacher_last_name: "Peralta",
        teacher_phone: "123",
      },
    ]);

    await queryInterface.bulkInsert("TeacherInstrument", [
      {
        teacher_id: 1,
        instrument_id: 1,
      },
    ]);

    await queryInterface.bulkInsert("Student", [
      {
        student_first_name: "Russel",
        student_last_name: "Segador",
        student_address: "Marikina",
        student_age: 22,
        student_email: "russel@gmail.com",
        student_phone: "123",
      },
    ]);

    await queryInterface.bulkInsert("Room", [
      {
        room_name: "Piano Room 1",
        has_piano: true,
        has_drums: false,
      },
      {
        room_name: "Piano Room 2",
        has_piano: true,
        has_drums: false,
      },
      {
        room_name: "Piano Room 3",
        has_piano: true,
        has_drums: false,
      },
      {
        room_name: "Drums Room",
        has_piano: true,
        has_drums: true,
      },
    ]);

    await queryInterface.bulkInsert("Program", [
      {
        teacher_id: 1,
        instrument_id: 1,
        no_of_sessions: 8,
      },
    ]);

    await queryInterface.bulkInsert("Enrollment", [
      {
        student_id: 1,
        program_id: 1,
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
        session_number: 1,
        session_date: "2025-02-21",
        session_start: "08:00:00",
        session_end: "09:00:00",
        session_status: "Scheduled",
      },
    ]);

    await queryInterface.bulkInsert("StudentAvailability", [
      {
        student_id: 1,
        day_of_week: "Monday",
        start_time: "08:00:00",
        end_time: "20:00:00",
      },
    ]);

    await queryInterface.bulkInsert("TeacherAvailability", [
      {
        teacher_id: 1,
        day_of_week: "Monday",
        start_time: "08:00:00",
        end_time: "20:00:00",
      },
    ]);

    await queryInterface.bulkInsert("StudentPayment", [
      {
        enrollment_id: 1,
        amount_paid: 4000.0,
        payment_method: "Cash",
        student_payment_date: new Date("2025-02-21"),
      },
    ]);

    await queryInterface.bulkInsert("TeacherSalary", [
      {
        teacher_id: 1,
        total_sessions: 2,
        payment_date: new Date("2025-02-21"),
        amount_paid: 1000.0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TeacherSalary", null, {});
    await queryInterface.bulkDelete("StudentPayment", null, {});
    await queryInterface.bulkDelete("TeacherAvailability", null, {});
    await queryInterface.bulkDelete("StudentAvailability", null, {});
    await queryInterface.bulkDelete("Session", null, {});
    await queryInterface.bulkDelete("Enrollment", null, {});
    await queryInterface.bulkDelete("Program", null, {});
    await queryInterface.bulkDelete("Room", null, {});
    await queryInterface.bulkDelete("Student", null, {});
    await queryInterface.bulkDelete("TeacherInstrument", null, {});
    await queryInterface.bulkDelete("Teacher", null, {});
    await queryInterface.bulkDelete("Instrument", null, {});
    await queryInterface.bulkDelete("User", null, {});
  },
};
