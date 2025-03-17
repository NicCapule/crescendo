import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { DateTime } from "luxon";
import style from "./Confirm.module.css";
import { getInstrumentColor } from "../../utils/InstrumentColors";
import { PiWarningCircleFill } from "react-icons/pi";

function ForfeitConfirm({ title, onConfirm, details }) {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className={`${style.confirmContainer} ${style.forfeitConfirm}`}>
          <div className={style.confirmICon}>
            <PiWarningCircleFill size={150} color="#863636" />
          </div>
          <div className={style.confirmTitle}>
            <h2>{title}</h2>
          </div>
          <div className={style.confirmContent}>
            <h3>
              <i>Are you sure you want to forfeit this program?</i>
            </h3>
            <div className={style.forfeitDetails}>
              <div>
                <p>
                  <b>Student: </b>
                  {details.studentName}
                </p>
                <p>
                  <b>Teacher: </b>
                  {details.teacherName}
                </p>
                <p>
                  <b>Instrument: </b>
                  <span
                    className={`instContainer ${getInstrumentColor(
                      details.instrument
                    )}`}
                  >
                    {details.instrument}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <b>Sessions: </b>
                  {details.noOfSessions}
                </p>
                <p>
                  <b>Balance: </b>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                  }).format(details.remainingBalance)}
                </p>
                <p>
                  <b>Due: </b>
                  {DateTime.fromISO(details.dueDate).toFormat("MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className={style.confirmButtons}>
            <button
              className={style.yesButton}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Forfeit
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

export default ForfeitConfirm;
