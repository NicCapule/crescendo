import React from "react";
import style from "./Profile.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { phoneValidationSchema } from "../validations/phoneValidationSchema";
import { PiPencilSimple, PiPhoneBold } from "react-icons/pi";
//===================================================================================//
function PhoneField({
  currentPhone,
  editingField,
  setEditingField,
  onSave,
  fieldName,
}) {
  //===================================================================================//
  const isEditing = editingField === fieldName;
  return isEditing ? (
    <Formik
      validationSchema={phoneValidationSchema}
      initialValues={{
        teacher_phone: currentPhone,
      }}
      onSubmit={(values) => {
        onSave(values.teacher_phone);
        setEditingField(null);
      }}
    >
      {({ handleSubmit, resetForm }) => (
        <div className={style.updateItem}>
          <Form className={style.phoneItem}>
            <div className={style.inputGroup}>
              <div>
                <PiPhoneBold />
                <strong>Phone:</strong>
              </div>
              <div>
                <Field
                  name="teacher_phone"
                  type="text"
                  placeholder="Phone"
                  className={style.phoneInput}
                  autoFocus
                />
                <ErrorMessage
                  name="teacher_phone"
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
      <PiPhoneBold />
      <strong>Phone:</strong> {currentPhone}
      <button
        className={style.editButton}
        onClick={() => setEditingField(fieldName)}
      >
        <PiPencilSimple />
      </button>
    </div>
  );
}

export default PhoneField;
