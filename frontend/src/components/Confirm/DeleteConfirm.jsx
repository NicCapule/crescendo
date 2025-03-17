import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import style from "./Confirm.module.css";
import { PiWarningCircleFill } from "react-icons/pi";

function DeleteConfirm({ title, onConfirm, details }) {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className={`${style.confirmContainer} ${style.deleteConfirm}`}>
          <div className={style.confirmICon}>
            <PiWarningCircleFill size={150} color="#863636" />
          </div>
          <div className={style.confirmTitle}>
            <h2>{title}</h2>
          </div>
          <div className={style.confirmContent}>
            <h3>
              <i>
                Are you sure you want to delete{" "}
                {details.role ? details.role : "Student"} <b>{details.name}</b>?
              </i>
            </h3>
          </div>

          <div className={style.confirmButtons}>
            <button
              className={style.yesButton}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Delete
            </button>
            <button className={style.noButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      );
    },
  });
}

export default DeleteConfirm;
