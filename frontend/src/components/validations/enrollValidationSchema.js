import * as Yup from "yup";
import { DateTime } from "luxon";

export const enrollValidationSchema = Yup.object().shape({
  student_id: Yup.string().when("isNewStudent", {
    is: false,
    then: (schema) => schema.required("A student is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  student_first_name: Yup.string(),
  student_last_name: Yup.string().when("isNewStudent", {
    is: true,
    then: (schema) => schema.required("Last name is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  student_email: Yup.string().when("isNewStudent", {
    is: true,
    then: (schema) =>
      schema
        .required("Email is a required field.")
        .email("Invalid email format"),
    otherwise: (schema) => schema.notRequired(),
  }),
  student_phone: Yup.string().when("isNewStudent", {
    is: true,
    then: (schema) =>
      schema
        .required("Phone number is required.")
        .matches(/^09\d{9}$/, "Invalid phone number."),
    otherwise: (schema) => schema.notRequired(),
  }),
  student_age: Yup.number().when("isNewStudent", {
    is: true,
    then: (schema) => schema.required("Age is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  instrument: Yup.number().required("An instrument is required."),
  teacher_id: Yup.number().required("A teacher is required."),
  noOfSessions: Yup.number()
    .oneOf([8, 16], "Number of sessions must be either 8 or 16.")
    .required("Number of sessions is required."),
  amount_paid: Yup.number(),
  payment_method: Yup.string().when("amount_paid", {
    is: (value) => value > 0,
    then: (schema) => schema.required("Please select a payment method."),
    otherwise: (schema) => schema.notRequired(),
  }),
  availability: Yup.array().when("isNewStudent", {
    is: true,
    then: (schema) =>
      schema
        .of(
          Yup.object().shape({
            day_of_week: Yup.string().required("Day is required."),
            start_time: Yup.string().required("Start time is required."),
            end_time: Yup.string()
              .required("End time is required.")
              .test(
                "is-after-start",
                "End time must be after start time.",
                function (end_time) {
                  const { start_time } = this.parent;
                  if (!start_time || !end_time) return false;

                  const start = DateTime.fromFormat(start_time, "HH:mm:ss");
                  const end = DateTime.fromFormat(end_time, "HH:mm:ss");

                  return end > start;
                }
              ),
          })
        )
        .min(1, "At least one availability slot must be selected.")
        .test(
          "no-duplicate-entries",
          "Duplicate availability entries are not allowed.",
          (availability) => {
            const seen = new Set();
            return availability.every(
              ({ day_of_week, start_time, end_time }) => {
                const key = `${day_of_week}-${start_time}-${end_time}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              }
            );
          }
        )
        .test(
          "no-overlapping-times",
          "Availability slots cannot overlap.",
          (availability) => {
            const dayOrder = {
              Sunday: 0,
              Monday: 1,
              Tuesday: 2,
              Wednesday: 3,
              Thursday: 4,
              Friday: 5,
              Saturday: 6,
            };
            const sortedAvailability = [...availability].sort((a, b) => {
              return (
                dayOrder[a.day_of_week] - dayOrder[b.day_of_week] ||
                a.start_time - b.start_time
              );
            });
            for (let i = 0; i < sortedAvailability.length - 1; i++) {
              const {
                day_of_week: day1,
                start_time: start1,
                end_time: end1,
              } = sortedAvailability[i];

              const { day_of_week: day2, start_time: start2 } =
                sortedAvailability[i + 1];

              if (day1 === day2) {
                if (end1 > start2) {
                  return false;
                }
              }
            }
            return true;
          }
        ),
    otherwise: (schema) => schema.min(0),
  }),
  sessionSchedules: Yup.array()
    .of(
      Yup.object().shape({
        session_date: Yup.string().required("Session date is required."),
        session_start_time: Yup.string().required("Start time is required."),
        session_end_time: Yup.string().required("End time is required."),
      })
    )
    .test(
      "no-duplicate-sessions",
      "Duplicate session entries are not allowed.",
      (sessionSchedules) => {
        const seen = new Set();
        return sessionSchedules.every(
          ({ session_date, session_start_time, session_end_time }) => {
            const key = `${session_date}-${session_start_time}-${session_end_time}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }
        );
      }
    )
    .default([]),
});
