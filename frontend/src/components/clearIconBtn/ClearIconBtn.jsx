import React from "react";

import styles from "./ClearIconBtn.module.css";

const ClearIconBtn = ({ icon, onClickFunction }) => {
  return (
    <button onClick={onClickFunction} className={styles.ClearIconBtn}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};

export default ClearIconBtn;
