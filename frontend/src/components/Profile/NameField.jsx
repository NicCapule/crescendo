import React from "react";
import style from "./Profile.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PiPencilSimple } from "react-icons/pi";
import { nameValidationSchema } from ".././validations/nameValidationSchema";
//===================================================================================//
function NameField({
  currentFirstName,
  currentLastName,
  editingField,
  setEditingField,
  onSave,
  fieldName,
}) {
  //===================================================================================//
  const isEditing = editingField === fieldName;
  return isEditing ? (
    <Formik
      validationSchema={nameValidationSchema}
      initialValues={{
        user_first_name: currentFirstName,
        user_last_name: currentLastName,
      }}
      onSubmit={(values) => {
        onSave(values.user_first_name, values.user_last_name);
        setEditingField(null);
      }}
    >
      {({ handleSubmit, resetForm }) => (
        <div className={style.updateItem}>
          <Form className={style.nameItem}>
            <div className={style.inputGroup}>
              <div>
                <Field
                  name="user_first_name"
                  type="text"
                  placeholder="First Name"
                  className={style.nameInput}
                  autoFocus
                />
                <ErrorMessage
                  name="user_first_name"
                  component="span"
                  className={style.errorMessage}
                />
              </div>

              <div>
                <Field
                  name="user_last_name"
                  type="text"
                  placeholder="Last Name"
                  className={style.nameInput}
                />
                <ErrorMessage
                  name="user_last_name"
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
    <h2>
      {currentFirstName} {currentLastName}
      <button
        className={style.editButton}
        onClick={() => {
          setEditingField(fieldName);
        }}
      >
        <PiPencilSimple />
      </button>
    </h2>
  );
}

export default NameField;
