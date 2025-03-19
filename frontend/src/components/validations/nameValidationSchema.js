import * as Yup from "yup";
import { DateTime } from "luxon";

export const nameValidationSchema = Yup.object().shape({
  user_first_name: Yup.string(),
  user_last_name: Yup.string().required("Last name is required."),
});
