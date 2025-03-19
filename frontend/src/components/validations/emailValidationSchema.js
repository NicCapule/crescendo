import * as Yup from "yup";

export const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is a required field."),
});
