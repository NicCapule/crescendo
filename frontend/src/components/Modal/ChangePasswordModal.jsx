import React from "react";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import Modal from "react-modal";
import style from "./Modal.module.css";
import { DateTime } from "luxon";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ForfeitConfirm from "../Confirm/ForfeitConfirm";
import { Bounce, Slide, Zoom, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { updatePassword } from "../../services/userServices";
//=========================================================================================================//
function ChangePasswordModal({ showPasswordModal, setShowPasswordModal }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  //---------------------------------------------------------------------------//
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  //---------------------------------------------------------------------------//
  const handlePasswordChange = async (values) => {
    setLoading(true);
    try {
      const response = await updatePassword(
        user.user_id,
        values.oldPassword,
        values.newPassword
      );
      toast.success(response.message, {
        autoClose: 2000,
        position: "top-center",
      });
      setShowPasswordModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to change password", {
        autoClose: 2000,
        position: "top-center",
      });
    }
    setLoading(false);
  };

  // //---------------------------------------------------------------------------//
  // const forfeitCall = async (sessionId) => {
  //   try {
  //     await forfeitSession(sessionId);
  //     toast.success("Program forfeited!", {
  //       autoClose: 2000,
  //       position: "top-center",
  //     });
  //     setShowPasswordModal(false);
  //   } catch (error) {
  //     toast.error(error.message, {
  //       autoClose: 2000,
  //       position: "top-center",
  //     });
  //   }
  // };
  // //---------------------------------------------------------------------------//
  // const handleForfeit = async (
  //   sessionId,
  //   sessionDate,
  //   sessionStart,
  //   sessionEnd,
  //   sessionNumber
  // ) => {
  //   ForfeitConfirm({
  //     title: "Confirm Forfeit",
  //     type: "session",
  //     onConfirm: () => forfeitCall(sessionId),
  //     details: {
  //       sessionId: sessionId,
  //       sessionDate: sessionDate,
  //       sessionStart: sessionStart,
  //       sessionEnd: sessionEnd,
  //       sessionNumber: sessionNumber,
  //     },
  //   });
  // };
  //--------------------------------------//
  const closeModal = () => {
    setShowPasswordModal(false);
  };
  //--------------------------------------//
  Modal.setAppElement("#root");
  //=========================================================================================================//
  return (
    <>
      {showPasswordModal && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <div className={style.modalHeader}>
              <h2>Change Password</h2>
              <button className={style.closeButton} onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className={style.modalContent}>
              <div className={style.changePassword}>
                <Formik
                  onSubmit={handlePasswordChange}
                  initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={Yup.object({
                    oldPassword: Yup.string().required(
                      "Current password required"
                    ),
                    newPassword: Yup.string().required("New password required"),
                    confirmPassword: Yup.string()
                      .oneOf(
                        [Yup.ref("newPassword"), null],
                        "Passwords must match"
                      )
                      .required("Confirm new password"),
                  })}
                >
                  {({ isSubmitting }) => (
                    <Form className={style.passwordForm}>
                      <div className={style.passwordItem}>
                        <label>Old Password</label>
                        <div className={style.passwordWrapper}>
                          <Field
                            className={style.passwordField}
                            name="oldPassword"
                            type={
                              showPassword.oldPassword ? "text" : "password"
                            }
                          />
                          <span
                            className={style.eyeIcon}
                            onClick={() =>
                              togglePasswordVisibility("oldPassword")
                            }
                          >
                            {showPassword.oldPassword ? (
                              <PiEyeClosedBold />
                            ) : (
                              <PiEyeBold />
                            )}
                          </span>
                        </div>
                        <ErrorMessage
                          name="oldPassword"
                          component="div"
                          className={style.errorMessage}
                        />
                      </div>
                      <div className={style.passwordItem}>
                        <label>New Password</label>
                        <div className={style.passwordWrapper}>
                          <Field
                            className={style.passwordField}
                            name="newPassword"
                            type={
                              showPassword.newPassword ? "text" : "password"
                            }
                          />
                          <span
                            className={style.eyeIcon}
                            onClick={() =>
                              togglePasswordVisibility("newPassword")
                            }
                          >
                            {showPassword.newPassword ? (
                              <PiEyeClosedBold />
                            ) : (
                              <PiEyeBold />
                            )}
                          </span>
                        </div>
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className={style.errorMessage}
                        />
                      </div>
                      <div className={style.passwordItem}>
                        <label>Confirm Password</label>
                        <div className={style.passwordWrapper}>
                          <Field
                            className={style.passwordField}
                            name="confirmPassword"
                            type={
                              showPassword.confirmPassword ? "text" : "password"
                            }
                          />
                          <span
                            className={style.eyeIcon}
                            onClick={() =>
                              togglePasswordVisibility("confirmPassword")
                            }
                          >
                            {showPassword.confirmPassword ? (
                              <PiEyeClosedBold />
                            ) : (
                              <PiEyeBold />
                            )}
                          </span>
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className={style.errorMessage}
                        />
                      </div>
                      <div className={style.buttonContainer}>
                        <button
                          type="submit"
                          disabled={isSubmitting || loading}
                        >
                          {loading ? "Updating..." : "Change Password"}
                        </button>
                        <button type="reset" onClick={closeModal}>
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChangePasswordModal;
