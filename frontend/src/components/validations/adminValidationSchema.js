import * as Yup from "yup";

export const adminValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is a required field."),
  user_first_name: Yup.string(),
  user_last_name: Yup.string().required("Last name is a required field."),
  password: Yup.string().required("Password is a required field."),
});
