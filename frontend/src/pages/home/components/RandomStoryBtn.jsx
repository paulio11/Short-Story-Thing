import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./RandomStoryBtn.module.css";
import { backendAPI } from "../../../api/AxiosConfig";
import Modal from "../../../components/modal/Modal";

const RandomStoryBtn = () => {
  const [maxLength, setMaxLength] = useState(20000);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const nav = useNavigate();
  const displayedLength = maxLength < 20000 ? maxLength : "20000+";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, status } = await backendAPI.get(
        `/story/random/?max_length=${maxLength}`
      );
      if (status === 200) {
        const randomID = data.id;
        nav(`/s/${randomID}/0`);
      }
    } catch (error) {
      console.error("Error getting random story ID:", error);
      setShowError(true);
    }
  };

  const handleChange = (e) => {
    setShowError(false);
    setMaxLength(e.target.value);
  };

  return (
    <>
      <button className="button-with-icon" onClick={() => setShow(!show)}>
        <span className="material-symbols-outlined">menu_book</span> Read a
        random story
      </button>
      <Modal showModal={show} setShowModal={setShow}>
        <form onSubmit={handleSubmit} className={styles.randomForm}>
          <div>
            <label htmlFor="max_length">Set a max length:</label>
            <input
              type="range"
              name="max_length"
              id="max_length"
              value={maxLength}
              onChange={handleChange}
              min={1000}
              max={20000}
              step={500}
              className={styles.lengthInput}
            />
          </div>
          <div className="button-row-between">
            <span>{displayedLength} words</span>
            <button type="submit">Read!</button>
          </div>
        </form>
        {showError && (
          <div className="message alert">
            There are no unread stories with less than {maxLength} words!
          </div>
        )}
      </Modal>
    </>
  );
};

export default RandomStoryBtn;
