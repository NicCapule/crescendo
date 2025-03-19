import React from "react";
import { confirmAlert } from "react-confirm-alert";
import style from "./Confirm.module.css";

function CreateUserConfirm({ title, message, onConfirm, createDetails }) {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className={`${style.confirmContainer} ${style.enrollConfirm}`}>
          <div className={style.confirmTitle}>
            <h2>{title}</h2>
            <h3>
              <i>
                {message}{" "}
                <b>
                  {createDetails.user_first_name} {createDetails.user_last_name}
                </b>
                ?
              </i>
            </h3>
          </div>
          <hr />

          <div className={style.confirmButtons}>
            <button
              className={style.yesButton}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Yes
            </button>
            <button className={style.noButton} onClick={onClose}>
              No
            </button>
          </div>
        </div>
      );
    },
  });
}

export default CreateUserConfirm;
