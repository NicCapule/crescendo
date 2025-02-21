import React from "react";
import { PiStudent } from "react-icons/pi";
import style from "./Dashboard.module.css";
function SummaryCard({ icon: Icon, title, count }) {
  return (
    <>
      <div className={style.cardContainer}>
        <div className={style.cardContent}>
          <Icon className={style.icon} />
          <div className={style.countData}>
            <p>{title}</p>
            <p>{count}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SummaryCard;
