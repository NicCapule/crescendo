import React from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { paymentValidationSchema } from "../validations/paymentValidationSchema";
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
  //-----------------------------------------------//
  const onSubmit = async (values) => {
    const requestData = {
      enrollment_id: paymentDetails.enrollment_id,
      amount_paid: values.amount_paid,
      payment_method: values.payment_method,
    };
    console.log(requestData);
  };
  //===================================================================================//
  return (
    <div
      className={`${style.formParentContainer} ${style.paymentParentContainer}`}
    >
      <div className={style.programDetails}>
        <p>
          Student:{" "}
          <b>
            {paymentDetails.Student.student_first_name}{" "}
            {paymentDetails.Student.student_last_name}
          </b>
        </p>
        <p>
          Program: <b>{paymentDetails.Program.Instrument.instrument_name}</b>
        </p>
        <p>
          Total Paid: <b>₱{paymentDetails.total_paid}</b>
        </p>
        <p>
          Total Fee: <b>₱{paymentDetails.total_fee}</b>
        </p>
        <p>
          Remaining Balance: <b>₱{paymentDetails.remaining_balance}</b>
        </p>
        <p>
          Payment Due Date: <b>{paymentDetails.due_date}</b>
        </p>
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
              <Field name="amount_paid" />
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
            <button type="reset">Cancel</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default AddPaymentForm;
