import * as Yup from "yup";

export const rescheduleValidationSchema = Yup.object().shape({
  new_date: Yup.string().required("Session date is required."),
  new_start_time: Yup.string().required("Start time is required."),
});
