import React from "react";
import style from "./Profile.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { emailValidationSchema } from ".././validations/emailValidationSchema";
import { PiEnvelopeSimpleBold, PiPencilSimple } from "react-icons/pi";
//===================================================================================//
function EmailField({
  currentEmail,
  editingField,
  setEditingField,
  onSave,
  fieldName,
}) {
  //===================================================================================//
  const isEditing = editingField === fieldName;
  return isEditing ? (
    <Formik
      validationSchema={emailValidationSchema}
      initialValues={{
        email: currentEmail,
      }}
      onSubmit={(values) => {
        onSave(values.email);
        setEditingField(null);
      }}
    >
      {({ handleSubmit, resetForm }) => (
        <div className={style.updateItem}>
          <Form className={style.emailItem}>
            <div className={style.inputGroup}>
              <div>
                <PiEnvelopeSimpleBold />
                <strong>Email:</strong>
              </div>

              <div>
                <Field
                  name="email"
                  type="text"
                  placeholder="Email"
                  className={style.emailInput}
                  autoFocus
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className={style.errorMessage}
                />
              </div>
            </div>
            <div className={style.updateButtons}>
              <button type="submit" className={style.saveButton}>
                Save
              </button>
              <button
                type="button"
                className={style.cancelButton}
                onClick={() => {
                  resetForm();
                  setEditingField(null);
                }}
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  ) : (
    <div className={style.contactInfo}>
      <PiEnvelopeSimpleBold />
      <strong>Email:</strong> {currentEmail}
      <button
        className={style.editButton}
        onClick={() => setEditingField(fieldName)}
      >
        <PiPencilSimple />
      </button>
    </div>
  );
}

export default EmailField;
