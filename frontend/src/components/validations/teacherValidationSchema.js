import * as Yup from "yup";
import { DateTime } from "luxon";

export const teacherValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is a required field."),
  user_first_name: Yup.string(),
  user_last_name: Yup.string().required("Last name is a required field."),
  teacher_phone: Yup.string()
    .matches(/^09\d{9}$/, "Invalid phone number.")
    .required("Phone number is required."),
  password: Yup.string().required("Password is a required field."),
  instruments: Yup.array().min(1, "At least one instrument must be selected."), //-----------------------------------------------//
  availability: Yup.array()
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
        return availability.every(({ day_of_week, start_time, end_time }) => {
          const key = `${day_of_week}-${start_time}-${end_time}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
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
});
