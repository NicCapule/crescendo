"use strict";
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    await queryInterface.bulkInsert("User", [
      {
        email: "admin@example.com",
        user_first_name: "Michael",
        user_last_name: "Scott",
        password: await bcrypt.hash("password", salt),
        role: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "jake@gmail.com",
        user_first_name: "Jake",
        user_last_name: "Peralta",
        password: await bcrypt.hash("password", salt),
        role: "Teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "amy@gmail.com",
        user_first_name: "Amy",
        user_last_name: "Santiago",
        password: await bcrypt.hash("password", salt),
        role: "Teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "jim@gmail.com",
        user_first_name: "Jim",
        user_last_name: "Halpert",
        password: await bcrypt.hash("password", salt),
        role: "Teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "pam@gmail.com",
        user_first_name: "Pam",
        user_last_name: "Beesly",
        password: await bcrypt.hash("password", salt),
        role: "Teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
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
        instrument_name: "Ukulele",
      },
      {
        instrument_name: "Voice",
      },
    ]);

    await queryInterface.bulkInsert("Teacher", [
      {
        user_id: 2,
        teacher_phone: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        teacher_phone: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 4,
        teacher_phone: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 5,
        teacher_phone: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("TeacherInstrument", [
      {
        teacher_id: 1,
        instrument_id: 1,
      },
      {
        teacher_id: 1,
        instrument_id: 2,
      },
      {
        teacher_id: 1,
        instrument_id: 3,
      },
      {
        teacher_id: 2,
        instrument_id: 4,
      },
      {
        teacher_id: 3,
        instrument_id: 1,
      },
      {
        teacher_id: 3,
        instrument_id: 5,
      },
      {
        teacher_id: 4,
        instrument_id: 6,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        student_first_name: "Angelica",
        student_last_name: "Babon",
        student_address: "Marikina",
        student_age: 22,
        student_email: "angelica@gmail.com",
        student_phone: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
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
        program_status: "Active",
      },
      {
        teacher_id: 2,
        instrument_id: 4,
        no_of_sessions: 16,
        program_status: "Active",
      },
    ]);

    await queryInterface.bulkInsert("Enrollment", [
      {
        student_id: 1,
        program_id: 1,
        enroll_date: new Date(),
        total_fee: 7000.0,
        payment_status: "Unsettled",
      },
      {
        student_id: 2,
        program_id: 2,
        enroll_date: new Date(),
        total_fee: 12000.0,
        payment_status: "Unsettled",
      },
    ]);

    await queryInterface.bulkInsert("Session", [
      {
        student_id: 1,
        program_id: 1,
        room_id: 1,
        session_number: 1,
        session_date: "2025-02-27",
        session_start: "08:00:00",
        session_end: "09:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 1,
        program_id: 1,
        room_id: 1,
        session_number: 2,
        session_date: "2025-02-27",
        session_start: "09:00:00",
        session_end: "10:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 1,
        program_id: 1,
        room_id: 1,
        session_number: 3,
        session_date: "2025-02-27",
        session_start: "10:00:00",
        session_end: "11:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 2,
        program_id: 2,
        room_id: 2,
        session_number: 1,
        session_date: "2025-02-27",
        session_start: "10:00:00",
        session_end: "11:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 1,
        program_id: 1,
        room_id: 1,
        session_number: 4,
        session_date: "2025-02-27",
        session_start: "12:00:00",
        session_end: "13:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 2,
        program_id: 2,
        room_id: 2,
        session_number: 2,
        session_date: "2025-02-27",
        session_start: "12:00:00",
        session_end: "13:00:00",
        session_status: "Scheduled",
      },
      {
        student_id: 2,
        program_id: 2,
        room_id: 2,
        session_number: 3,
        session_date: "2025-02-28",
        session_start: "12:00:00",
        session_end: "13:00:00",
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
      {
        student_id: 2,
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
      {
        teacher_id: 4,
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
        student_payment_date: new Date(),
      },
      {
        enrollment_id: 2,
        amount_paid: 4000.0,
        payment_method: "Cash",
        student_payment_date: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("TeacherSalary", [
      {
        teacher_id: 1,
        total_sessions: 2,
        payment_date: new Date(),
        amount_paid: 1000.0,
      },
      {
        teacher_id: 2,
        total_sessions: 2,
        payment_date: new Date(),
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
