import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import style from "./Confirm.module.css";

const LogoutConfirm = ({ title, message, onConfirm }) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className={style.confirmContainer}>
          <h1>{title}</h1>
          <p>{message}</p>
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

export default LogoutConfirm;
