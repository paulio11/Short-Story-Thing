import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./CloseBook.module.css";
import Header from "../../components/header/Header";
import { backendAPI } from "../../api/AxiosConfig";
import { useAuth } from "../../contexts/AuthContext";

const CloseBook = () => {
  const { id, title } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [activityData, setActivityData] = useState({
    story: id,
    rating: 0,
    // progress: 100,
    note: "",
    is_public: true,
  });
  const { rating, note, is_public } = activityData;
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving();
    try {
      const { status } = await backendAPI.post("/activity/list/", activityData);
      if (status === 201) {
        nav(`/u/${user.username}`);
      }
    } catch (error) {
      console.error("Error recording activity:", error);
      setErrors(error.response?.data);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === "radio") {
      newValue = value === "true";
    }
    setActivityData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleRatingChange = (rating) => {
    setActivityData((prevData) => ({ ...prevData, rating: rating }));
  };

  const renderStars = () =>
    [1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={i <= rating ? styles.filledStar : styles.emptyStar}
        onClick={() => handleRatingChange(i)}
        role="button"
        aria-label={`Rate ${i} stars`}
      >
        ★
      </span>
    ));

  return (
    <div className="page">
      <Header title="Good job!" showBackButton backTo={"/stories"} />
      <div>
        <p>
          Want to rate <strong>{title}</strong> and/or leave a note?
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-input-group">
            <label htmlFor="note">Note</label>
            <textarea
              name="note"
              id="note"
              value={note}
              placeholder="Add a note, comment, or review here!"
              rows={8}
              onChange={handleChange}
            ></textarea>
          </div>
          {errors.note?.map((message, i) => (
            <div className="message alert" key={i}>
              {message}
            </div>
          ))}
          <div className="form-input-group">
            <label htmlFor="rating">Rating</label>
            <input
              hidden
              type="number"
              name="rating"
              id="rating"
              min={0}
              max={5}
              step={1}
              value={rating}
              onChange={(e) => handleRatingChange(e.target.value)}
            />
            <div className={styles.stars}>{renderStars()}</div>
          </div>
          {errors.rating?.map((message, i) => (
            <div className="message alert" key={i}>
              {message}
            </div>
          ))}
          <div className="radio-input-group">
            <label>
              <input
                type="radio"
                name="is_public"
                value="true"
                checked={is_public === true}
                onChange={handleChange}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                name="is_public"
                value="false"
                checked={is_public === false}
                onChange={handleChange}
              />
              Private
            </label>
          </div>
        </div>
        {errors.is_public?.map((message, i) => (
          <div className="message alert" key={i}>
            {message}
          </div>
        ))}
        <div className="button-row-between">
          <button
            type="button"
            disabled={!rating}
            onClick={() => handleRatingChange(0)}
          >
            Clear rating
          </button>
          <button onClick={() => nav(`/u/${user.username}`)} type="button">
            No thanks
          </button>
          <button type="submit" disabled={saving || (!rating && !note)}>
            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </form>
      {errors.non_field_errors?.map((message, i) => (
        <div className="message alert" key={i}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default CloseBook;
