import React from "react";
import { useState, useEffect } from "react";
import style from "./Profile.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { fetchInstruments } from "../../services/instrumentServices";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { teacherInstrumentsValidationSchema } from "../validations/teacherInstrumentsValidationSchema";
//===================================================================================//
function InstrumentField({
  currentInstruments,
  editingField,
  setEditingField,
  onSave,
  fieldName,
}) {
  const [instruments, setInstruments] = useState([]);
  const selectedInstruments = currentInstruments.map(
    (instrument) => instrument.instrument_id
  );
  //-----------------------------------------------//
  useEffect(() => {
    fetchInstruments()
      .then(setInstruments)
      .catch(() => console.error("Failed to fetch instruments"));
  }, []);
  //===================================================================================//
  const isEditing = editingField === fieldName;
  return isEditing ? (
    <Formik
      validationSchema={teacherInstrumentsValidationSchema}
      initialValues={{
        teacher_instruments: selectedInstruments,
      }}
      onSubmit={(values) => {
        onSave(values.teacher_instruments);
        setEditingField(null);
      }}
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        handleSubmit,
        resetForm,
      }) => (
        <div className={style.updateItem}>
          <Form className={style.instrumentsItem}>
            <div className={style.inputGroup}>
              <div className={style.instrumentButtons}>
                {instruments.map((instrument) => (
                  <button
                    key={instrument.instrument_id}
                    type="button"
                    className={
                      values.teacher_instruments.includes(
                        instrument.instrument_id
                      )
                        ? getInstrumentColor(instrument.instrument_name)
                        : ""
                    }
                    onClick={() => {
                      const updatedInstruments =
                        values.teacher_instruments.includes(
                          instrument.instrument_id
                        )
                          ? values.teacher_instruments.filter(
                              (id) => id !== instrument.instrument_id
                            )
                          : [
                              ...values.teacher_instruments,
                              instrument.instrument_id,
                            ];

                      setFieldValue("teacher_instruments", updatedInstruments);
                    }}
                  >
                    {instrument.instrument_name}
                  </button>
                ))}
              </div>
              <div>
                <ErrorMessage
                  name="teacher_instruments"
                  component="span"
                  className={style.errorMessage}
                />
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
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  ) : (
    <div className={style.teacherInstruments}>
      {currentInstruments.map((instrument, index) => (
        <div
          key={index}
          className={`${style.instContainer} ${getInstrumentColor(
            instrument.instrument_name
          )}`}
        >
          {instrument.instrument_name}
        </div>
      ))}
    </div>
  );
}

export default InstrumentField;
