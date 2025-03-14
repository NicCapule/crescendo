import React from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { paymentValidationSchema } from "../validations/paymentValidationSchema";
import { addPayment } from "../../services/studentPaymentServices";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import style from "./Forms.module.css";
//===================================================================================//
const initialValues = {
  amount_paid: null,
  payment_method: "",
};

//===================================================================================//
function AddPaymentForm() {
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails;
  const navigate = useNavigate();
  //-----------------------------------------------//
  const onSubmit = async (values) => {
    const requestData = {
      enrollment_id: paymentDetails.enrollment_id,
      amount_paid: values.amount_paid,
      payment_method: values.payment_method,
    };
    console.log(requestData);

    await addPayment(requestData);
  };
  //===================================================================================//
  return (
    <div
      className={`${style.formParentContainer} ${style.paymentParentContainer}`}
    >
      <h1>Add Payment</h1>
      <div className={style.programDetails}>
        <h2>Adding payment for: </h2>
        <div className={style.row}>
          <span>Student: </span>
          <b>
            {paymentDetails.Student.student_first_name}{" "}
            {paymentDetails.Student.student_last_name}
          </b>
        </div>
        <div className={style.row}>
          <span>Program: </span>
          <b>{paymentDetails.Program.Instrument.instrument_name}</b>
        </div>
        <hr />
        <div className={style.row}>
          <span>Total Paid: </span>
          <b>₱{paymentDetails.total_paid}</b>
        </div>
        <hr />
        <div className={style.row}>
          <span>Total Fee: </span>
          <b>₱{paymentDetails.total_fee}</b>
        </div>
        <div className={style.row}>
          <span>Remaining Balance: </span>
          <b>₱{paymentDetails.remaining_balance}</b>
        </div>
        <div className={style.row}>
          <span>Payment Due Date: </span>
          <b>
            {DateTime.fromISO(paymentDetails.due_date).toFormat(
              "MMMM d, yyyy "
            )}
          </b>
        </div>
      </div>
      <hr />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={paymentValidationSchema}
      >
        <Form className={style.paymentFormContainer}>
          <div className={`${style.formSection} ${style.paymentFormSection}`}>
            <div className={style.formItem}>
              <div className={style.itemHeader}>
                <label htmlFor="">Amount</label>
              </div>
              <Field name="amount_paid">
                {({ field, form }) => (
                  <input
                    {...field}
                    placeholder="PHP"
                    value={field.value ? `PHP ${field.value}` : ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^\d]/g, "");
                      form.setFieldValue("amount_paid", numericValue || "");
                    }}
                    onFocus={(e) => {
                      if (field.value === "0") {
                        form.setFieldValue("amount_paid", "");
                      }
                    }}
                    onBlur={() => {
                      if (!field.value) {
                        form.setFieldValue("amount_paid", "0");
                        form.setFieldValue("payment_method", "");
                      }
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="amount_paid"
                component="span"
                className={style.errorMessage}
              />
            </div>
            <div className={style.formItem}>
              <div className={style.itemHeader}>
                <label htmlFor="">Payment Method</label>
              </div>

              <Field as="select" name="payment_method">
                <option value="" disabled>
                  Select payment method
                </option>
                <option value="Cash">Cash</option>
                <option value="GCash">GCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </Field>
              <ErrorMessage
                name="payment_method"
                component="span"
                className={style.errorMessage}
              />
            </div>
          </div>
          <div className={style.paymentButtons}>
            <button type="submit">Add Payment</button>
            <button type="reset" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default AddPaymentForm;
