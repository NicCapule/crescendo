import * as Yup from "yup";

export const phoneValidationSchema = Yup.object().shape({
  teacher_phone: Yup.string()
    .matches(/^09\d{9}$/, "Invalid phone number.")
    .required("Phone number is required."),
});
