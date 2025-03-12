import * as Yup from "yup";

export const paymentValidationSchema = Yup.object().shape({
  amount_paid: Yup.number()
    .typeError("Amount must be a number")
    .min(1, "Amount must be at least ₱1")
    .required("Payment amount is required."),
  payment_method: Yup.string()
    .oneOf(["Cash", "Credit Card", "Bank Transfer", "GCash"], "Invalid method")
    .required("Payment method is required."),
});
