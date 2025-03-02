import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Bookmark.module.css";
import { useSettings } from "../../contexts/SettingsContext";

const Bookmark = ({ progress, id }) => {
  const { settings } = useSettings();
  const { bookmarkColor } = settings;
  const nav = useNavigate();

  return (
    <div
      className={styles.bookmark}
      onClick={() => nav(`/s/${id}/${progress}`)}
    >
      <div
        className={styles.bookmarkTop}
        style={{ backgroundColor: bookmarkColor }}
      >
        {progress.toFixed(0)}%
      </div>
      <div
        className={styles.bookmarkBottom}
        style={{ borderTopColor: bookmarkColor }}
      ></div>
    </div>
  );
};

export default Bookmark;
