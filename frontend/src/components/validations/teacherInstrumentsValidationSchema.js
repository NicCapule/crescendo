import * as Yup from "yup";

export const teacherInstrumentsValidationSchema = Yup.object().shape({
  teacher_instruments: Yup.array().min(
    1,
    "At least one instrument must be selected."
  ),
});
