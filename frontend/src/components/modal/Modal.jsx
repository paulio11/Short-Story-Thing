import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import styles from "./Modal.module.css";
import ClearIconBtn from "../clearIconBtn/ClearIconBtn";
import ButtonsActivity from "./ButtonsActivity";
import ButtonsStory from "./ButtonsStory";

const Modal = (props) => {
  useEffect(() => {
    if (props.showModal) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [props.showModal]);

  let buttons;

  // Expandable in future for more modal uses
  if (props.type === "activity") {
    buttons = <ButtonsActivity {...props} />;
  } else if (props.type === "story") {
    buttons = <ButtonsStory {...props} />;
  }

  if (!props.showModal) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeBtn}>
          <ClearIconBtn
            icon="close"
            onClickFunction={() => props.setShowModal(false)}
          />
        </div>
        {props.children}
        <div className={styles.buttons}>{buttons}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
