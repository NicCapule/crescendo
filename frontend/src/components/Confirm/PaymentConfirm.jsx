import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import style from "./Confirm.module.css";

function PaymentConfirm({ title, message, onConfirm, paymentDetails }) {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className={`${style.confirmContainer} ${style.paymentConfirm}`}>
          <div className={style.confirmTitle}>
            <h2>{title}</h2>
          </div>
          <hr />
          <div className={style.confirmContent}>
            <h3>
              <i>{message}</i>
            </h3>
            <p>
              Amount:{" "}
              <b>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "PHP",
                }).format(paymentDetails.amount_paid)}
              </b>
            </p>
            <p>
              Payment Method: <b>{paymentDetails.payment_method}</b>
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

export default PaymentConfirm;
