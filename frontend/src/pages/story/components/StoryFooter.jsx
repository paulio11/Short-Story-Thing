import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./StoryFooter.module.css";
import { useSettings } from "../../../contexts/SettingsContext";
import { backendAPI } from "../../../api/AxiosConfig";
import { useAuth } from "../../../contexts/AuthContext";

const StoryFooter = ({ percent, id, title }) => {
  const { settings } = useSettings();
  const { fetchUser } = useAuth();
  const finished = percent >= 100;
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const handleClick = async () => {
    setSaving(true);
    try {
      const { status } = await backendAPI.post("/activity/list/", {
        story: id,
        progress: finished ? 100 : percent.toFixed(2),
        is_public: true,
      });
      if (status === 201) {
        // Update user state for home page continue button
        fetchUser();
        if (finished) {
          nav(`/s/close/${id}/${title}`);
        }
      }
    } catch (error) {
      console.error("Error posting activity:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.footer}>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{
            width: `${percent}%`,
            backgroundColor: finished ? "#4caf50" : settings.bookmarkColor,
          }}
        ></div>
      </div>
      <div className={styles.percentage}>
        {percent <= 100 ? percent.toFixed(0) : "100"}%
      </div>
      <button
        disabled={saving}
        onClick={handleClick}
        className={styles.bookmarkBtn}
        style={{
          backgroundColor: finished ? "#4caf50" : settings.bookmarkColor,
        }}
      >
        {finished ? "Close Book" : saving ? "Saving" : "Bookmark"}
      </button>
    </div>
  );
};

export default StoryFooter;
