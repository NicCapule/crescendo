import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { DateTime } from "luxon";
import style from "./Confirm.module.css";

function RescheduleConfirm({
  title,
  message,
  onConfirm,
  oldSchedule,
  newSchedule,
}) {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className={`${style.confirmContainer} ${style.reschedConfirm}`}>
          <div className={style.confirmTitle}>
            <h2>{title}</h2>
          </div>
          <hr />
          <p>
            <i>
              Are you sure you want to reschedule{" "}
              <b>session {oldSchedule.session_number}</b>?
            </i>
          </p>
          <div className={style.confirmContent}>
            <p>
              <i>From:</i>
              <span>
                {DateTime.fromISO(oldSchedule.old_date).toFormat(
                  "MMMM d, yyyy"
                )}
                /{" "}
                {`${DateTime.fromFormat(
                  oldSchedule.old_start_time,
                  "HH:mm:ss"
                ).toFormat("h:mma")} - ${DateTime.fromFormat(
                  oldSchedule.old_end_time,
                  "HH:mm:ss"
                ).toFormat("h:mma")}`}
              </span>
            </p>

            <p>
              <i>To:</i>
              <b>
                {DateTime.fromISO(newSchedule.new_date).toFormat(
                  "MMMM d, yyyy"
                )}
                /{" "}
                {`${DateTime.fromFormat(
                  newSchedule.new_start_time,
                  "HH:mm:ss"
                ).toFormat("h:mma")} - ${DateTime.fromFormat(
                  newSchedule.new_end_time,
                  "HH:mm:ss"
                ).toFormat("h:mma")}`}
              </b>
            </p>
          </div>

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

export default RescheduleConfirm;
