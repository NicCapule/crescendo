import React, { useState, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import {
  fetchTeacherProfile,
  updateAvailability,
  updatePhone,
  updateTeacherInstruments,
} from "../../services/teacherServices";
import style from "./Profile.module.css";
import { DateTime } from "luxon";
import {
  PiBookBookmarkBold,
  PiCalendarCheckBold,
  PiEnvelopeSimpleBold,
  PiMoneyBold,
  PiMusicNotesBold,
  PiPencilSimple,
  PiPhoneBold,
} from "react-icons/pi";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import AvailabilityTable from "./AvailabilityTable";
import SalaryTable from "./SalaryTable";
import NameField from "./NameField";
import EmailField from "./EmailField";
import PhoneField from "./PhoneField";
import InstrumentField from "./InstrumentField";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateEmail, updateName } from "../../services/userServices";
import ProgramTable from "./ProgramTable";
import ScheduleAvailability from "../Forms/ScheduleAvailability";
import { Formik, Form } from "formik";
import { availabilityValidationSchema } from "../validations/availabilityValidationSchema";
import { mergeAvailabilities } from "../../utils/TeacherCreationUtils";
import ChangePasswordModal from "../Modal/ChangePasswordModal";
//==============================================================================//
function TeacherProfile() {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const formikRef = useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  //---------------------------------------------------------------------------//
  if (!user) {
    return <p>Loading user data...</p>;
  }
  //---------------------------------------------------------------------------//
  useEffect(() => {
    fetchTeacherProfile(user.teacher_id)
      .then((data) => {
        setTeacherData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch teacher information", error);
        setLoading(false);
      });
  }, [user.user_id]);

  //---------------------------------------------------------------------------//
  const handleNameUpdate = async (newFirstName, newLastName) => {
    try {
      await updateName(user.user_id, newFirstName, newLastName);
      toast.success("Name updated!", {
        autoClose: 2000,
        position: "top-center",
      });
      const updatedProfile = await fetchTeacherProfile(user.teacher_id);
      setTeacherData(updatedProfile);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handleEmailUpdate = async (newEmail) => {
    try {
      await updateEmail(user.user_id, newEmail);
      toast.success("Email updated!", {
        autoClose: 2000,
        position: "top-center",
      });
      const updatedProfile = await fetchTeacherProfile(user.teacher_id);
      setTeacherData(updatedProfile);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handlePhoneUpdate = async (newPhone) => {
    try {
      await updatePhone(user.teacher_id, newPhone);
      toast.success("Phone number updated!", {
        autoClose: 2000,
        position: "top-center",
      });
      const updatedProfile = await fetchTeacherProfile(user.teacher_id);
      setTeacherData(updatedProfile);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };

  //---------------------------------------------------------------------------//
  const handleInstrumentsUpdate = async (newInstruments) => {
    try {
      await updateTeacherInstruments(user.teacher_id, newInstruments);
      toast.success("Instruments updated!", {
        autoClose: 2000,
        position: "top-center",
      });
      const updatedProfile = await fetchTeacherProfile(user.teacher_id);
      setTeacherData(updatedProfile);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  const handleAvailabilityUpdate = async (newAvailability) => {
    try {
      const mergedAvailability = mergeAvailabilities(newAvailability);
      await updateAvailability(user.teacher_id, mergedAvailability);
      toast.success("Availability schedules updated!", {
        autoClose: 2000,
        position: "top-center",
      });
      const updatedProfile = await fetchTeacherProfile(user.teacher_id);
      setTeacherData(updatedProfile);
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };
  //---------------------------------------------------------------------------//
  if (loading) {
    return <p>Loading profile...</p>;
  }
  if (!teacherData) {
    return <p>Teacher profile not found.</p>;
  }

  const selectedAvailabilities = teacherData.TeacherAvailabilities.map(
    (availability) => ({
      day_of_week: availability.day_of_week,
      start_time: availability.start_time,
      end_time: availability.end_time,
    })
  );
  //==============================================================================//
  return (
    <div className="compContainer">
      <h1 className="pageTitle">User Profile</h1>
      <hr />
      <div className={style.generalInfo}>
        <NameField
          currentFirstName={teacherData.User.user_first_name}
          currentLastName={teacherData.User.user_last_name}
          editingField={editingField}
          setEditingField={setEditingField}
          onSave={handleNameUpdate}
          fieldName="name"
        />

        <div className={style.teacherDetails}>
          <div>
            <EmailField
              currentEmail={teacherData.User.email}
              editingField={editingField}
              setEditingField={setEditingField}
              onSave={handleEmailUpdate}
              fieldName="email"
            />
            <PhoneField
              currentPhone={teacherData.teacher_phone}
              editingField={editingField}
              setEditingField={setEditingField}
              onSave={handlePhoneUpdate}
              fieldName="phone"
            />
          </div>

          <div className={style.teacherInstrumentsContainer}>
            <div className={style.teacherInstrumentsHeader}>
              <PiMusicNotesBold />
              <strong>
                {editingField === "instrument"
                  ? "Update  Instruments"
                  : "Instruments"}
              </strong>
              <button
                className={style.editButton}
                onClick={() => {
                  setEditingField("instrument");
                }}
              >
                <PiPencilSimple />
              </button>
            </div>
            <InstrumentField
              currentInstruments={teacherData.Instruments}
              editingField={editingField}
              setEditingField={setEditingField}
              onSave={handleInstrumentsUpdate}
              fieldName="instrument"
            />
          </div>
          <button
            onClick={() => {
              setShowPasswordModal(true);
            }}
          >
            Change Password
          </button>
        </div>
        {/* ------------------------------------------------ */}
      </div>
      <hr />
      <div className={style.infoRow}>
        <div className={style.availability}>
          <div className={style.rowItemHeader}>
            <PiCalendarCheckBold />
            <strong>
              {editingField === "availability"
                ? "Update Availability"
                : "Availability"}
            </strong>
            <button
              className={style.editButton}
              onClick={() => {
                setEditingField("availability");
              }}
            >
              <PiPencilSimple />
            </button>
            {editingField === "availability" && (
              <div className={style.updateButtons}>
                <button
                  type="submit"
                  className={style.saveButton}
                  onClick={() => formikRef.current.submitForm()}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={style.cancelButton}
                  onClick={() => {
                    formikRef.current.resetForm();
                    setEditingField(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {editingField === "availability" ? (
            <Formik
              validationSchema={availabilityValidationSchema}
              innerRef={formikRef}
              initialValues={{ availability: selectedAvailabilities }}
              onSubmit={(values) => {
                handleAvailabilityUpdate(values.availability);
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
                <Form className={style.availabilityForm}>
                  <ScheduleAvailability
                    values={values}
                    setFieldValue={setFieldValue}
                  />
                  <br />
                  {errors.availability &&
                    typeof errors.availability === "string" &&
                    touched.availability && (
                      <span className={style.errorMessage}>
                        {errors.availability}
                      </span>
                    )}
                </Form>
              )}
            </Formik>
          ) : (
            <AvailabilityTable
              currentAvailabilities={teacherData.TeacherAvailabilities}
              editingField={editingField}
              setEditingField={setEditingField}
              onSave={handleNameUpdate}
              fieldName="availability"
            />
          )}
        </div>
        <div className={style.teacherPrograms}>
          <div className={style.rowItemHeader}>
            <PiBookBookmarkBold />
            <strong>Assigned Programs</strong>
          </div>
          <ProgramTable programs={teacherData.Programs} />
        </div>
      </div>
      <hr />
      {/* ------------------------------------------------ */}
      <div className={style.salary}>
        <div className={style.rowItemHeader}>
          <PiMoneyBold />
          <strong>Salary History</strong>
        </div>
        <SalaryTable salaries={teacherData.TeacherSalaries} />
      </div>
      <ChangePasswordModal
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
      />
    </div>
  );
}

export default TeacherProfile;
