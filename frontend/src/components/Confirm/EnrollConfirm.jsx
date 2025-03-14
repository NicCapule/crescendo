import { confirmAlert } from "react-confirm-alert";
import style from "./Confirm.module.css";

const EnrollConfirm = ({ title, message, onConfirm, enrollmentDetails }) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className={`${style.confirmContainer} ${style.enrollConfirm}`}>
          <div className={style.confirmTitle}>
            <h2>{title}</h2>
            <h3>
              <i>
                {message} <b>{enrollmentDetails.student_full_name}</b>?
              </i>
            </h3>
          </div>
          <hr />
          <div className={style.confirmContent}>
            <p>
              <b>Enrollment Details:</b>
            </p>
            <p>
              Instrument: <b>{enrollmentDetails.instrument_name}</b>
            </p>
            <p>
              Teacher: <b>{enrollmentDetails.teacher_full_name}</b>
            </p>
            <p>
              Sessions: <b>{enrollmentDetails.noOfSessions}</b>
            </p>
            <hr />
            <p>
              Amount: <b>₱{enrollmentDetails.amount_paid}</b>
            </p>
            <p>
              Payment Method: <b>{enrollmentDetails.payment_method}</b>
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
};

export default EnrollConfirm;
